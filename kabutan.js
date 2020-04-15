"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
exports.__esModule = true;
var node_fetch_1 = __importDefault(require("node-fetch"));
var execall_1 = __importDefault(require("execall"));
//import { Key } from 'react';
var getPulldown = function (inputString) { return __awaiter(_this, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        url = "https://kabutan.jp/pulldown/";
        /*const params = new URLSearchParams();
        params.append('input_string', inputString);
        */
        return [2 /*return*/, node_fetch_1["default"](url, {
                method: 'POST',
                body: "input_string=" + inputString,
                headers: {
                    accept: "application/json, text/javascript",
                    "accept-encoding": "gzip, deflate, br",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                return json.map(function (each_text) {
                    var codename = each_text.split(" ");
                    return { code: codename[0], name: codename[1] };
                });
            })];
    });
}); };
var getStockChartTable = function (code, type, page) { return __awaiter(_this, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        url = "https://kabutan.jp/stock/kabuka?code=" + code + "&ashi=" + type + "&page=" + page;
        console.log(url);
        return [2 /*return*/, node_fetch_1["default"](url)
                .then(function (res) { return res.text(); })
                .then(function (text) {
                return getTable(text);
            })];
    });
}); };
var getTable = function (text) {
    var tbody_pattern = /<table class="stock_kabuka[^0].?">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/m;
    var matchObject = tbody_pattern.exec(text);
    if (matchObject === null) {
        throw Error("no match exception");
    }
    var table = matchObject[0];
    return table;
};
var extractData = function (tableText) {
    var tr_pattern = /<tr>([\s\S]*?)<\/tr>/g;
    var trs = execall_1["default"](tr_pattern, tableText);
    if (trs === null) {
        throw Error("no match in tr error");
    }
    //console.log("trs")
    //console.log(trs)
    var data_pattern = />([^<|^\r|^\n]+)</g;
    var result = [];
    var isStart = true;
    var columns = [];
    trs.forEach(function (each_tr) {
        //console.log("each_tr")
        //console.log(each_tr)
        var each_data = execall_1["default"](data_pattern, each_tr.match);
        //console.log(each_data)
        if (each_data === null) {
            return;
        }
        //一番最初は項目である前提でコラムを作成
        if (isStart) {
            columns = each_data.map(function (each_match) {
                return each_match.subMatches[0];
            });
            isStart = false;
            return;
        }
        var data = {};
        for (var i = 0; i < columns.length; i++) {
            var each_match = each_data[i];
            if (columns[i] === "日付") {
                data[columnConvert[columns[i]]] = each_match.subMatches[0];
            }
            else {
                var converted = +each_match.subMatches[0].replace(/,/g, "");
                data[columnConvert[columns[i]]] = converted;
            }
        }
        result.push(data);
    });
    //console.log(result);
    return result;
};
var getStockData = function (code, type, page) { return __awaiter(_this, void 0, void 0, function () {
    var tableText_1, tableText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(page !== -1)) return [3 /*break*/, 2];
                console.log("specific page");
                return [4 /*yield*/, getStockChartTable(code, type, page)];
            case 1:
                tableText_1 = _a.sent();
                return [2 /*return*/, extractData(tableText_1)];
            case 2: return [4 /*yield*/, getStockChartTable(code, type, 0)];
            case 3:
                tableText = _a.sent();
                return [2 /*return*/, extractData(tableText)];
        }
    });
}); };
var columnConvert = {
    日付: "date",
    始値: "OR",
    高値: "HP",
    安値: "LP",
    終値: "CR",
    前日比: "DoD",
    "前日比％": "DoDP",
    "売買高(株)": "Rev"
};
module.exports = {
    getPulldown: getPulldown,
    getStockData: getStockData
};
