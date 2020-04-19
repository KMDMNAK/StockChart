import express from 'express'
import morgan from 'morgan'
const app = express()
app.use(morgan('combined'))
app.use('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(3000, () => {
    console.log('Server starts at 3000!')
})