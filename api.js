import database from './database.js'

function isValid(str) {
  if (typeof str !== 'string' || str.length === 0) return false
  if (str.match(/[^\w\-]/)) return false

  return true
}

const getNote = async (req, res) => {
  if (!isValid(req.query.key)) {
    res.statusCode = 403
    res.send({
      ok: false,
      data: '非法字符串！请输入只含有字母、数字和下划线和横线的 URL',
    })
    return
  }
  const data = (await database.getData(req.query.key)) ?? ''

  res.send({ ok: true, data })
}

const editNote = (req, res) => {
  if (!isValid(req.body.key)) {
    res.statusCode = 403
    res.send({
      ok: false,
      data: '请求非法！请输入只含有字母、数字和下划线和横线的 URL',
    })
    return
  }
  database.setData(req.body.key, req.body.data)
  res.send({ ok: true })
}

export default {
  getNote,
  editNote,
}
