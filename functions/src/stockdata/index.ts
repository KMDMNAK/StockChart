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

//
export const a = async (companyName: string) => {
    const companySnapshot = await fstore.collection(COMPANY_REF).doc(companyName).get()
    const data = companySnapshot.data() as { lastDate: string }
    const lastDate = data.lastDate
    const date = new Date()
    const todayString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    todayString
}