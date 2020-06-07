import yfinance as yf
import json

"""
    [
        {
            Company Name
            Symbol
        }
    ]
"""

COMPANYNAME_REF = 'Company Name'
SYMBOL_REF = 'Symbol'

with open('data/NASDAQ/nasdaq-listed-symbols.json', 'r') as f:
    nasdaq_list = json.loads(f.read())

# convert json adapt for data name to code architecture.
from functools import reduce


def nameToCode(accum, item):
    company_name = item.get(COMPANYNAME_REF)
    if company_name is None:
        return accum
    company_name_for_search = company_name.replace(" ", "").lower()
    accum[company_name_for_search] = {
        "code": item.get(SYMBOL_REF), "name": company_name}
    return accum


name2code = reduce(nameToCode, nasdaq_list, {})


def search_company_code(query):
    query = query.replace(" ", "").lower()
    candidate_words = {}
    for company_name_for_search, item in name2code.items():
        if company_name_for_search.find(query) != -1:
            candidate_words[item.get('name')] = item.get('code')
    return candidate_words


# result = search_company_code("Micro")
# print(result)

# msft = yf.Ticker("MSFT")
# print(msft)
# # get stock info
# msft.info
# msft.history(period="1mo")
