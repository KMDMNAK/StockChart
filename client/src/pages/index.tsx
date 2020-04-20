import React from 'react'
import Header from '../component/header'
import Content from '../component/content'
import { page } from '../utils'

page(<>
    <Header></Header>
    <div>
        Hello World!
    </div>
    <Content />
</>)