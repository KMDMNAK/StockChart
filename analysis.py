from sklearn.mixture import GaussianMixture
import matplotlib.pyplot as plt
import numpy as np
import json


def getData(uri, columnsname):
    with open(uri, "r", encoding="utf-8") as f:
        json_ob = json.loads(f.read())
    return np.array(list(map(lambda x: float(x[columnsname]), json_ob)))


def predictGMM(data):
    if (data.shape != (-1, 1)):
        data = np.reshape(data, (-1, 1))
    GMM = GaussianMixture(n_components=2)
    GMM.fit(data)
    labels = GMM.predict(data)
    return labels


def getLabelGMM(labels, data):
    ZeroMedian = np.median(data[np.where(labels == 0)])
    OneMedian = np.median(data[np.where(labels == 1)])
    bigger = np.argmax([ZeroMedian, OneMedian])
    color_labels = ['red' if (labels[w] == bigger) else 'blue' for w in range(len(labels))]
    return color_labels

def calcDiff(data):
    diffs_amount = 14
    diffs = np.zeros((diffs_amount, len(data)))
    for i in range(diffs_amount):
        diff = data[: - i-1] - data[i+1:]
        while (len(diff) < len(data)):
            diff=np.append(diff,0)
        diffs[i] = diff
    return diffs

def plot(data, color_labels):
    X = [w for w in range(len(color_labels))]
    Y = [0 for w in range(len(color_labels))]
    plt.plot(data)
    plt.scatter(X, Y, s=10, c=color_labels)
    plt.show()

def getLabelDiff(diffs):
    diff_mean = np.apply_along_axis(lambda x: x.mean(), axis=1, arr=diffs.T)
    plt.plot(diff_mean)
    plt.show()
    color_labels = ['red' if (diff_mean[w] <= 0) else 'blue' for w in range(len(diff_mean) - 1)]
    #最後の色は直前に合わせる
    color_labels.append(color_labels[-1])
    return color_labels

if __name__ == "__main__":
    uri = "C:/Users/tyobe/workspace/projects/QLapi/server/src/kabutan/stockdatas/SUBARU.json"
    columnsname = "OR"
    data = getData(uri, columnsname)
    diff = calcDiff(data)
    color_labels = getLabelDiff(diff)
    plot(data,color_labels)
    """
    labels = predictGMM(data)
    plotGMM(labels, data)
    """
