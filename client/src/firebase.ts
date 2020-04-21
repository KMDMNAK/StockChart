import * as firebase from 'firebase';
import { COMPANY_REF, DAILY_UPCOMPANY_DOCREF, DAILY_DOWNCOMPANY_DOCREF, DAILY_REF } from './constants'
export const fstore = firebase.firestore()
export const upCompaniesRef = fstore.collection(DAILY_REF).doc(DAILY_UPCOMPANY_DOCREF)
export const downCompaniesRef = fstore.collection(DAILY_REF).doc(DAILY_DOWNCOMPANY_DOCREF)
