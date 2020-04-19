import { render } from 'react-dom'
export const page = (element: JSX.Element) => {
    const dom = document.getElementById('app')
    if (!dom) throw Error('No Match DOM of given ID.')
    render(element, dom)
}