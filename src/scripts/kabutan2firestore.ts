/**
 * kabutanコードをfirestoreに登録する。
 */
import { initializeApp } from '../firebase'
import { firestore } from 'firebase-admin'
import kabutanCode from '../kabutanCode.json'
import { COMPANY_REF, COMPANY_DATA_REF } from '../constants'
import { writeFileSync, promises } from 'fs'
import { Kabutan } from '../../@types/kabutan'

initializeApp()
const fstore = firestore()

// localにあるjsonファイルのデータをfirestoreにupdate
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



const data2firestore = async () => {
    const jsonDataPath = './data'
    const files = await promises.readdir(jsonDataPath)
    await Promise.all(files.map(async (file, i) => {
        const batch = fstore.batch()
        const newPath = jsonDataPath + '/' + file
        const datas = JSON.parse((await promises.readFile(newPath)).toString()) as Kabutan.Data[]
        const companyName = file.split('.')[0]
        const snapshot = await fstore.collection(COMPANY_REF).doc(companyName).collection(COMPANY_DATA_REF).get()
        if (snapshot.docs.length !== 0) return
        datas.forEach((data) => {
            const [year, month, day] = data.date.split('/')
            delete data.date
            // convert data to firestore
            const firestoreDate = firestore.Timestamp.fromDate(new Date(parseInt("20" + year), parseInt(month) - 1, parseInt(day)))
            batch.set(
                fstore.collection(COMPANY_REF).doc(companyName).collection(COMPANY_DATA_REF).doc(`20${year}-${month}-${day}`),
                { ...data, Date: firestoreDate }
            )
        })
        await batch.commit()
    }))
};


// kabutanCodeをcompanyRefに登録する。
const kabutanCode2firestore = async () => {
    const companyRef = await fstore.collection(COMPANY_REF)
    const yetToBeWritten = [] as { code: string, original_name: string, name: string }[]
    await Promise.all(kabutanCode.data.getTopAssistances.map(async item => {
        const snapshot = await companyRef.doc(item.original_name).get()
        if (!snapshot.exists) {
            return yetToBeWritten.push(item)
        }
        const { kabutanCode } = snapshot.data() as { kabutanCode: string | undefined }
        if (kabutanCode) return
        await snapshot.ref.set({ kabutanCode: item.code }, { merge: true })
    }))
    writeFileSync('yetToBeWritten.json', JSON.stringify(yetToBeWritten))
}


const [_, __, command] = process.argv
console.debug({ command })
if (command === 'local') {
    data2firestore()
} else if (command === 'code') {
    kabutanCode2firestore()
}
