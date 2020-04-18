/**
 * kabutanコードをfirestoreに登録する。
 */
import { initializeApp } from '../firebase'
import { firestore } from 'firebase-admin'
import kabutanCode from '../kabutanCode.json'
import { COMPANY_REF, COMPANY_DATA_DOCREF } from '../constants'

initializeApp()
const fstore = firestore()

const column2firestore = () => {
    const batch = fstore.batch()
    kabutanCode.data.getTopAssistances.map(item => {
        batch.set(fstore.collection(COMPANY_REF).doc(item.original_name), {
            code: parseInt(item.code)
        }, { merge: true })
    })
    batch.commit().then(v => {
        console.log("Succeeded!")
    }).catch(e => {
        console.error("Errored", e)
    })
}
import { Kabutan } from '../@types/kabutan'
import { promises } from 'fs'

const data2firestore = async () => {
    const jsonDataPath = './data'
    const files = await promises.readdir(jsonDataPath)
    await Promise.all(files.map(async (file, i) => {
        const batch = fstore.batch()
        const newPath = jsonDataPath + '/' + file
        const datas = JSON.parse((await promises.readFile(newPath)).toString()) as Kabutan.Data[]
        const companyName = file.split('.')[0]
        const snapshot = await fstore.collection(COMPANY_REF).doc(companyName).collection(COMPANY_DATA_DOCREF).get()
        if (snapshot.docs.length !== 0) return
        datas.forEach((data) => {
            const [year, month, day] = data.date.split('/')
            delete data.date
            // convert data to firestore
            const firestoreDate = firestore.Timestamp.fromDate(new Date(parseInt("20" + year), parseInt(month) - 1, parseInt(day)))
            batch.set(
                fstore.collection(COMPANY_REF).doc(companyName).collection(COMPANY_DATA_DOCREF).doc(`20${year}-${month}-${day}`),
                { ...data, Date: firestoreDate }
            )
        })
        await batch.commit()
    }))
};


data2firestore()