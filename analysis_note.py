# %%
from sklearn.mixture import GaussianMixture
import json
import numpy as np
def getData(uri,columnsname):
    with open(uri, "r", encoding="utf-8") as f:
        json_ob = json.loads(f.read())
    return map(lambda x: float(x[columnsname]), json_ob)
data = getData("C:/Users/tyobe/workspace/projects/QLapi/server/src/kabutan/stockdatas/AGC.json", "OR")
data = np.array(list(data))

#%%
import matplotlib.pyplot as plt
plt.plot(data)
plt.show()
#%%
import numpy as np
data = np.reshape(data, (-1, 1))

GMM = GaussianMixture(n_components=2)

GMM.fit(data)
labels=GMM.predict(data)

#%%
print(labels)

#%%
plt.plot(data)
#list(map(lambda x:[0,x]),labels)
X = [w for w in range(len(labels))]
Y= [0 for w in range(len(labels))]
plt.scatter(X,Y,s=10,c=labels)
plt.show()

#%%
def calcDiff(data):
    diffs_amount = 7
    diffs = np.zeros((diffs_amount, len(data) - 1))
    for i in range(diffs_amount):
        diff = data[: - i-1] - data[i+1:]
        while (len(diff) < len(data) - 1):
            diff=np.append(diff,0)
        diffs[i] = diff
    return diffs
diffs =calcDiff(data)

#%%
test=np.apply_along_axis(lambda x:x.mean(),axis=1,arr=diffs.T)
print(test)
#%%
len(data)

#%%
