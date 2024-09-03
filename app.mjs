// import React from 'react';
import 'dotenv/config';

const port = process.env.PORT || 3001;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';


import documents from "./docs.mjs";

const app = express();


// Parse application/json
app.use(bodyParser.json());

app.disable('x-powered-by');

app.set("view engine", "ejs");

// // Set the new views directory
// app.set("views", path.join(process.cwd(), "init-views")); // Updated line

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/", async (req, res) => {
//     const result = await documents.addOne(req.body);

//     return res.redirect(`/${result.lastID}`);
// });

app.get('/', async (req, res) => {

    return res.render("index", { docs: await documents.getAll()});
});

app.get('/new_doc', async (req, res) => {
    return res.render("doc");
});

app.post('/new_doc', async (req, res) => {

    const { title, content } = req.body;

    const result = await documents.addOne(req.body);

    console.log(req.body);
    // Add or update the document
    //const result = await documents.addOrUpdate({ title, content });

    return res.render("doc");
});

app.get('/:id', async (req, res) => {
    return res.render(
        "doc",
        { doc: await documents.getOne(req.params.id) }
    );
});

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    // Find the document by ID
    const document = documents.find(doc => doc.id === parseInt(id));
  
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
  
    // Update the document
    document.title = title || document.title;
    document.content = content || document.content;
  
    res.status(200).json(document);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
