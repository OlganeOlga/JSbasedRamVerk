import express from 'express';
import documents from '../mongoDocs.mjs';
import { BSON, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const router = express.Router();

//parse JSON bodies
router.use(express.json());

const uri = 'mongodb://localhost:27017';

const dbName = 'docs';

const colName = 'document';

/**
 * get connection to database
 * @asynk
 * 
 * @param {string} uri : connection port
 * @param {string} dbName : database name
 * 
 * @returns {object} database : database
 */
async function getMongo(uri, dbName) {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    return db;
}

// get all dcuments as SJON
router.get("/", async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    //get database
    const collection = await db.collection(colName).find().toArray();
    await client.close()
    res.json({ documents: collection });
});

// get all dcuments as SJON
router.get("/:title/:content", async(req, res) => {
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
        return res.redirect('/');
    } catch (error) {
        console.log('error in inserting: ', error);
        return res.redirect('/');
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
        console.log('error in inserting: ', error);

        res.json({error: error});
    } finally {
        await client.close();
    }
});

// remove one dcument as JSON with given _id
router.get("/deleet/:id", async(req, res) => {
    //get database
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    console.log(req.params.id)
    try {
        const document = await dbcollection(colName).deleteOne({_id: new ObjectId(`${req.params.id}`)});
        res.json({document: document});
    } catch (error) {
        console.log('error in inserting: ', error);

        res.json({error: error});
    } finally {
        await client.close();
    }
});

router.get('/:title', async (req, res) => {
    const data = req.body;
    const filter = { title: data.title };
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        const document = await db.collection(colName).find({title: title});
        res.json({ document: document });
    } catch (error) {
        console.log('error in inserting: ', error);
        res.json({ error: error });
    } finally {
        await client.close()
    }
});


// uppdate or add a new document with title and content
router.get('/:title/:content', async (req, res) => {
    const data = req.body;
    const filter = { title: data.title };

    const options = { upsert: true }; // add document if the docuent with this title is note found
    const updateDoc = {
        $set: {
          title: data.title,
          body: data.body
        },
      };
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    try {
        const result = await db.updateOne(filter, updateDoc, options);
        console.log("result: ", result);
        res.json({ document: document });
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
        console.log('error in inserting: ', error);
        res.json({ error: error });
    } finally {
        await client.close()
    }
});

export default router;