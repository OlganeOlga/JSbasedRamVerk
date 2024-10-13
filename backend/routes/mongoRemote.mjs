import express from 'express';
//import utils from './../utils.mjs';  // Import your authentication middleware
import mogoDocs from '../docs/remoteDocs.mjs';
import { authenticateToken } from './auth.mjs';
import data from "../models/data.mjs";
import auth from "../models/auth.mjs";
import mongoDocs from '../docs/remoteDocs.mjs';

const router = express.Router();

//parse JSON bodies
router.use(express.json());

// get all dcuments from a user as JSON
router.get("/:user",async(req, res) => {
    const user = req.params.user;
    try {
        console.log("try in the GET docs/")
        const docs = await mongoDocs.usersDocuments(user);
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: 
            'Error fetching documents at backend/routes/mongoREmote.mjs' });
    }
});

// add an new unnamed document
router.post('/', async (req, res) => {
    console.log("start Post route")
    const {username, password} = req.body
    console.log("user :", req.body);
        try {
            console.log("start adding documents")
            const result = await mongoDocs.newDocument(username, password);
            console.log("after adding documents", result)
            res.json({ result });
        } catch (error) {
            res.json({ error: error });
        }
});

// update a document
router.put('/update', async (req, res) => {
    console.log("att Update route")
    const {username, password, id, title, content } = req.body;
    console.log("att Update route", req.body)
    try {
        console.log("Try to use update function")
        const result = await mongoDocs.updateDocument(username, password, id, title, content);
        console.log("After use update function", result)
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating document bu put route', error });
    }
});

// remove a document
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    const {username, password} = req.body;
    try {
        const result = await mongoDocs.removeDocument(id, username, password);
        res.json({ result });
    } catch (error) {
        res.json({ error: error });
    }
});

export default router;