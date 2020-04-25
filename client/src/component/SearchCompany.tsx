import React, { useState, useContext } from 'react'
import { hot } from 'react-hot-loader/root'
import { firestore } from 'firebase'

import { fstore } from '../utils/firebase'
import { COMPANY_REF } from '../constants'

type PredictHandlerState = { inputWord: string, predictValues: string[] }
const PredictContext = React.createContext({ inputWord: '', predictValues: [] } as PredictHandlerState)
const PredictHandler = (props: { children: JSX.Element }) => {
    const [predictInfo, setPredictInfo] = useState({ inputWord: '', predictValues: [] } as PredictHandlerState)
    console.debug('PredictHandler', { predictInfo })
    return (
        <>
            <label>
                <input type="text" onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { await changeInputWord(event.target.value, setPredictInfo) }} />
            </label>
            <PredictContext.Provider value={predictInfo}>
                {props.children}
            </PredictContext.Provider>
        </>
    )
}

const changeInputWord = (inputWord: string, setPredictInfo: (info: PredictHandlerState) => void) => {

    if (inputWord.length === 0) return setPredictInfo({ inputWord, predictValues: [] })
    fstore.collection(COMPANY_REF).orderBy(firestore.FieldPath.documentId()).startAt(inputWord).limit(5).get().then(snapshot => {
        const predictValues = []
        for (let doc of snapshot.docs) {
            if (!doc.id.startsWith(inputWord)) return setPredictInfo({ inputWord, predictValues })
            predictValues.push(doc.id)
        }
        return setPredictInfo({ inputWord, predictValues })
    })
}

const SearchCompany = (props: { decideCompany: (inputWord: string) => any }) => {
    // const predictInfo = useContext(PredictContext)
    // const predictValues = predictInfo.predictValues
    // console.debug('SearchCompany', { predictValues })
    return (
        <PredictHandler>
            <PredictContext.Consumer>
                {(predictInfo) => predictInfo.predictValues.map(companyName => (<div key={companyName} onClick={() => props.decideCompany(companyName)}>{companyName}</div>))}
            </PredictContext.Consumer>
        </PredictHandler>)
}


export default hot(SearchCompany)