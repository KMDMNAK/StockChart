import React, { useState, KeyboardEvent } from 'react'
import { hot } from 'react-hot-loader/root'
import { searchCompanyName } from '../firebase'

type PredictHandlerState = { inputWord: string, predictValues: string[] }
const PredictContext = React.createContext({ inputWord: '', predictValues: [] } as PredictHandlerState)
const PredictHandler = (props: { children: React.ReactNode, decideCompany: (inputWord: string) => any }) => {
    const [predictInfo, setPredictInfo] = useState({ inputWord: '', predictValues: [] } as PredictHandlerState)
    console.debug('PredictHandler', { predictInfo })
    return (
        <>
            <label>
                <input type="text" onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                    await changeInputWord(event.target.value, setPredictInfo)
                }} autoComplete="on" list="companies"
                    onKeyDown={(event: KeyboardEvent) => {
                        if (event.key === 'Enter') {
                            props.decideCompany(predictInfo.inputWord)
                        }
                    }}
                />
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
        <PredictHandler decideCompany={props.decideCompany}>
            <datalist id="companies">
                <PredictContext.Consumer>
                    {(predictInfo) => predictInfo.predictValues.map(companyName => (
                        <option key={companyName} style={{ margin: 10 }}>
                            {companyName}
                        </option>))
                    }
                </PredictContext.Consumer>
            </datalist>
        </PredictHandler>)
}


export default hot(SearchCompany)