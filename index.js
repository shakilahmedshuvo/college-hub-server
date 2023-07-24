const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// use middle ware
app.use(cors());
app.use(express.json());

// json files get
const collegeJSON = require('./college.json');
const bestCollegeJSON = require('./BestCollege.json');
const researchPaperJSON = require('./ResearchPaper.json');

// mongodb code start
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhesy5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // get the dataBase
        const admissionCollection = client.db('college-hub-db').collection('admission');
        const usersCollection = client.db('college-hub-db').collection('users');
        const reviewCollection = client.db('college-hub-db').collection('reviews');


        // admission post api
        app.post('/admission', async (req, res) => {
            const admissionData = req.body;
            const result = await admissionCollection.insertOne(admissionData);
            res.send(result);
        });

        // admission get api
        app.get('/admission', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { email };
            const result = await admissionCollection.find(query).toArray();
            res.send(result);
        });

        // reviews post api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        //  reviews get api
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        });

        // user post api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //  user get api
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// mongodb code end

app.get('/', (req, res) => {
    res.send('college is running')
});

// collegeJSON file section
app.get('/college', (req, res) => {
    res.send(collegeJSON)
});

// bestCollegeJSON file section
app.get('/bestCollege', (req, res) => {
    res.send(bestCollegeJSON)
});

// researchPaperJSON file section
app.get('/researchPaper', (req, res) => {
    res.send(researchPaperJSON)
});

app.listen(port, () => {
    console.log(`college is running on port: ${port}`);
});