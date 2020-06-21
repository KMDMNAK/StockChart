import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'

const createDateStr = (date: Date) => `${String(date.getFullYear())}-${String(date.getMonth() + 1)}-${String(date.getDate())}`
const createYesterday = () => {
    const date = new Date()
    date.setDate(date.getDate() - 4);
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

interface NewsResponse {
    rss: { channel: { item: NewsItem[] | NewsItem } }
}

interface NewsItem {
    title: string
    pubDate: string
    link: string
}

const NewsItem = (props: { item: NewsItem }) => {
    return (
        <div style={{ margin: 50 }}>
            <div style={{ paddingBottom: 10, fontSize: 20 }}><a href={props.item.link}>{props.item.title}</a></div>
            <div>{props.item.pubDate}</div>
        </div>
    )
}

// 今日,一週間,一か月のニュースを表示可能
const CompanyNews = (props: { companyName: string }) => {
    const [news, setNews] = useState<NewsItem[] | null>(null)
    const type = typeChanger()
    console.debug({
        news
    })
    useEffect(() => {
        switch (type) {
            case 'oneday': {
                getOnedayNews(props.companyName).then((jsonObj: NewsResponse) => {
                    const item = jsonObj.rss.channel.item as any
                    console.debug({ item })
                    item ? setNews(item.title ? [item] : item) : setNews(null)

                }).catch(e => console.error(e))
            }
            case 'week': {

            }
            case 'month': {

            }
        }
    }, [type, props.companyName])
    return (
        <div style={{ textAlign: 'left' }}>
            {news ? news.map(newsItem => <NewsItem key={newsItem.title} item={newsItem} />) : <p>No News</p>}
        </div>)
}

export default hot(CompanyNews)