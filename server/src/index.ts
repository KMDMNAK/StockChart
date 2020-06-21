import express from 'express'
import morgan from 'morgan'
import fetch from 'node-fetch'
import x2js from 'x2js'
const x2jso = new x2js()
const app = express()
// app.use(morgan('combined'))
app.use((req, res, next) => {
    console.debug(req.url)
    return next()
})
app.get('/', (req, res, next) => {
    res.send("Hello World!")
})

app.get('/api/news/:companyName/:startDateStr/:endDateStr', async (req, res) => {
    const { companyName, startDateStr, endDateStr } = req.params
    console.debug({ companyName, startDateStr, endDateStr })
    const url = `https://news.google.com/rss/search?q=${encodeURI(companyName+"%20株")}+before:${endDateStr}+after:${startDateStr}&hl=ja&gl=JP&ceid=JP:ja`
    console.debug({ url })
    await fetch(url).then(v => v.text())
        .then(xml => res.send(x2jso.xml2js(xml)))
        .catch(e => {
            console.error(e)
            res.sendStatus(500)
        })

})

app.listen(3000, () => {
    console.log('Server starts at 3000!')
})