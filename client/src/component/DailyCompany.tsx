/**
 * firestore
 *   Daily/UpCompanies/{Date}/{array}
 *   Daily/DownCompanies/{Date}/{array}
 * 上記に保存されている五社のデータを表示する。
 */

import React, { useEffect, useState, Suspense } from 'react'
import { hot } from 'react-hot-loader/root'
import { upCompaniesRef, downCompaniesRef } from '../firebase'
import { firestore } from 'firebase'

const CompanyCard = (props: { clickCompanyName: any, data: FirestoreQuery.CompanyData & { name: string } }) => (
    <span style={{ margin: '10px' }} key={props.data.name}>
        <div style={{ textAlign: 'center', padding: '30px' }}
            onClick={() => { props.clickCompanyName(props.data.name) }}>
            {props.data.name}
        </div>
        <div>
            <li style={{ padding: '10px' }}>
                前日比 : {props.data.DoD}
            </li>
            <li style={{ padding: '10px' }}>
                前日比% : {props.data.DoDP}
            </li>
        </div>
    </span>)

const FiveCompanies = (props: {
    type: 'UP' | 'DOWN',
    companies: FirestoreQuery.UpOrDownFiveCompanies,
    clickCompanyName: DailyCompany.ClickCompanyName
}) => {
    if (props.companies.length !== 5) console.warn('Company datas length is not five.')
    return (
        <>
            <div style={{ textAlign: 'center' }}>
                {props.type === 'UP' ? '前日より上がった企業TOP5' : '前日より下がった企業TOP5'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {props.companies.map(data => <CompanyCard data={data} clickCompanyName={props.clickCompanyName} />)}
            </div>
        </>)
}
const FetchHandler = (reference: firestore.DocumentReference) => {
    const viewDate = new Date()
    if (viewDate.getDay() === 0) {
        viewDate.setDate(viewDate.getDate() - 3);
    } else {
        viewDate.setDate(viewDate.getDate() - 2);
    }
    return reference.get().then(snapshot => {
        const data = snapshot.data()
        console.log(data)
        if (!snapshot.exists || !data) return
        let dateString = getViewDateString(viewDate)
        console.debug({ dateString })
        let fiveCompanies = data[dateString] as FirestoreQuery.UpOrDownFiveCompanies
        if (!fiveCompanies) {
            dateString = getViewDateString(new Date())
            console.debug({ dateString })
            fiveCompanies = data[dateString] as FirestoreQuery.UpOrDownFiveCompanies
        }
        return { fiveCompanies, dateString }
    })

}


const getViewDateString = (dateObj: Date) => {
    const year = String(dateObj.getFullYear())
    const month = String(dateObj.getMonth() + 1)
    const date = String(dateObj.getDate())
    return `${year}-${month.length === 1 ? "0" + month : month}-${date.length === 1 ? "0" + date : date}`
}



const promiseUp = () => FetchHandler(upCompaniesRef)
const promiseDown = () => FetchHandler(downCompaniesRef)

const DailyCompany = (props: { clickCompanyName: DailyCompany.ClickCompanyName }) => {
    const clickCompanyName = props.clickCompanyName ? props.clickCompanyName : (companyName: string) => console.log(companyName)

    const [upCompanies, setUpCompanies] = useState([] as FirestoreQuery.UpOrDownFiveCompanies)
    const [downCompanies, setDownCompanies] = useState([] as FirestoreQuery.UpOrDownFiveCompanies)
    const [dateString, setDateString] = useState<String | null>(null)
    useEffect(() => {
        Promise.all([
            promiseUp(),
            promiseDown()
        ]).then(([upResult, downResult]) => {
            if (!upResult || !downResult) return
            const newUpCompanies = upResult.fiveCompanies
            const newDownCompanies = downResult.fiveCompanies
            if (newUpCompanies && upCompanies.length !== newUpCompanies.length) {
                setUpCompanies(newUpCompanies || [])
            }
            if (newDownCompanies && downCompanies.length !== newDownCompanies.length) {
                setDownCompanies(newDownCompanies || [])
            }
            if (upResult.dateString === downResult.dateString) {
                setDateString(upResult.dateString)
            }
        })
    }, [null])
    return (
        <>
            <h2 style={{ textAlign: 'center', marginTop: '100px' }}>{dateString}の上位5社</h2>
            <div>
                <div style={{ marginTop: '50px' }}>
                    <FiveCompanies type='UP' companies={upCompanies} clickCompanyName={clickCompanyName} />
                </div>
                <div style={{ marginTop: '50px' }}>
                    <FiveCompanies type='DOWN' companies={downCompanies} clickCompanyName={clickCompanyName} />
                </div>
            </div>
        </>
    )
}

export default hot(DailyCompany)
