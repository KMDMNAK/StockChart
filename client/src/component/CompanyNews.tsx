import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'

const createDateStr = (date: Date) => `${String(date.getFullYear())}-${String(date.getMonth() + 1)}-${String(date.getDate())}`
const createYesterday = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1);
    return date
}

const getOnedayNews = (companyName: string) => {
    const today = new Date()
    const todayStr = createDateStr(today)
    const yesterdayStr = createDateStr(createYesterday())
    const url = `/api/news/${companyName}/${yesterdayStr}/${todayStr}`
    return fetch(url).then(v => v.json())
}

const typeChanger = (): 'oneday' | 'week' | 'month' => {
    const type = 'oneday'
    return type
}
// 今日,一週間,一か月のニュースを表示可能
const CompanyNews = (props: { companyName: string }) => {
    const [news, setNews] = useState([])
    const type = typeChanger()
    useEffect(() => {
        switch (type) {
            case 'oneday': {
                getOnedayNews(props.companyName).then(jsonObj => {
                    const item = jsonObj.rss.channel.item
                    setNews(item)
                }).catch(e => console.error(e))
            }
            case 'week': {

            }
            case 'month': {

            }
        }
    }, [type])
    return (
        <div style={{ textAlign: 'left' }}>
            {news.map(({ title, pubDate }) => (
                <div>
                    <li>{pubDate}</li>
                    <li>{title}</li>
                    <br />
                </div>
            ))}
        </div>)
}

export default hot(CompanyNews)