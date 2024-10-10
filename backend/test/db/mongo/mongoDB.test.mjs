process.env.NODE_ENV = 'test';

import database from '../../../db/mongo/mongoDb.mjs'; // Import the database module

// const collectionName = "keys"; // Define the collection name

// describe('auth', () => {

//     beforeAll(async () => {
//         const db = await database.connect(); // Get the database connection

//         // Check if the collection exists and drop it if it does
//         const collections = await db.db.listCollections({ name: collectionName }).toArray();
//         console.log(collections)
//         if (collections.length > 0) {
//             await db.db.collection(collectionName).drop(); // Correctly drop the collection
//         }
//     });

//     afterAll(async () => {
//         // Optional: Clean up the collection after tests
//         const db = await database.connect();
//         await db.db.collection(collectionName).drop().catch(() => {}); // Catch errors if collection does not exist
//         await db.client.close(); // Close the database connection
//         //server.close(); // Close the server
//     });
// });

describe('MongoDB Connection Test', () => {
    let dbClient;
    let collection;
  
    beforeAll(async () => {
        // Ensure that NODE_ENV is set to 'test' to use the local MongoDB
        process.env.NODE_ENV = 'test';
        //   process.env.DB_NAME = 'testdb'; // Set your test DB name
        //   process.env.COLLECTION_NAME = 'testcollection'; // Set your test collection name
    
        const dbConnection = await database.connect();
        // dbConnection.db.listCollections(
        //     { name: collectionName }
        // )
        // .next()
        //     .then(async function(info) {
        //         if (info) {
        //             await db.collection.drop();
        //         }
        //     })
        //     .catch(function(err) {
        //         console.error(err);
        //     })
        //     .finally(async function() {
        //         await db.client.close();
        //     });
        dbClient = dbConnection.client;
        collection = dbConnection.collection;
    });
  
    afterAll(async () => {
      if (dbClient) {
        await dbClient.close(); // Close the connection after all tests
      }
    });
  
    it('should insert a document into the collection', async () => {
      const testData = { name: 'MongoTest', value: 123 };
  
      // Insert a document
      const insertResult = await collection.insertOne(testData);
      expect(insertResult.insertedId).toBeDefined(); // Ensure the document was inserted
  
      // Fetch the document
      const fetchedDoc = await collection.findOne({ name: 'MongoTest' });
      expect(fetchedDoc).not.toBeNull();
      expect(fetchedDoc.name).toBe(testData.name);
      expect(fetchedDoc.value).toBe(testData.value);
    });
  
    it('should clean up the collection after each test', async () => {
      // Clean up any test data to keep the test environment consistent
      await collection.deleteMany({});
      const docs = await collection.find({}).toArray();
      expect(docs.length).toBe(0); // Ensure the collection is empty after cleanup
    });
  });