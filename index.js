const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const servicesCollection = client.db('doctor').collection('services')
    const reviewCollection = client.db('doctor').collection('reviews')

    app.get('/services', async (req, res) => {
      let query = {}
      const cursor = servicesCollection.find(query)
      const services = await cursor.limit(3).toArray()
      res.send(services)
    })

    app.get('/allServices', async (req, res) => {
      let query = {}
      const cursor = servicesCollection.find(query)
      const allServices = await cursor.toArray()
      res.send(allServices)
    })

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const service = await servicesCollection.findOne(query)
      res.send(service)
    })

    app.get('/review/:id', async(req, res)=>{
      const id = req.params.id
      let query = {serviceId: id}
      const cursor = reviewCollection.find(query)
      const allReview = await cursor.toArray()
      res.send(allReview)
    })

    app.get('/review', async(req, res)=>{
      const email = req.query.email
      let query = {userEmail: email}
      const cursor = reviewCollection.find(query)
      const allReview = await cursor.toArray()
      res.send(allReview)
    })

    app.post('/review', async(req, res)=>{
      const info = req.body
      const result = await reviewCollection.insertOne(info)
      res.send(result)
    })

    app.delete('/review/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await reviewCollection.deleteOne(query);
      res.send(result)
    })
  }
  finally {

  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('You are currently online')
})

app.listen(port, ()=>{
  console.log('Runing', port)
})
