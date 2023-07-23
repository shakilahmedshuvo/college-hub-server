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


        // admission post api
        app.post('/admission', async (req, res) => {
            const admissionData = req.body;
            const result = await admissionCollection.insertOne(admissionData);
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