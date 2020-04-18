"""
QuandlのAPI KEYはjsonに保存しておく

{root_directory}/environment/qundle.config.json
    {"API_KEY":YOUR_API_KEY}

"""

import os
import json
import quandl
import numpy as np


# 環境変数から取得
ENV_QUANDL_CONFIG_PATH = 'QUANDL_CONFIG_PATH'
ENV_API_KEY = 'API_KEY'

QUANDL_CONFIG_PATH = os.getenv(ENV_QUANDL_CONFIG_PATH)
if QUANDL_CONFIG_PATH is None:
    raise BaseException('Env {} is not set.'.format(ENV_QUANDL_CONFIG_PATH))
with open(QUANDL_CONFIG_PATH, 'r') as f:
    CONFIG = json.load(f)
    API_KEY = CONFIG.get(ENV_API_KEY)
if API_KEY is None:
    raise BaseException('Env {} is not set.'.format(ENV_API_KEY))

quandl.ApiConfig.api_key = API_KEY

# 入力したTSEコードの株価を2017年の分まで取得

# DATA = quandl.get('TSE/3105', returns='numpy',
#                   start_date="2019-12-31", end_date="2020-04-01")
# np.save('TSE_3105', DATA)
