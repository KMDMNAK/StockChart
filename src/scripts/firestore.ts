import { initializeApp } from '../firebase'
import { firestore } from 'firebase-admin'
import kabutanCode from '../kabutanCode.json'
import { COMPANY_REF, COMPANY_DATA_REF } from '../constants'
import { FirestoreQuery } from '../@types/firestore'
initializeApp()
const fstore = firestore()

// last updated dateをfirestoreへ登録
const updateLastDate = async () => {
    const snapshot = await fstore.collection(COMPANY_REF).get()
    const companyNames = snapshot.docs.map(doc => doc.id)
    companyNames.map(async (name: string, i) => {
        const dataDoc = await fstore
            .collection(COMPANY_REF)
            .doc(name)
            .collection(COMPANY_DATA_REF)
            .orderBy('Date', 'desc').limit(1).get()
        const latestDoc = dataDoc.docs[0]
        //const date = (latestDoc.data().Date as FirebaseFirestore.Timestamp).toDate()
        await fstore
            .collection(COMPANY_REF)
            .doc(name)
            .set({ lastDate: latestDoc.id })
    })
}
