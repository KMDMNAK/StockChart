import React, { useState } from 'react'
import { hot } from 'react-hot-loader/root'
import { searchCompanyName } from '../firebase'

type PredictHandlerState = { inputWord: string, predictValues: string[] }
const PredictContext = React.createContext({ inputWord: '', predictValues: [] } as PredictHandlerState)
const PredictHandler = (props: { children: JSX.Element }) => {
    const [predictInfo, setPredictInfo] = useState({ inputWord: '', predictValues: [] } as PredictHandlerState)
    console.debug('PredictHandler', { predictInfo })
    return (
        <>
            <label>
                <input type="text" onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    await changeInputWord(event.target.value, setPredictInfo)
                }} />
            </label>
            <PredictContext.Provider value={predictInfo}>
                {props.children}
            </PredictContext.Provider>
        </>
    )
}

const changeInputWord = async (inputWord: string, setPredictInfo: (info: PredictHandlerState) => void) => {
    const predictValues = await searchCompanyName(inputWord)
    setPredictInfo({ inputWord, predictValues })
}

const SearchCompany = (props: { decideCompany: (inputWord: string) => any }) => {
    return (
        <PredictHandler>
            <PredictContext.Consumer>
                {(predictInfo) => predictInfo.predictValues.map(companyName => (
                    <div key={companyName} onClick={() => props.decideCompany(companyName)}>
                        {companyName}
                    </div>))
                }
            </PredictContext.Consumer>
        </PredictHandler>)
}


export default hot(SearchCompany)