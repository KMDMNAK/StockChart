
import fetch from 'node-fetch';
import execAll from 'execall'

const columnCorrespond: { [key: string]: string } = {
    日付: "date",
    始値: "OR",
    高値: "HP",
    安値: "LP",
    終値: "CR",
    前日比: "DoD",
    "前日比％": "DoDP",
    "売買高(株)": "Rev"
}

const HEADER = {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //"content-type": "application/json"
}
const PULL_DOWN_URL = "https://kabutan.jp/pulldown/";
type PullDown = {
    code: string,
    name: string
}
export const getPullDown = async (inputString: string): Promise<PullDown[]> => {
    const resp = await fetch(PULL_DOWN_URL, {
        method: 'POST',
        body: `input_string=${inputString}`,
        headers: HEADER
    })
    const body = await resp.text()
    const bodyJson = (() => { try { return JSON.parse(body) } catch (e) { console.error(e); console.log(body); return [] } })()
    return bodyJson.map((each_text: string) => {
        const [code, name] = each_text.split(" ")
        return { code, name }
    })
}
type DateType = 'day' | 'wek' | 'shin' | 'mon' | 'yar'
export const getStockData = async (code: string, type: DateType, page: Number) => {
    const actualPage = page !== -1 ? page : 0
    const tableText = await getStockChartTable(code, type, actualPage)
    return extractData(tableText);
}

const getStockChartTable = async (code: string, type: string, page: Number) => {
    // 4661
    const url = `https://kabutan.jp/stock/kabuka?code=${code}&ashi=${type}&page=${page}`;
    const respText = await fetch(url).then(v => v.text())
    return getTable(respText)
}

const TBODY_PATTERN = /<table class="stock_kabuka[^0].?">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/m;
const getTable = (text: string) => {
    const matchObject = TBODY_PATTERN.exec(text);
    if (matchObject === null) throw Error("no match exception")
    const table = matchObject[0]
    return table;
}

const TR_PATTERN = /<tr>([\s\S]*?)<\/tr>/g
const DATA_PATTERN = />([^<|^\r|^\n]+)</g
const createColumn = (firstTrs: execAll.Match) => {
    const each_data = execAll(DATA_PATTERN, firstTrs.match);
    if (each_data === null) throw Error('No match');
    return each_data.map((each_match: execAll.Match) => each_match.subMatches[0])
}
const extractData = (tableText: string) => {
    const trs = execAll(TR_PATTERN, tableText)
    if (trs === null) throw Error("no match in tr error");
    //一番最初は項目である前提でコラムを作成
    const columns = createColumn(trs[0])
    return trs.slice(1).map((each_tr) => {
        const each_data = execAll(DATA_PATTERN, each_tr.match);
        if (each_data === null) return;
        return columns.reduce((data, columnName, index) => {
            const each_match = each_data[index]
            data[columnCorrespond[columnName]] = columnName === "日付" ? each_match.subMatches[0] : +each_match.subMatches[0].replace(/,/g, '')
            return data
        }, {} as { [key: string]: string | number })
    })
}



