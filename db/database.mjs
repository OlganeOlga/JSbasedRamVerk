import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDb() {
    let dbFilename = `./db/docs.sqlite`;

    if (process.env.NODE_ENV === 'test') {
        dbFilename = "./db/test.sqlite";
    }

    return await open({
        filename: dbFilename,
        driver: sqlite3.Database
    });
}


export default openDb;

import { MongoClient, ServerApiVersion } from 'mongodb';
//Connect to database
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
