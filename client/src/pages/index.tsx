import React from 'react'
import Header from '../component/header'
import Content from '../component/content'
import DailyCompany from '../component/DailyCompany'
import { page } from '../utils'

page(<>
    <DailyCompany wantDate={'2019-09-20'} />
</>)