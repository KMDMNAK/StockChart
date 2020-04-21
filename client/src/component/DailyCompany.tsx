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


const FiveCompanies = (props: { type: 'UP' | 'DOWN', companies: FirestoreQuery.UpOrDownFiveCompanies }) => {
    if (props.companies.length !== 5) console.warn('Company datas length is not five.')
    return (
        <>
            <div style={{ textAlign: 'center' }}>
                {props.type === 'UP' ? '前日より上がった企業TOP5' : '前日より下がった企業TOP5'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {props.companies.map(data => (
                    <span style={{ margin: '10px' }}>
                        <div style={{textAlign:'center',padding:'30px'}}>{data.name}</div>
                        <div>
                            <span style={{ padding: '10px' }}>
                                {data.DoD}
                            </span>
                            <span style={{ padding: '10px' }}>
                                {data.DoDP}
                            </span>
                        </div>
                    </span>
                ))}
            </div>
        </>)
}
const FetchHandler = (reference: firestore.DocumentReference, wantDate: string) => {
    return reference.get().then(snapshot => {
        const data = snapshot.data()
        console.log(data)
        if (!snapshot.exists || !data) return
        const fiveCompanies = data[wantDate] as FirestoreQuery.UpOrDownFiveCompanies
        return fiveCompanies
    })

}
const promiseUp = (wantDate: string) => FetchHandler(upCompaniesRef, wantDate)
const promiseDown = (wantDate: string) => FetchHandler(downCompaniesRef, wantDate)

const DailyCompany = (props: { wantDate: string }) => {
    const [upCompanies, setUpCompanies] = useState([] as FirestoreQuery.UpOrDownFiveCompanies)
    const [downCompanies, setDownCompanies] = useState([] as FirestoreQuery.UpOrDownFiveCompanies)
    useEffect(() => {
        Promise.all([
            promiseUp(props.wantDate),
            promiseDown(props.wantDate)
        ]).then(([newUpCompanies, newDownCompanies]) => {
            if (newUpCompanies && upCompanies.length !== newUpCompanies.length) {
                setUpCompanies(newUpCompanies || [])
            }
            if (newDownCompanies && downCompanies.length !== newDownCompanies.length) {
                setDownCompanies(newDownCompanies || [])
            }
        })
    })
    return (
        <>
            <div style={{ marginTop: '100px' }}>
                <FiveCompanies type='UP' companies={upCompanies} />
            </div>
            <div style={{ marginTop: '50px' }}>
                <FiveCompanies type='DOWN' companies={downCompanies} />
            </div>
        </>
    )
}

export default hot(DailyCompany)
