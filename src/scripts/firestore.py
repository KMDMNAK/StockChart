from functools import reduce
import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
firebase_admin.initialize_app(cred)

db = firestore.client()


def dailyUpCompanies(wantDate: str):
    """
        前日比が上がった上位10社の情報を取得
    """
    def forEachComp(array, doc):
        lastDate = doc.get().to_dict().get('lastDate')
        if wantDate != lastDate:
            return array
        data = doc.collection('Data').document(lastDate).get().to_dict()
        array.append({
            "name": doc.id,
            **data
        })
        return array
    companyDatas = reduce(forEachComp, db.collection(
        'Company').list_documents(), [])
    sortedDatas = sorted(companyDatas, key=lambda data: - data['DoD'])
    db.collection('Daily').document('UpCompanies').set(
        {wantDate: sortedDatas[:5]}, merge=True)
    db.collection('Daily').document('DownCompanies').set(
        {wantDate: sortedDatas[-5:]}, merge=True)

# dailyUpCompanies('2019-09-20')


def implicit():
    from google.cloud import storage

    # If you don't specify credentials when constructing the client, the
    # client library will look for credentials in the environment.
    storage_client = storage.Client()

    # Make an authenticated API request
    buckets = list(storage_client.list_buckets())
    print(buckets)


dailyUpCompanies('2019-09-20')
