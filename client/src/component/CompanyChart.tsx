import React, { useEffect, useState, useContext } from 'react'
import { hot } from 'react-hot-loader/root'
import { COMPANY_DATA_REF, COMPANY_REF } from '../constants'
import { fstore } from '../firebase'
import { firestore } from 'firebase'
import ReactEcharts from 'echarts-for-react';

const companyDataRef = (companyName: string) => fstore
    .collection(COMPANY_REF)
    .doc(companyName)
    .collection(COMPANY_DATA_REF)

let original_data: FirestoreQuery.CompanyData[] | null = null

const createOption = (companyName: string, data: { name: string, value: any[] }[]) => {
    return {
        title: {
            text: companyName
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params: { name: string, value: any[] }[]) {
                const param = params[0];
                return param.name + ' : ' + param.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };
}


const CompanyDataContext = React.createContext({ loading: true, data: [], companyName: '' } as { companyName: string, loading: boolean, data: FirestoreQuery.CompanyData[] })
type CompanyDataHandlerState = { loading: boolean, companyName: string, data: FirestoreQuery.CompanyData[] }
const CompanyDataHandler = (props: { companyName: string, children: JSX.Element }) => {
    const [companyDataState, setCompanyDataState] = useState({ loading: true, companyName: '', data: [] } as CompanyDataHandlerState)
    console.debug('CompanyDataHandler', { companyDataState, companyName: props.companyName })
    if (companyDataState.loading) {
        companyDataRef(props.companyName).get().then(snapshot => {
            console.debug('CompanyDataHandler', 'Get Datas from firestore.')
            const data = snapshot.docs.slice(-50).map(doc => doc.data() as FirestoreQuery.CompanyData)
            if (data.length === 0) console.warn(`No data is for ${props.companyName}`)
            setCompanyDataState({ loading: false, data, companyName: props.companyName })
        })
    } else if (companyDataState.companyName !== props.companyName) {
        setCompanyDataState({ ...companyDataState, loading: true })
    }
    return (
        <CompanyDataContext.Provider value={companyDataState}>
            {props.children}
        </CompanyDataContext.Provider>)
}

const AttrContext = React.createContext('DoD')
const AttrButton = (props: { children: JSX.Element }) => {
    const [attr, setAttr] = useState('DoD')
    const attrChoice = ['CR', 'DoD', 'DoDP', 'HP', 'LP', 'OR', 'Rev']
    console.debug('AttrButtonZ', { attr })
    return (<>
        {attrChoice.map(eachAttr => (< button key={eachAttr} onClick={() => { setAttr(eachAttr) }}>{eachAttr}</button>))}
        <AttrContext.Provider value={attr}>
            {props.children}
        </AttrContext.Provider>
    </>)
}
const createChartData = (data: FirestoreQuery.CompanyData[], attr: string) => data.map((eachData: any) => {
    return {
        name: eachData.Date.toDate(),
        value: [eachData.Date.toDate().toLocaleString(), eachData[attr]]
    }
})
export const Chart = () => {
    // const [companyData, setCompanyData] = useState([] as { name: string, value: any[] }[])
    const attr = useContext(AttrContext)
    const { loading, data, companyName } = useContext(CompanyDataContext)
    const [chartState, setChartState] = useState({ chartData: [], attr, companyName: companyName } as { attr: string, companyName: string, chartData: { name: string, value: any[] }[] })
    console.debug('Chart', { attr, chartState, data })
    useEffect(() => {
        if (!loading && (chartState.attr !== attr || chartState.chartData.length === 0 || chartState.companyName !== companyName)) {
            setChartState({ chartData: createChartData(data, attr), attr, companyName: companyName })
        }
    }, [companyName, attr])
    return (
        <>
            {chartState.chartData.length !== 0 && (<ReactEcharts option={createOption(chartState.companyName, chartState.chartData)} />)}
        </>
    )
}


const CompanyChart = (props: { companyName: string }) => (
    <CompanyDataHandler companyName={decodeURIComponent(props.companyName)}>
        <AttrButton>
            <Chart />
        </AttrButton>
    </CompanyDataHandler>
)

/**
 * 各企業の株価を表示
 * @param props 
 */
const CompanyData = (props: { companyName: string }) => {
    const [companyData, setCompanyData] = useState([] as FirestoreQuery.CompanyData[])
    useEffect(() => {
        if (companyData.length !== 0) return
        fstore
            .collection(COMPANY_REF)
            .doc(props.companyName)
            .collection(COMPANY_DATA_REF)
            .get().then(snapshot => {
                setCompanyData(snapshot.docs.slice(-5).map(doc => doc.data() as FirestoreQuery.CompanyData))
            })
    })

    return (
        <table>
            {companyData.length !== 0 && (<>
                <tr>{Object.keys(companyData[0]).map(columnName => <th>{columnName}</th>)}</tr>
                {companyData.map(companyData => {
                    const clientCompanyData = { ...companyData, Date: (companyData.Date as firestore.Timestamp).toDate().toLocaleString() }
                    return (
                        <tr>
                            {Object.values(clientCompanyData).map(columnData => (
                                <td>{columnData}</td>
                            ))}
                        </tr>
                    )
                })}
            </>)}
        </table>
    )
}

export default hot(CompanyChart)