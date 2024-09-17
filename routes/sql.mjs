import express from 'express';

import documents from '../docs.mjs';  // Import the docs object

const router = express.Router();

router.post('/doc', async (req, res) => {

    // Get info from form
    const body = req.body;

    // Add or update the document
   await documents.addOne(body);

   return res.render("index", { docs: await documents.getAll()});
});

router.put('/doc', async (req, res) => {
    const body = req.body;
    try {
        await documents.updateOne(body);
        return res.render("index", { docs: await documents.getAll()});
    } catch (e) {
        console.error(e);
        res.send('Error updating document');
    }
});

// old '/' route to view
router.get('/inactive', async (req, res) => {

    return res.render("index", { docs: await documents.getAll()});
});

/**
 * JSON variant visar hur man kan skicka en ny 
 * status kod res.status(...).json(.....)(använd standart 200 för rät status)
 * 404 - hittar inte
 * 301
 * 302
 * ser vidate MND: HTTP status code
*/
router.get('/', async (req, res) => {

    return res.json( { docs: await documents.getAll()});
});
router.get('/doc', async (req, res) => {
    return res.render("doc", {doc: null});
});

router.get('/doc/:id', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

export default router;