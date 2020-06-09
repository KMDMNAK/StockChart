import React, { useEffect, useState, Children } from 'react'
import { hot } from 'react-hot-loader/root'
import { signIn } from '../firebase'
const data = async () => await fetch('/api/').then(e => e.text())
const Header = (props: { children?: JSX.Element }) => {
    const [state, setState] = useState('')
    useEffect(() => {
        data().then(v => {
            setState(v)
        })
    }, [state])
    return (<div>
        Stock Analysis!
        {state}
        {props.children}
        <div style={{ width: 300, height: 200, backgroundColor: 'red' }} onClick={signIn}></div>
    </div>)
}

export default hot(Header)