import React from 'react'
import CompanyChart from '../component/CompanyChart'
import SearchCompany from '../component/SearchCompany'

export default (props: { setUrl: React.Dispatch<React.SetStateAction<string>>, companyName: string }) => {
    const [title, url] = [`${props.companyName}`, `/detail/${props.companyName}`]
    history.pushState({ title: title, url: url }, title, url)
    return (<div style={pageStyle}>
        <h2>{decodeURI(title)}</h2>
        <SearchCompany decideCompany={(companyName: string) => props.setUrl(`/detail/${companyName}`)} />
        <CompanyChart companyName={props.companyName} />
    </div>)
}

const pageStyle: React.CSSProperties = {
    textAlign: "center"
}