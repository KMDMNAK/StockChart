import React, { useEffect, useState, Children } from 'react'
import { hot } from 'react-hot-loader/root'

const data = async () => await fetch('/api/').then(e => e.text())
const Header = (props: { children?: JSX.Element }) => {
    const [state, setState] = useState('')
    useEffect(() => {
        data().then(v => {
            setState(v)
        })
    })
    return (<div>
        Stock Analysis!
        {state}
        {props.children}
    </div>)
}

export default hot(Header)