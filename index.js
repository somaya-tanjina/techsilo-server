const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware to connect localhost 3000 & localhost 5000
app.use(cors());

// middleware to parse json
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oqcrh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("laptopWarehouse").collection("products");
      console.log("Mongodb  added");

// get data from database step-1

      app.get('/products', async(req, res) => {
        const query = {};
        const cursor = productCollection.find(query);
        const products = await cursor.toArray()
        res.send(products)
      })

//get single data by id
      app.get('/inventory/:id', async(req, res) => {
        const id = req.params.id;
        const querry = { _id: ObjectId(id) }
        const product = await productCollection.findOne(querry)
        res.send(product)
      })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Welcome to LaptopWarehouse");
});

//

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
