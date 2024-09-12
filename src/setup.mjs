import { MongoClient}  from 'mongodb';
import fs from 'fs';

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'mummin';
const collectionName = 'crowd';
const jsonFilePath = './src/setup.json'; 

// Funktion för att ansluta till databasen
async function connectToMongoDB() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
    // Anslut till MongoDB-servern
    await client.connect();
    
    // Välj databasen
    const db = client.db(dbName);

    // Välj eller skapa kollektionen 'crowd'
    const collection = db.collection(collectionName);
    
   // Clear the collection
   await collection.deleteMany({});
   console.log('Collection cleared.');

   // Read and parse the JSON file
   const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
   const jsonData = JSON.parse(fileContent);

   // Insert the data into the collection
   const insertResult = await collection.insertMany(jsonData);
   console.log('Documents inserted:', insertResult.insertedCount);

   // insert one document
  //  const doc = {
  //       name: body.name,
  //       html: body.html,
  //   };

  // const result = await db.collection.insertOne(doc);
    
  } catch (err) {
    console.error('Kunde inte ansluta till MongoDB', err);
  } 
  //mongo --eval "db.crowd.find().pretty();
  finally {
    // Stäng anslutningen när du är klar
    await client.close();
  }
}
// Kör funktionen
connectToMongoDB();
