import requests
import json
with open("data.json", "r", encoding="utf-8") as f:
    code_list = json.loads(f.read())


def getData(code, page):
    uri = "http://localhost:3000/api"
    data = {
        "query": '''
            query($var:StockDataCondition){
  stockdata(objects:$var){
  date
  OR
  HP
  LP
  CR
  DoD
  DoDP
  Rev
  }
}
        ''',
        "variables": {
            "var": {
                "page": page,
                "code": code,
                "datatype": "day"
            }
        }
    }
    res = requests.post(uri, json=data)
    return res.json()


"""

"data": {
    "stockdata"

"""
import os
import time

if __name__ == "__main__":
    lists = code_list["data"]["getTopAssistances"]
    for gettingCode in range(1,len(lists)):
        print(lists[gettingCode]["original_name"])
        if (os.path.isfile("stockdatas/{}.json".format(lists[gettingCode]["original_name"]))):
            print("skip")
            continue
        page = 1
        json_ob = getData(lists[gettingCode]["code"], page)["data"]["stockdata"]
        result = []
        while (json_ob != []):
            
            result.extend(json_ob)
            page += 1
            json_ob = getData(lists[gettingCode]["code"], page)["data"]["stockdata"]
        with open("stockdatas/{}.json".format(lists[gettingCode]["original_name"]), "w", encoding="utf-8") as f:
            json.dump(result, f)
        time.sleep(2)