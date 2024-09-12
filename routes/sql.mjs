import express from 'express';

import documents from '../docs.mjs';  // Import the docs object

const router = express.Router();

router.post('/doc', async (req, res) => {

    // Get info from form
    const body = req.body;

    // Add or update the document
   await documents.addOne(body);

    res.redirect('/');
});

router.put('/doc', async (req, res) => {
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

router.get('/', async (req, res) => {

    return res.render("index", { docs: await documents.getAll()});
});

router.get('/doc', async (req, res) => {
    return res.render("doc", {doc: null});
});

router.get('/doc/:id', async (req, res) => {
    console.log(req.params.id);
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

export default router;