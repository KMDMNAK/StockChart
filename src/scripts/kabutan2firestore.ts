/**
 * kabutanコードをfirestoreに登録する。
 */
import { initializeApp } from '../firebase'
import { firestore } from 'firebase-admin'
import kabutanCode from '../kabutanCode.json'
import { COMPANY_REF } from '../constants'

initializeApp()

const execute = () => {
    const fstore = firestore()
    const batch = fstore.batch()
    kabutanCode.data.getTopAssistances.map(item => {
        batch.set(fstore.collection(COMPANY_REF).doc(item.name), {
            code: parseInt(item.code)
        }, { merge: true })
    })
    batch.commit().then(v => {
        console.log("Succeeded!")
    }).catch(e => {
        console.error("Errored", e)
    })
}


execute()