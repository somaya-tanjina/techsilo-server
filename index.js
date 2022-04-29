const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
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
