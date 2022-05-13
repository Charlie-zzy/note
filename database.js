import { MongoClient } from 'mongodb'

class Database {
  constructor({ debug = false }) {
    MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
      if (err) throw err
      this.debug = debug
      this.db = client.db().collection('note')
      // this.db.drop()
      console.log('Database successfully connected!')

      this.db.stats((err, res) => {
        if (err) throw err
        this.db.find().toArray((err, res) => {
          if (err) throw err
          console.log(
            res.slice(-5).map(({ key, data }) => {
              return { key, length: data?.length }
            })
          )
          console.log('Total:', res.length)
        })
      })
    })
  }

  async getData(key) {
    if (this.debug) console.log('[G] key:', key)
    return this.db.findOne({ key }).then((res) => res?.data)
  }

  setData(key, data) {
    this.db.updateOne(
      { key },
      { $set: { key, data } },
      { upsert: true },
      (err, res) => {
        if (err) throw err
        if (this.debug) console.log('[S] key:', key, 'data:', data)
      }
    )
  }
}

export default new Database({ debug: false })
