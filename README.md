# SSR Editor

Starter project for DV1677 JSRamverk

# Steps to get Requirements specification for the first subbmission

1. Copy files from Emils Folino link to the project directory "SSR-EDITOR-0.1"

2. Go to the dir and create GitRepo with `git init`

3. Create new remote git-repo with name "JsBasedRamVerk" on GitHub

4. Add remote origin `git remote add origin <url>`

5. Install nodjs and npm if it is not instald:
    `sudo apt install nodejs npm`

6. Run `npm init`

7. Install sqlite and sqlite3:
    `sudo apt install sqlite`

    `sudo apt install sqlite3`

8. `git add .`
9. `git commit -m "First commit"`
10. `git tag -a 1.0.0

Satt port på 3000 på const port = process.env.PORT || 3000; // Default to 3000 if PORT is undefined i app.mjs, för att kunna öppna appen. Annars blir det Example app listening on port undefined

När jag öppnar appen:

`node app.mjs`

[Error: SQLITE_ERROR: no such table: documents] { errno: 1, code: 'SQLITE_ERROR' } ::1 - - [04/Sep/2024:12:41:35 +0000] "GET / HTTP/1.1" 200 461 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0"

Går till commandline, app dir:

`cat db/migrate.sql | sqlite3 db/docs.sqlite kör jag för att`

cat db/migrate.sql | sqlite3 db/docs.sqlite: cat db/migrate.sql läser innehållet i filen db/migrate.sql. | (pipe) skickar innehållet från cat till sqlite3. sqlite3 db/docs.sqlite kör SQLite3-verktyget och tillämpar SQL-kommandona från migrate.sql på databasen db/docs.sqlite.

Nu får jag inga felmeddelanden.

Jag fixar vyerna:

I index.ejs

jag bifogar länk som ska skaffa nya dokumenter till index.ejs:

`<h3><a href="/doc">Create a new dockument</a></h3>`

och anpassa länken av befintliga dokumant:

`<h3><a href="/doc/<%= doc.id %>"><%= doc.title %></a></h3>`

I doc.ejs

jag skaffa if-sats som ska bero på lanken: 

```<% if (doc) { %>
    <h2>Dokument</h2>
    <form method="POST" action="/doc?_method=PUT" class="doc-form">
        <!-- <input type="hidden" name="_method" value="PUT"> -->
        <input type="hidden" name="id" value="<%= doc.id %>">
        <label for="title">Doc Titel</label>
        <input type="text" name="title" value="<%= doc.title %>" />
    
        <label for="content">Innehåll</label>
        <textarea name="content"><%= doc.content %></textarea>
    
        <input type="submit" value="Uppdatera" />
    </form>   
<% } else { %>
    <h2>Dokument</h2>
        <form method="POST" action="/doc" class="doc-form">
        <label for="title">Doc Titel</label>
        <input type="text" name="title" value="" />

        <label for="content">Innehåll</label>
        <textarea name="content"></textarea>

        <input type="submit" value="Spara" />
    </form>
<%}%>```

Jag fixar '/doc' och '/doc:id' routes i app.mjs

```app.get('/doc', async (req, res) => {
        return res.render("doc", {doc: null});
    });
    app.get('/doc/:id', async (req, res) => {
        return res.render(
            "doc",
            { doc: await documents.getOne(req.params.id) }
        );
    });
```

För att PUT method ska fungera i HTML importerar jag methodOverride`

`import methodOverride from 'method-override';`

och implementera den i app:

`app.use(methodOverride('_method'));`

Jag bifogar put och post routes i app.mjs:

```
app.post('/doc', async (req, res) => {

    // Get info from form
    const body = req.body;

    // Add or update the document
    const result = await documents.addOne(body);

    res.redirect('/');
});

app.put('/doc', async (req, res) => {
    const body = req.body;
    try {
        await documents.updateOne(body);
        return res.redirect('/'); // Redirect after update
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating document');
    }
});
```

Jag skaffar updateOne i docs.mjs:

```
updateOne: async function updateOne(body) {
    let db = await openDb();

    try {
        return await db.run(
            `UPDATE documents 
                SET title = ?,content = ?, created_at = datetime('now', 'localtime') 
                WHERE rowid = ?`,
            body.title,
            body.content,
            body.id
        );
    } catch (e) {
        console.error(e);
    } finally {
        await db.close();
    }
```
Jag updatera db/migrate.sql:

```
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at DATE DEFAULT (datetime('now','localtime'))
);
```
och restartar databas

Nu kan jag skaffa och updatera dokument.

Jag snygga till index.ejs:

Jag skaffar div element som ska innehålla olika dokument:

```<h2>Dokuments</h2>
<-- container som innehåller alla dokument -->
<div class="container">

<-- containers med länk till form som skaffar dokument-->
    <div class="doc">
        <h3><a href="/doc">New dockument</a></h3>
    </div>
    <% if (docs && docs.length > 0) { %>
        <% docs.forEach(function(doc) { %>
            <div class="doc">
                <h3><a href="/doc/<%= doc.id %>"><%= doc.title %></a></h3>
            </div>
        <% }); %>
    <% } %>
</div> ```

I style.css bifogar jag:

```
main div.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding: 10px;
}
  
main .container .doc {
    background: #f4f4f4;
    border: 1px solid #ccc;
    padding: 20px;
    text-align: center;
    height: 180px;
}

main .container .doc a {
    font-size: 0.7em;
}
```
Jag snyggar till doc.ejs:

Gör ett val av frontend ramverk och beskriv varför ... 

Jag funderar på React (som Emil Folino är bekant med).  