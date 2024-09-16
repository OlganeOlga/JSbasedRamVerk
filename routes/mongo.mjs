import express from 'express';
import { BSON, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { localMongo } from '../db/mongoDb.mjs';
import documents from '../mongoDocs.mjs';

const router = express.Router();

//parse JSON bodies
router.use(express.json());

//const uri = 'mongodb://localhost:27017';

const dbName = 'docs';

const colName = 'document';

//const client = await localMongo();

// get all dcuments as SJON
router.get("/", async(req, res) => {
    try {
        const collection = await documents.getAll(dbName, colName);
        res.json({ documents: collection });
    } catch (error) {
        res.json({ error: error });
    };
});

// remove one dcument as JSON with given _id
router.get("/mongo/deleat/:id", async(req, res) => {
    try {
        const result = await documents.removeById(dbName, colName, req.params.id);
        res.json({result: result});
    } catch (error) {
        res.json({error: error});
    }
});

// remove one dcuments as JSON with given title
router.get("/mongo/deleatByTitle/:title", async(req, res) => {
    try {
        const result = await documents.removeById(dbName, colName, req.params.title);
        res.json({result: result});
    } catch (error) {
        res.json({error: error});
    }
});

// get one dcument as JSON
router.get("/:id", async(req, res) => {
    try {
        const result = await documents.getByID(dbName, colName, req.params.id);
        res.json({result: result});
    } catch (error) {
        res.json({error: error});
    }
});


router.get('/mongo/getByTitle/:title', async (req, res) => {
    const searched = req.params.title;
    try {
        const result = await documents.findTitles(dbName, colName, searched);
        res.json(result);
    } catch (error) {
        console.log('error in searching document by title: ', error);
        res.json({ error: error });
    }
});

// uppdate or add a new document with title and content
router.get('/mongo/uppdate/:title/:content', async (req, res) => {
    const title = req.params.title;
    const content = req.params.content;
    try {
        const result = await documents.uppdateOne(dbName, colName, title, content);
        res.json({ result: result });
    } catch (error) {
        res.json({ error: error });
    }
});

// add an new unnamed document
router.get('/mongo/new', async (req, res) => {
    try {
        const result = await documents.addNew(dbName, colName);
        res.json({ result: result });
    } catch (error) {
        console.log('error in adding empty document: ', error);
        res.json({ error: error });
    }
});

export default router;