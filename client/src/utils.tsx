import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import Header from './component/header'
import Login from './component/Login'
import { signIn, getUid, singOut, getCurrentUserName } from './firebase'


export const PageBaseComponent = (props: { children: JSX.Element }) => {
    const [uid, setUid] = useState<string | null>(getUid())
    return (<>
        <div style={{ margin: 20 }}>
            <Header>
                <div style={{ position: 'relative', top: 20, left: "75%" }}>
                    {uid ? <p onClick={async (event: any) => {
                        singOut().then(v => setUid(getUid()))
                    }}>LOGOUT ; {getCurrentUserName()}</p> : <Login onClickFunction={async (event: any) => {
                        signIn().then(v => setUid(getUid()))
                    }} />}
                </div>
            </Header>
        </div>
        <div>{props.children}</div>
    </>)
}

export const page = (element: JSX.Element) => {
    const dom = document.getElementById('app')
    if (!dom) throw Error('No Match DOM of given ID.')

    render((<PageBaseComponent>{element}</PageBaseComponent>), dom)
}