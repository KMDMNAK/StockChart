import * as firebase from 'firebase';

import { REGISTER_COMPANY_REF, USER_REF, DAILY_UPCOMPANY_DOCREF, DAILY_DOWNCOMPANY_DOCREF, DAILY_REF } from './constants'

export const fstore = firebase.firestore()
export const upCompaniesRef = fstore.collection(DAILY_REF).doc(DAILY_UPCOMPANY_DOCREF)
export const downCompaniesRef = fstore.collection(DAILY_REF).doc(DAILY_DOWNCOMPANY_DOCREF)
export const getUid = () => {
    const currentUser = firebase.auth().currentUser
    if (!currentUser) return;
    return currentUser.uid
}
export const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(async result => {
        if (!result.credential) return
        const credentialObject = result.credential.toJSON();
        console.debug(credentialObject)
        const user = result.user;
        if (!user) console.error({ user })
    })
}
export const registerCompany = async (companyName: string, type: "liked" | "watched") => {
    const uid = getUid()
    if (!uid) throw Error('No Uid')
    const userRef = await fstore.collection(USER_REF).doc(uid)
    const snapshot = await userRef.get()
    if (!snapshot.exists) return
    const { watchedCompanies, likedCompanies } = snapshot.data() as {
        watchedCompanies: string[], likedCompanies: string[]
    }
    const checkCompanies = type === 'liked' ? likedCompanies : watchedCompanies
    if (!checkCompanies.includes(companyName)) {
        checkCompanies.push(companyName)
        await userRef.set({
            checkCompanies
        }, { merge: true })
    }
}