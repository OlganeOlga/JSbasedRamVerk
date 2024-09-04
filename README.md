# SSR Editor

Starter project for DV1677 JSRamverk

Satt port på 9000 på  const port = process.env.PORT || 9000; // Default to 9000 if PORT is undefined i app.mjs, för att kunna öppna appen. Annars blir det Example app listening on port undefined

[Error: SQLITE_ERROR: no such table: documents] {
  errno: 1,
  code: 'SQLITE_ERROR'
}
::1 - - [04/Sep/2024:12:41:35 +0000] "GET / HTTP/1.1" 200 461 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0"

När jag öppnar appen...


cat db/migrate.sql | sqlite3 db/docs.sqlite kör jag för att

cat db/migrate.sql | sqlite3 db/docs.sqlite:
cat db/migrate.sql läser innehållet i filen db/migrate.sql.
| (pipe) skickar innehållet från cat till sqlite3.
sqlite3 db/docs.sqlite kör SQLite3-verktyget och tillämpar SQL-kommandona från migrate.sql på databasen db/docs.sqlite.

Nu får jag inga felmeddelanden.

Gör en post /update i app.mjs samt ändra i doc.ejs för att det ska fungera....

Fixa vyerna....