import React, { useState, Suspense } from 'react'
import {
    useHistory,
    BrowserRouter,
    withRouter,
    Route,
    useParams
} from 'react-router-dom'

import { page } from '../utils'

import DailyCompany from '../component/DailyCompany'

const Detail = React.lazy(() => import('./detail'));

/**
 * SPAで構築
 * webpack dev server : historyApiFallback : index.html
 */


const Index = (props: { clickCompany: (companyName: string) => any }) => <DailyCompany clickCompanyName={props.clickCompany} />


const RouteIndex = withRouter((props: {}) => {
    const history = useHistory()
    return (
        <Index clickCompany={(companyName: string) => { history.push(`/detail/${companyName}`) }} />
    )
})

const RouteDetail = withRouter((props: {}) => {
    const history = useHistory()
    const { companyName } = useParams<{ companyName: string }>()
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Detail setCompany={(companyName: string) => { history.push(`/detail/${companyName}`) }} companyName={companyName} />
        </Suspense>
    )
})

const AllRouter = () => {
    return (
        <BrowserRouter >
            <Route exact path='/' component={RouteIndex} />
            <Route exact path='/detail/:companyName' component={RouteDetail} />
        </BrowserRouter>)
}

page(<AllRouter />)