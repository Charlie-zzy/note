import express from 'express'
import api from './api.js'
import database from './database.js'
import cors from 'cors'
import { randomUUID } from 'crypto'

const app = express()
const port = 80
const dirname = 'note'

app.use(cors())
app.get(['/', '/${dir}/'], async (req, res) => {
  let key = randomUUID().slice(0, 4)
  while (await database.getData(key)) key = randomUUID().slice(0, 4)
  res.redirect(`/${dirname}/${key}/`)
})
app.use(
  `/${dirname}/:name`,
  (req, res, next) => {
    req.baseUrl = dirname
    next()
  },
  express.static('public')
)

app.use(express.json({ limit: '10mb' }))
app.get(`/api/${dirname}/get`, api.getNote)
app.put(`/api/${dirname}/edit`, api.editNote)
app.listen(port, () => {
  console.log(`Server opened at http://localhost:${port}`)
})
