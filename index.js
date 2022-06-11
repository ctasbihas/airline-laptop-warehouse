const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yd9cq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const featuredCollection = client.db('laptopWarehouse').collection('featuredProducts');
        const addictedCollection = client.db('laptopWarehouse').collection('addictedServices');
        const productCollection = client.db('laptopWarehouse').collection('products');

        app.get('/featured', async (req, res) => {
            const query = {};
            const cursor = featuredCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/addicted', async (req, res) => {
            const query = {};
            const cursor = addictedCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            console.log(result);
            res.send(result);
        });

        // POST
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        // DELETE
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
