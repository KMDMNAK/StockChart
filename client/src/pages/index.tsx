import React, { useState } from 'react'
import Header from '../component/header'
import Content from '../component/content'
import DailyCompany from '../component/DailyCompany'
import CompanyChart from '../component/CompanyChart'
import { page } from '../utils'
/**
 * 
 * @param route startWith /
 */

/**
 * SPAで構築
 * webpack dev server : historyApiFallback : index.html
 */
const Index = () => {
    const [url, setUrl] = useState(location.pathname || '/')
    const clickCompanyName_DailyCompany: DailyCompany.ClickCompanyName = (companyName: string) => {
        const [title, url] = [`${companyName}`, `/detail/${companyName}`]
        history.pushState({ title: title, url: url }, title, url)
        setUrl(url)
    }
    const Router = (props: { route: string }) => {
        console.log(props.route)
        if (!props.route.startsWith('/')) throw Error('Something is wrong with url.')
        const pathes = props.route.split('/')
        if (pathes[1] === '') return <DailyCompany wantDate={'2019-09-20'} clickCompanyName={clickCompanyName_DailyCompany} />
        if (pathes[1] === 'detail' && pathes.length === 3) return <CompanyChart companyName={pathes[2]} />
        return <></>
    }
    return (
        <>
            <Router route={url} />
        </>
    )
}
page(<Index />)