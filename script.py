"""
with open("onetapbuy.txt","r",encoding="utf-8") as f:
    t = f.read()
names = t.split("\n")
import re
for i in range(len(names)):
    search = re.search(r'.*?HD$', names[i])
    if (search != None):
        names[i] = re.sub(r'(.*?)(HD$)', r'\1ホールディングス', names[i])

with open("onetapbuy2.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(names))

"""

import requests

with open("onetapbuy.txt", "r", encoding="utf-8") as f:
    t = f.read()
names = t.split("\n")
uri = "http://localhost:3000/api"
start=120
data = {
    "query":'''
query($var:[String]){
  getTopAssistances(inputTexts:$var){
    code
    name
    original_name
  }
}
''',
"variables": {
    "var":names[start:126]
}
}
res = requests.post(uri, json=data)
print("names={}".format(len(names)))
print(start)
import json
with open('data.json', "r", encoding="utf-8") as f:
    json_ob = json.loads(f.read())
    getTopAssistances = json_ob["data"]["getTopAssistances"]
    getTopAssistances.extend(res.json()["data"]["getTopAssistances"])
with open('data.json', "w", encoding="utf-8") as f:
    #f.write(res.text)
    json.dump({"data":{"getTopAssistances":getTopAssistances}}, f)
res.close()