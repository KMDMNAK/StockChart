import { firestore } from 'firebase-admin'
import { COMPANY_REF } from '../constants'

const fstore = firestore()
// kabutanからデータを取得&取得したデータをfirestoreに格納する。
export const updateCompanyData = async () => {
    const companySnapshot = await fstore.collection(COMPANY_REF).get()
    companySnapshot.docs.map(doc => {
        const companyName = doc.id
    })
}