import React, { useState } from 'react'
import CompanyChart from '../component/CompanyChart'
import SearchCompany from '../component/SearchCompany'
import CompanyNews from '../component/CompanyNews'

export default (props: { setCompany: (companyName: string) => any, companyName: string }) => {
    // const [title, url] = [`${props.companyName}`, `/detail/${props.companyName}`]
    // history.pushState({ title: title, url: url }, title, url)
    const [companyName, setCompanyName] = useState(props.companyName)
    return (<div style={pageStyle}>
        <SearchCompany decideCompany={(companyName: string) => {
            props.setCompany(companyName);
            setCompanyName(companyName)
        }} />
        <h2>{decodeURI(companyName)}</h2>
        <div style={{ margin: 40, textAlign: 'center' }}>
            <CompanyChart companyName={companyName} />
        </div>
        <div style={{ margin: '50px' }}>
            <CompanyNews companyName={companyName} />
        </div>
    </div>)
}

const pageStyle: React.CSSProperties = {
    textAlign: "center"
}