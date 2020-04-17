
import fetch from 'node-fetch';
import execAll from 'execall'

const columnCorrespond = {
    日付: "date",
    始値: "OR",
    高値: "HP",
    安値: "LP",
    終値: "CR",
    前日比: "DoD",
    "前日比％": "DoDP",
    "売買高(株)": "Rev"
}

const PULL_DOWN_URL = "https://kabutan.jp/pulldown/";
export const getPullDown = async (inputString: string) => {
    const respJson = await fetch(PULL_DOWN_URL, {
        method: 'POST',
        body: `input_string=${inputString}`,
        headers: {
            accept: "application/json, text/javascript",
            "accept-encoding": "gzip, deflate, br",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })
    return respJson.map((each_text: string) => {
        const codename = each_text.split(" ")
        return { code: codename[0], name: codename[1] }
    })
}

export const getStockData = async (code: string, type: string, page: Number) => {
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

const getTable = (text: string) => {
    const tbody_pattern = /<table class="stock_kabuka[^0].?">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/m;
    const matchObject = tbody_pattern.exec(text);
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
    const result = trs.slice(1).map((each_tr, i) => {
        const each_data = execAll(DATA_PATTERN, each_tr.match);
        if (each_data === null) return;
        const data: { [Key: string]: any } = {}
        columns.forEach((column, i) => {
            const each_match = each_data[i]
            data[columnCorrespond[column]] = column === "日付" ? each_match.subMatches[0] : +each_match.subMatches[0].replace(/,/g, '')
        })
        return data
    })
    return result;
}




