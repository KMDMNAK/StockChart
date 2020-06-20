import React, { useEffect, useState, Children } from 'react'
import { hot } from 'react-hot-loader/root'

const data = async () => await fetch('/api/').then(e => e.text())
const Header = (props: { children?: JSX.Element }) => {
    const [state, setState] = useState('')
    useEffect(() => {
        data().then(v => {
            setState(v)
        })
    }, [state])
    return (<div>
        <div style={{ width: "100%", height: 60 }}>
            {props.children}
        </div>
    </div>)
}

export default hot(Header)