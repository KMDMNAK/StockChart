const kabutan = require("./kabutan")

const resolvers = {
    Query: {

        assistance: async (obj, args, context, info) => {
            console.log(args.inputText)
            const ob = await kabutan.getPulldown(args.inputText)
            //return [{code:"4661",name:"オリエンタルランド"}]
            return ob
        },
        stockdata: async (obj, args, context, info) => {
            const code = args.objects.code;
            let datatype = args.objects.datatype;
            let page = args.objects.page;
            if (!page) page = -1;
            if (!datatype) datatype = "day"
            const ob = await kabutan.getStockData(code, type = datatype, page = page)
            return ob
        },
        getTopAssistances_sync: async (obj, args, context, info) => {
            const companyNames = args.inputTexts
            const result = []
            let flag = false
            companyNames.forEach(each_name => {
                while (flag) { }
                flag = true;
                kabutan.getPulldown(each_name).then(pulldowns => {
                    const top_pulldown = pulldowns[0];
                    if (top_pulldown === undefined) {
                        return { original_name: each_name };
                    }
                    top_pulldown["original_name"] = each_name;
                    return top_pulldown;
                }).then(value => {
                    result.push(value);
                })
                flag = false;
            })
            return result
        },
        getTopAssistances_async: async (obj, args, context, info) => {
            const companyNames = args.inputTexts
            const result = []

            console.log(companyNames)
            return Promise.all(companyNames.map(
                async each_name => {
                    const pulldowns = await kabutan.getPulldown(each_name)
                    const top_pulldown = pulldowns[0]
                    if (top_pulldown === undefined) {
                        return { original_name: each_name }
                    }
                    top_pulldown["original_name"] = each_name;
                    //result.push(top_pulldown);
                    return top_pulldown
                }
            )).then(results => {
                return results
            })
        }
    }
}
module.exports = {
    resolvers: resolvers
}