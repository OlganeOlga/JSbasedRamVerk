import express from 'express';
import mongoDocs from '../docs/remoteDocs.mjs';

const router = express.Router();

//parse JSON bodies
router.use(express.json());

// get all dcuments from a user as JSON
router.get("/:user",async(req, res) => {
    console.log("use GET in MongoRemote")
    const user = req.params.user;
    try {
        const docs = await mongoDocs.userDocuments(user);
        res.json(docs);
        
    } catch (error) {
        res.status(500).json({ message: 
            'Error fetching documents at backend/routes/mongoREmote.mjs' });
    }
});

// add an new unnamed document
router.post('/', async (req, res) => {
    console.log("user POST in MongoRemote")
    const {username, password} = req.body
        try {
            const result = await mongoDocs.newDocument(username);
            res.json({ result });
        } catch (error) {
            res.json({ error: error });
        }
});

// update a document
router.put('/update', async (req, res) => {
    const {username, id, title, content } = req.body;
    try {
        const result = await mongoDocs.updateDocument(username, id, title, content);
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
        const result = await mongoDocs.removeDocument(id, username);
        res.json({ result });
    } catch (error) {
        res.json({ error: error });
    }
});

router.get('/shared/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const result = await mongoDocs.getShared(username);

        //return fout status if no shared documnets
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No shared documents found." }); // Return 404 if no documents found
        }
        res.status(200).json(result);
    } catch (error) {
        console.log("error in route shared/username: ", error)
        res.json({ error: error });
    }
})

router.post('/share', async (req, res) => {
    const {username, docId, adress } = req.body;
    try {
        const result = await mongoDocs.shareDoc(username, docId, adress);
        res.json({ result });
    } catch (error) {
        console.log("error in /share: ", error)
        res.json({ error: error });
    }
})

router.post('/comment', async (req, res) => {
    const {username, docId, adress } = req.body;
    try {
        const result = await mongoDocs.shareDoc(username, docId, adress);
        res.json({ result });
    } catch (error) {
        console.log("error in /share: ", error)
        res.json({ error: error });
    }
})

export default router;