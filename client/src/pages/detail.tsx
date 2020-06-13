import React from 'react'
import CompanyChart from '../component/CompanyChart'
import SearchCompany from '../component/SearchCompany'
import CompanyNews from '../component/CompanyNews'

export default (props: { setCompany: (companyName: string) => any, companyName: string }) => {
    // const [title, url] = [`${props.companyName}`, `/detail/${props.companyName}`]
    // history.pushState({ title: title, url: url }, title, url)
    return (<div style={pageStyle}>
        <h2>{decodeURI(props.companyName)}</h2>
        <SearchCompany decideCompany={(companyName: string) => props.setCompany(companyName)} />
        <CompanyChart companyName={props.companyName} />
        <CompanyNews companyName={props.companyName} />
    </div>)
}

const pageStyle: React.CSSProperties = {
    textAlign: "center"
}