import { hot } from 'react-hot-loader/root'
import React, { useState, useEffect } from 'react'
//import firebase from 'firebase'
import { fstore } from '../firebase'

const Content = () => {
    const [data, setData] = useState({} as FirestoreQuery.CompanyData)
    useEffect(() => {
        fstore.collection('Company').doc('AGC').collection('Data').doc('2018-06-29').get().then(
            v => {
                console.log(v.data())
                setData(v.data() as FirestoreQuery.CompanyData)
            }
        )
    })
    return (<>
        <table style={{ textAlign: 'center' }}>
            <tr>
                {Object.keys(data).map(eachColum => (
                    <th key={eachColum}>
                        {eachColum}
                    </th>
                ))}
            </tr>
            <tr>
                {Object.values(data).map((eachColum, i) => (
                    <th key={String(i)}>
                        {String(eachColum)}
                    </th>
                ))}
            </tr>
        </table>
    </>)
}

export default Content