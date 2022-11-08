const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
  try{
    const servicesCollection = client.db('doctor').collection('services')

    app.get('/services', async (req, res) =>{
      const size = parseInt(req.query.size)
      const query = {}
      const cursor = servicesCollection.find(query)
      const services = await cursor.limit(size).toArray()
      res.send(services)
    })
    
  }
  finally{

  }
}
run().catch(console.dir)

app.get('/', (req, res) =>{
  res.send('You are currently online')
})

app.listen(port)
