import { firestore } from 'firebase-admin'
import { fstore } from '../firebase'
import { COMPANY_REF } from '../constants'

export const searchCompanyName = async (inputWord: string) => {
    const predictValues: string[] = []
    if (inputWord.length === 0) return predictValues
    return fstore.collection(COMPANY_REF).orderBy(
        firestore.FieldPath.documentId()).startAt(inputWord).limit(5).get().then(snapshot => {
            for (let doc of snapshot.docs) {
                if (!doc.id.startsWith(inputWord)) return predictValues
                predictValues.push(doc.id)
            }
            return predictValues
        })
}
