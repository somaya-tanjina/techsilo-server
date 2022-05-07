const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const jwt = require("jsonwebtoken");

// middleware to connect localhost 3000 & localhost 5000
app.use(cors());

// middleware to parse json
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oqcrh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const productCollection = client
            .db("laptopWarehouse")
            .collection("products");
        console.log("Mongodb  added");

        // jwt token

        app.post("/login", (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "1d",
                }
            );
            console.log(user);
            res.send({ accessToken });
        });

        // get data from database step-1

        app.get("/products", async (req, res) => {
            const email = req.query.email;
            //console.log(email);
            if (req.query.email) {
                const query = { email: req.query.email };
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            } else {
                const query = {};
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
        });

        //get single data by id
        app.get("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const querry = { _id: ObjectId(id) };
            const product = await productCollection.findOne(querry);
            res.send(product);
        });

        // Add single item
        app.post("/additem", async (req, res) => {
            const item = req.body;
            const result = await productCollection.insertOne(item);
            res.send(result);
            //console.log(result);
        });

        //update Inventory

        app.put("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: { quantity: updatedItem.quantity },
            };
            console.log(updatedItem);
            const result = await productCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });

        // Delete single Data

        app.delete("/inventory/:id", async (req, res) => {
            const id = req.params.id;
            const querry = { _id: ObjectId(id) };
            const deletedItem = await productCollection.deleteOne(querry);
            res.send(deletedItem);
        });
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
