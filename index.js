const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('sales server is running');
});

// sX0vxKlbXLN5MOEl
// SalesCar


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipq6z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("SalesCar");
const CarsCollection = database.collection("Cars");
const ordersCollection = database.collection("orders");
const reviewCollection = database.collection("reviews");
const usersCollection = database.collection("users");

async function run() {
    try {
        client.connect();
        console.log("connected to the mongodb database");


        // get car service

        app.get("/services", async (req, res) => {

            const cursor = CarsCollection.find({});
            const result = await cursor.toArray();


            // console.log(result);

            res.send(result);

        });

        // single car

        app.get('/carDetails/:carID', async (req, res) => {

            const carID = req.params.carID;

            console.log(carID);
            const query = { _id: ObjectId(carID) };

            const result = await CarsCollection.findOne(query);
            // console.log(result);
            res.send(result);

        });

        // place order

        app.post('/carDetails/order', async (req, res) => {
            const UserOrder = req.body;
            // console.log(UserOrder);
            const result = await ordersCollection.insertOne(UserOrder);
            res.json(result);


        });

        // my order

        app.get("/myOrder", async (req, res) => {

            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);

            res.json(result)


        });


        // delete my order

        app.delete("/myOrder/:orderID", async (req, res) => {

            const id = req.params.orderID;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);

        });

        // review 

        app.post("/review", async (req, res) => {

            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);

        });

        // get review
        app.get("/review", async (req, res) => {

            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            // console.log(result);

            res.json(result)


        });



        // save user

        app.post("/users", async (req, res) => {

            const users = req.body;

            const result = await usersCollection.insertOne(users);

            // console.log(result);
            res.json(result);
        })



        // admin create

        app.put("/dashboard/makeAdmin", async (req, res) => {
            console.log("hitting admin")

            const email = req.body.email;
            const filter = { email: email };
            const updateDoc = {
                $set: {
                    role: "admin"
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc);

            res.json(result);
            //   console.log(result)


        });

        // get admin

        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            console.log(email);

            const query = { email: email };

            const user = await usersCollection.findOne(query);

            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }

            res.json({ admin: isAdmin })

        });


        // manage all site order

        app.get("/dashboard/manageAllOrder", async (req, res) => {

            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();

            res.json(result);
            // console.log(result);

        });

        // update manage orders pending option
        app.put("/manageAllOrder/:id", async (req, res) => {
            console.log('hitting update manage');

            const id = req.params.id;

            const updateOrder = req.body;

            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    status: updateOrder.status
                },
            };

            const result = await ordersCollection.updateOne(query, updateDoc, options)

            res.json(result);
            // console.log(result);

        });

        // delete from manage order

        app.delete("/manageAllOrder/:id",async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result=await ordersCollection.deleteOne(query);

            console.log(result);
            res.json(result);
        });

        // add products

        app.post("/addProducts",async(req,res)=>{
            const products=req.body;
            console.log(products)
            const result = await CarsCollection.insertOne(products);
            res.json(result);
            console.log(result);
        })



    }
    finally {
        // client.close();
    }
}
run().catch(console.dir);














app.listen(port, () => {
    console.log(`listening http://localhost:${port}`)
})