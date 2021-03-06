const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u15s5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tourism-website");
        const tourCollection = database.collection("tours");
        const orderCollection = database.collection("my-orders");
        const storyCollection = database.collection("stories");

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const myOrders = await cursor.toArray();
            res.send(myOrders);
            console.log(myOrders)

        })

        //delete order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedOrder = await orderCollection.deleteOne(query);
            console.log(deletedOrder)
            res.json(deletedOrder)
        })

        //update order
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Approved"
                },
            };
            const result = await orderCollection.updateOne(query, updateDoc, options);
            console.log(result);
            res.json(result)
        })
        //post orders api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            order.status = "Pending";
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        //get tours api
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
            console.log(tours)
        })

        //get single tours api
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await tourCollection.findOne(query);
            res.send(tour)
        })

        //post tours
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await tourCollection.insertOne(tour);
            console.log(result);
            res.json(result)
        })




        //get share story
        app.get('/stories', async (req, res) => {
            const story = await storyCollection.find({});
            const ShareStory = await story.toArray();
            res.send(ShareStory)
            console.log(ShareStory)
        })

        //post share story
        app.post('/stories', async (req, res) => {
            const story = req.body;
            const result = await storyCollection.insertOne(story);
            console.log(result);
            res.json(result)
        })


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running from tourism website');
})
app.listen(port, () => {
    console.log('Lisetening from port:', port)
})