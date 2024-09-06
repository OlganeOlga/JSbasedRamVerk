// import React from 'react';
import 'dotenv/config';

const port = process.env.PORT || 3006;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
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
/** Try if methodOverride vorks without urlencoded */
//app.use(express.urlencoded({ extended: true }));

// Middleware to override the method
app.use(methodOverride('_method'));

// /** test POST and PUT */

// app.get('/test', (req,res) => {
//     return res.render("test");
// })
// // Test route
// app.post('/test', (req, res) => {
//     res.send('POST request received');
// });

// app.put('/test', (req, res) => {
//     res.send('PUT request received');
// });

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
