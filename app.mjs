// import React from 'react';
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://texteditor1:dbwebb@cluster0.wf5vm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const port = process.env.PORT || 3006; // Default to 3006 if PORT is undefined

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan'; // logging med tredjepart modules
import cors from 'cors';
import methodOverride from 'method-override';

import documents from "./docs.mjs";

const app = express();


// Parse application/json
app.use(bodyParser.json());

app.disable('x-powered-by');

app.set("view engine", "ejs");

// // Set the new views directory
// app.set("views", path.join(process.cwd(), "init-views")); // Updated line

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json()); // in plase of bodyParser.urlencoded and bodyParser.json
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Middleware to override the method
app.use(methodOverride('_method'));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.hkfbt.mongodb.net/folinodocs?retryWrites=true&w=majority`;

app.post('/doc', async (req, res) => {

    // Get info from form
    const body = req.body;

    // Add or update the document
    const result = await documents.addOne(body);

    res.redirect('/');
});

app.put('/doc', async (req, res) => {
    console.log('PUT request received');  // Check if this logs
    console.log('Type of id:', typeof(req.body.id));
    const body = req.body;
    try {
        await documents.updateOne(body);
        return res.redirect('/'); // Redirect after update
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating document');
    }
});

app.get('/', async (req, res) => {

    return res.render("index", { docs: await documents.getAll()});
});

app.get('/doc', async (req, res) => {
    return res.render("doc", {doc: null});
});

app.get('/doc/:id', async (req, res) => {
    console.log(req.params.id);
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
