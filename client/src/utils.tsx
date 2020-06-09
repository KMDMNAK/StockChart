import React from 'react'
import { render } from 'react-dom'
import Header from './component/header'
export const page = (element: JSX.Element) => {
    const dom = document.getElementById('app')
    if (!dom) throw Error('No Match DOM of given ID.')
    render(
        (<>
            <Header />
            <div>{element}</div>
        </>), dom)
}