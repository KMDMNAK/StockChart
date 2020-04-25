import React, { useState } from 'react'

import DailyCompany from '../component/DailyCompany'
import { page } from '../utils'


import Detail from './detail'


/**
 * 
 * @param route startWith /
 */

/**
 * SPAで構築
 * webpack dev server : historyApiFallback : index.html
 */

const Index = (props: { setUrl: React.Dispatch<React.SetStateAction<string>> }) => {
    const clickCompanyName_DailyCompany: DailyCompany.ClickCompanyName = (companyName: string) => {
        const [title, url] = [`${companyName}`, `/detail/${companyName}`]
        history.pushState({ title: title, url: url }, title, url)
        props.setUrl(url)
    }
    return <DailyCompany wantDate={'2019-09-20'} clickCompanyName={clickCompanyName_DailyCompany} />
}

const Router = () => {
    const [url, setUrl] = useState(location.pathname || '/')
    console.debug('Router', { url })
    if (!url.startsWith('/')) throw Error('Something is wrong with url.')
    const pathes = url.split('/')
    if (pathes[1] === '') return <Index setUrl={setUrl} />
    if (pathes[1] === 'detail' && pathes.length === 3) return <Detail setUrl={setUrl} companyName={pathes[2]} />
    return <></>
}
page(<Router />)