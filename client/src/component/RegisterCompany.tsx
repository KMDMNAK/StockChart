
/**
 * 各ユーザーごとに企業を登録。
 * ニュースを閲覧する。
 */

import React from 'react'
import { getUid, registerCompany } from '../firebase'
import { hot } from 'react-hot-loader/root'

interface RegisterCompanyProps {
    companyName: string
}

const RegisterCompany = (props: RegisterCompanyProps, type: 'liked' | 'watched') => {
    const companyName = props.companyName
    const uid = getUid()

    return (<>
        {companyName}
    </>)
}

export default hot(RegisterCompany)