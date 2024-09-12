import express from 'express';
//import documents from '../mongoDocs.mjs';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const router = express.Router();

async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client  = await mongo.connect(dsn);
    const db = await client.localMongo();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();
  
    await client.close();
  
    return res;
  }

// Add JSON a route
router.get("/jsonMongo", async(req, res) => {
    // let dsn = `mongodb://localhost:27017/mummin`;
    // let colname = `crowd`;
    const criteria2 = {
        name: /^Sn/
    };
    const projection2 = {
        _id: 1,
        name: 1
    };
    const limit2 = 3;

    console.log("Start try...");
    try {
        // Connect to the MongoDB server
        console.log("Connecting to MongoDB...");
        const client = await MongoClient.connect(`mongodb://localhost:27017/mummin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Connected to MongoDB successfully");
        // Access the database
        const db = client.db("mummin");
        const collections = await db.listCollections().toArray();
        console.log("Collections in mummin database:", collections);

        // Access the collection
        const col = db.collection("crowd");
        const sampleDocs = await col.find({}).limit(5).toArray();
        console.log("Sample documents from 'crowd' collection:", sampleDocs);

        // Fetch the documents with the criteria and projection, and apply the limit
        const docs = await col.find(criteria2, { projection: projection2 }).limit(limit2).toArray();

        // Send the response as JSON
        res.json({ docs: docs });
        
        // Close the client connection after the operation
        await client.close();
    } catch (error) {
        console.error("Error fetching documents: many ", error);
        res.status(500).json({ error: "Failed to fetch documents" });
    };
});

export default router;