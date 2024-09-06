# SSR Editor

Project for DV1677 JSRamverk

Satt port på 3006 på  const port = process.env.PORT || 3000; // Default to 3006 if PORT is undefined i app.mjs, för att kunna öppna appen. Annars får man felmeddelade "app listening on port undefined"

Nytt försök att öppan appen leder till felmeddelande:

    [Error: SQLITE_ERROR: no such table: documents] {
      errno: 1,
      code: 'SQLITE_ERROR'
    }
    ::1 - - [04/Sep/2024:12:41:35 +0000] "GET / HTTP/1.1" 200 461 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0"

FIxas med:
    `cat db/migrate.sql | sqlite3 db/docs.sqlite`
i terminalen. Detta är en reset på databasen.
cat db/migrate.sql läser innehållet i filen db/migrate.sql.
| (pipe) skickar innehållet från cat till sqlite3.
sqlite3 db/docs.sqlite kör SQLite3-verktyget och tillämpar SQL-kommandona från migrate.sql på databasen db/docs.sqlite.

Nu kommer inga felmeddelanden när appen startas.

För att sedan få appen att fungera tillämpar vi:

I index.ejs:

bifogar länk som skaffar nya dokument

    `<h3><a href="/doc">Create a new dockument</a></h3>`

och anpassa länken av befintliga dokumant:

    <h3><a href="/doc/<%= doc.id %>"><%= doc.title %></a></h3>

I doc.ejs:

skaffas en if-sats som ska bero på länken

    ```<h2>Dokument</h2>
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
    <%}%>
    ```
I app.mjs använder vi methodOverride som tillåter använda PUT method i HTML-form
`
import methodOverride from 'method-override';

app.use(methodOverride('_method'));
`
Även '/doc' och '/doc:id' routes i app.mjs fixas:

    ```
    app.get('/doc', async (req, res) => {
        return res.render("doc", {doc: null});
    });
    app.get('/doc/:id', async (req, res) => {
        return res.render(
            "doc",
            { doc: await documents.getOne(req.params.id) }
        );
    });

put och post routes bifogas i app.mjs:

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
I docs.mjs skapar vi ny method:

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

Vi ändrar table i db/migrate.sql till:

```
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        created_at DATE DEFAULT (datetime('now','localtime'))
    );
```

och skapar databas igen

Vi väljer att kika närmre på React då det ses som mest populärt och "enklast" samt att det känns som flest är bekant med detta ramverk

Nu har vi en fungerande app. Återstående är finslipning av själva sidan. Här snackar vi om styling och lite småsaker.

Vi lägger till i index.ejs att om där inte är någon title på dokumentent visas då "Document: No Title".

                ```
                <a href="/doc/<%= doc.id %>">
                    Document: <%= doc.title ? doc.title : 'No Title' %>
                </a>
                ```

Vi har stylat sidan enkelt nu i början och tänker jobba vidare med det. Då det inte var något krav slängde vi in allt i style.css men har ambitionerna på att dela upp det mycket mer snyggt och lättläst, samt ge en mer proffesionell bild av arbetet. Det leder även till att det blir enklare att hitta för någon som aldrig sett koden innan. Vi kommer tillämpa saker vi lärt oss från design kursen.

Sedan la vi även till doc.ejs att titeln blir till "Document: (och sedan titelns namn.)"

    ```<h2>Document: <%= doc.title ? doc.title : 'No Title' %></h2>```

är där ingen title så blir det No Title.

Det vi kan tänka på till nästa moment är att exemplevis med två liknande namn titlar så sätts automatiskt en 1a efter. Exempelvis ett doc heter Hej, och om jag sedan döper ett till doc till Hej så bör det automatiskt bli Hej1 och så vidare.