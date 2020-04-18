
/**
 * OneTap buy記載企業についてのデータを取得する。
 */
import kabutanCode from '../../kabutanCode.json'
import { getStockData } from './data'

export class OneTapBuy {
    companyInfo: { name: string, code: string, original_name: string }[] | null = null
    constructor() {
        this.getInfo()
    }
    // Onetap buy記載企業のkabutan codeを取得する。
    getInfo() {
        this.companyInfo = kabutanCode.data.getTopAssistances
    }
    // 指定した日付のデータを取得
    getDatas_onetapbuy() {

    }

    // 今日までのデータを全て取得
    getAllDatas_onetapbuy() {

    }
}
