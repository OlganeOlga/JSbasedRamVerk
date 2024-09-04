import 'dotenv/config'

const port = process.env.PORT || 9001; // Default to 3000 if PORT is undefined

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documents from "./docs.mjs";

const app = express();

app.disable('x-powered-by');

app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "public")));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    const result = await documents.addOne(req.body);

    return res.redirect(`/${result.lastID}`);
});

// Definierar en POST-rutt på /update som hanterar uppdateringar av dokument
app.post("/update", async (req, res) => {
    // id, title och content från requesten (req.body)
    const { id, title, content } = req.body;
     // Anropar updateOne-metoden från documents-modulen för att uppdatera dokumentet med det angivna id
    await documents.updateOne(id, { title, content });
    // Omdirigerar användaren till dokumentets sida efter att uppdateringen har genomförts
    // Bygger omdirigeringen baserat på dokumentets id
    return res.redirect(`/${id}`);
});

app.get('/:id', async (req, res) => {
    return res.render("doc", {
        doc: await documents.getOne(req.params.id)
    });
});

app.get('/', async (req, res) => {
    return res.render("index", { docs: await documents.getAll() });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
