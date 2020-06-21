
/**
 * OneTap buy記載企業についてのデータを取得する。
 * 
 * company RefのlastDateを見て、今日からの差分を計算し、登録する。
 * copanyRefからlastDateを取得
 * (Error Handling) lastDateのdata Refがあるか確認
 * 今日からの差分を検索
 * kabutanから最深のページを取得、必要に応じて2ページ目以降も取得
 */

// import kabutanCode from '../../kabutanCode.json'
import { getStockData, KabutanDataColumns } from './data'

import { firestore } from 'firebase-admin'
import { initializeApp } from '../../firebase'
import { COMPANY_REF, COMPANY_DATA_REF } from '../../constants'
import { Kabutan } from '../../@types/kabutan'
initializeApp()
const fstore = firestore()

export const getKabutanTodayDateStr = () => {
    const today = new Date()
    const month = String(today.getMonth() + 1)
    return `${String(today.getFullYear()).slice(2)}/${month.length === 1 ? "0" + month : month}/${today.getDate()}`
}

/**
 * 
 * @param date date : ex) 20/05/11
 */
export const kabutanDate2FirestoreDate = (date: string) => {
    const [original_year, month, day] = date.split('/')
    const year = `20${original_year}`
    const firestoreDate = firestore.Timestamp.fromDate(
        new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    )
    return { str: `${year}-${month}-${day}`, timestamp: firestoreDate }
}

export const kabutanData2FirestoreData = async (batch: firestore.WriteBatch, companyName: string, data: KabutanDataColumns) => {
    const { str, timestamp } = kabutanDate2FirestoreDate(data.Date)
    delete data.Date
    // convert data to firestore
    await batch.set(
        fstore.collection(COMPANY_REF).doc(companyName).collection(COMPANY_DATA_REF).doc(str),
        { ...data, Date: timestamp }
    )
    return str
}

type KabutanData = { kabutanCode: string, lastDate?: String }
export class GetMetaDataFromFirestore {
    async updateCompanies() {
        const snapshot = await fstore.collection(COMPANY_REF).get()
        for await (let doc of snapshot.docs.slice(60)) {
            console.debug(doc.id)
            const fstoreData = doc.data() as KabutanData
            const todayDateStr = getKabutanTodayDateStr()
            await this.untilSpecificDateDataContained(doc.id, fstoreData, todayDateStr)
            await doc.ref.set({ lastDate: kabutanDate2FirestoreDate(todayDateStr).str }, { merge: true })
            await new Promise(resolve => setTimeout(() => { resolve() }, 1000))
        }
    }

    private async untilSpecificDateDataContained(companyname: string, fstoreData: KabutanData, todayDateStr: string) {
        const batch = fstore.batch()
        console.debug({ todayDateStr })
        if (fstoreData.lastDate === todayDateStr) return
        let result = false
        let page = 0
        while (!result) {
            const kabutanDatas = await getStockData(fstoreData.kabutanCode, 'day', page)
            // console.debug({ kabutanDatas })
            if (kabutanDatas.length === 0) break
            const results = await Promise.all(kabutanDatas.map(async data => {
                if (data.Date === fstoreData.lastDate) return true
                const str = await kabutanData2FirestoreData(batch, companyname, data)
                return false
            }))
            result = results.some(_ => _)
            page++;
        }
        await batch.commit()
    }
}

export class OneTapBuy2Firestore {
    companyInfo: { name: string, code: string, original_name: string }[] | null = null
    constructor() { }
    // Onetap buy記載企業のkabutan codeを取得する。
    getInfo() {
        // this.companyInfo = kabutanCode.data.getTopAssistances

    }

    // 指定した日付のデータを取得
    getDatas_onetapbuy() { }

    // 今日までのデータを全て取得
    getAllDatas_onetapbuy() {

    }

    // 全ての会社について、同様の操作を行う。
    applyAllCompanies() {

    }

}

const gmdf = new GetMetaDataFromFirestore()
gmdf.updateCompanies().then(v => {
    console.log(v)
}).catch(e => {
    console.error(e)
})