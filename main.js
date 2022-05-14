import express from 'express'
import api from './api.js'
import database from './database.js'
import cors from 'cors'
import { randomUUID } from 'crypto'

const app = express()
const port = 80
const dirname = 'note'

function randStr(
  len,
  dict = '234567890abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNOPQRSTUVWXYZ'
) {
  var result = []
  while (len--) result.push(~~(Math.random() * dict.length))
  return result.map((v) => dict[v]).join('')
}

app.use(cors())
app.get(['/', `/${dirname}/`], async (req, res) => {
  let key = randStr(4)
  while (await database.getData(key)) key = randStr(4)
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

app.use(express.json({ limit: '1mb' }))
app.get(`/api/${dirname}/get`, api.getNote)
app.put(`/api/${dirname}/edit`, api.editNote)
app.listen(port, () => {
  console.log(`Server opened at http://localhost:${port}`)
})
