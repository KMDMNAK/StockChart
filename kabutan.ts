
import fetch from 'node-fetch';
import execAll from 'execall'
//import { Key } from 'react';

const getPulldown = async (inputString: string) => {
    const url = "https://kabutan.jp/pulldown/";
    /*const params = new URLSearchParams();
    params.append('input_string', inputString);
    */
    return fetch(url, {
        method: 'POST',
        body: `input_string=${inputString}`,
        headers: {
            accept: "application/json, text/javascript",
            "accept-encoding": "gzip, deflate, br",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(json => {
            return json.map((each_text: string) => {
                const codename=each_text.split(" ")
                    return {code:codename[0],name:codename[1]}
                })
        });
}

const getStockChartTable = async (code: string,type:string,page:Number) => {
    // 4661
    const url = `https://kabutan.jp/stock/kabuka?code=${code}&ashi=${type}&page=${page}`;
    console.log(url)
    return fetch(url)
        .then((res: any) => { return res.text() })
        .then((text: any) => {
            return getTable(text)
        })
}

const getTable = (text: string) => {
    const tbody_pattern = /<table class="stock_kabuka[^0].?">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/m;
    const matchObject = tbody_pattern.exec(text);
    if (matchObject === null) {
        throw Error("no match exception")
    }
    const table = matchObject[0]
    return table;
}

const extractData = (tableText: string) => {
    const tr_pattern = /<tr>([\s\S]*?)<\/tr>/g
    const trs = execAll(tr_pattern, tableText)

    if (trs === null) {
        throw Error("no match in tr error");
    }
    //console.log("trs")
    //console.log(trs)
    const data_pattern = />([^<|^\r|^\n]+)</g
    const result: any[] = []
    let isStart = true;
    let columns: string[]=[]
    trs.forEach((each_tr: execAll.Match) => {
        //console.log("each_tr")
        //console.log(each_tr)
        const each_data = execAll(data_pattern, each_tr.match);
        //console.log(each_data)
        if (each_data === null) {
            return;
        }
        //一番最初は項目である前提でコラムを作成
        if (isStart) {
            columns = each_data.map((each_match: execAll.Match) => {
                return each_match.subMatches[0]
            })
            isStart = false;
            return;
        }
        const data: { [Key: string] :any}={}
        for (let i = 0; i < columns.length; i++) {
            const each_match = each_data[i]
            
            if (columns[i] === "日付") {
                data[columnConvert[columns[i]]] = each_match.subMatches[0]
            } else {
                const converted = +each_match.subMatches[0].replace(/,/g, "")
                data[columnConvert[columns[i]]] = converted
            }
        }
        result.push(data)
    })
    //console.log(result);
    return result;
}
const getStockData = async (code: string, type: string,page:Number) => {
    if (page !== -1) {
        console.log("specific page");
        const tableText = await getStockChartTable(code,type,page)
        return extractData(tableText);
    }
    const tableText = await getStockChartTable(code,type,0)
    return extractData(tableText);
}

const columnConvert:{[key:string]:string}={
    日付: "date",
    始値: "OR",
    高値: "HP",
    安値: "LP",
    終値: "CR",
    前日比: "DoD",
    "前日比％": "DoDP",
    "売買高(株)": "Rev"
}

module.exports = {
    getPulldown: getPulldown,
    getStockData:getStockData
}