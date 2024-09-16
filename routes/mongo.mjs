import express from 'express';
import documents from '../mongoDocs.mjs';
import { BSON, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const router = express.Router();

//parse JSON bodies
router.use(express.json());

const uri = 'mongodb://localhost:27017';

const dbName = 'docs';

const colName = 'document';


// get all dcuments as SJON
router.get("/", async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('docs');
    try {
        //get database
        const collection = await db.collection(colName).find().toArray();
        await client.close()
        res.json({ documents: collection });
    } catch (error) {
        console.log('error in inserting: ', error);
        res.json({ error: error});
    }
});

// remove one dcument as JSON with given _id
router.get("/mongo/deleat/:id", async(req, res) => {
    //get database
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    console.log(req.params.id)
    try {
        const document = await db.collection(colName).deleteOne({_id: new ObjectId(`${req.params.id}`)});
        res.json({document: document});
    } catch (error) {
        console.log('error in deleating document by _id: ', error);
        res.json({error: error});
    } finally {
        await client.close();
    }
});

// remove one dcuments as JSON with given title
router.get("/mongo/deleatByTitle/:title", async(req, res) => {
    //get database
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    console.log(req.params.title)
    try {
        const document = await db.collection(colName).deleteOne({'data.title': req.params.title});
        res.json({document: document});
    } catch (error) {
        console.log('error in deleating document by title: ', error);
        res.json({error: error});
    } finally {
        await client.close();
    }
});



// add new document
router.get("/add/:title/:content", async(req, res) => {
     // Prevent conflict with the 'deleat' route
     if (req.params.title === "deleat") {
        return res.status(400).json({ error: "Invalid route usage." });
    }
    const data = {
        data: {
            title: req.params.title,
            content: req.params.content
        }
    };
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        const resut = await db.collection(colName).insertOne(data);
        return res.redirect('/mongo/');
    } catch (error) {
        console.log('error in inserting: ', error);
        res.json({ error: error});
    } finally {
        await client.close()
    }
});

// get one dcument as JSON
router.get("/:id", async(req, res) => {
    //get database
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        const document = await db.collection(colName).findOne({_id: new ObjectId(`${req.params.id}`)});
        res.json({document: document});
    } catch (error) {
        console.log('error in searching document by _id: ', error);
        res.json({error: error});
    } finally {
        await client.close();
    }
});


router.get('/mongo/getByTitle/:title', async (req, res) => {
    const searched = req.params.title;
    const query = {'data.title': searched};

    const options = {
        projection: { _id: 1, 'data.title': 0, 'data.content': 0 }
    }
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        const result = await db.collection(colName).find(query, options).toArray();
        res.json({ document: result });
    } catch (error) {
        console.log('error in searching document by title: ', error);
        res.json({ error: error });
    } finally {
        await client.close()
    }
});


// uppdate or add a new document with title and content
router.get('/add/:title/:content', async (req, res) => {
    const data = req.params;
 
    const filter = { 'data.title': data.title };

    const options = { upsert: true }; // add document if the docuent with this title is note found
    const updateDoc = {
        $set: {
          title: data.title,
          content: data.content
        },
      };
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        const result = await db.collection(colName).updateOne(filter, updateDoc, options);
        console.log("result: ", result);
        res.json({ result: result });
    } catch (error) {
        console.log('error in inserting: ', error);
        res.json({ error: error });
    } finally {
        await client.close();
    }
});

// add an new unnamed document
router.get('/new', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        //find all document with name "unnamed" and digits afterwords:
        const unnamedDocuments = await db.collection(colName).find({name: /^unnamed\d+$/}).toArray();
        const number = unnamedDocuments.length;

        //give number for the unnamed document
        const data = {
            data: {
                title: "unnamed" + number,
                content: ""
            }
        };
        const document = await db.collection(colName).addOne(data);
        res.json({ document: document });
    } catch (error) {
        console.log('error in adding empty document: ', error);
        res.json({ error: error });
    } finally {
        await client.close()
    }
});

export default router;