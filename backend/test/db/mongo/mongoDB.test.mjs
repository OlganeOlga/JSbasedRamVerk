import { server } from '../../../app.mjs'; // Import the server
import database from '../../../db/mongo/mongoDb.mjs'; // Import the database module

const collectionName = "keys"; // Define the collection name

describe('auth', () => {

    beforeAll(async () => {
        const db = await database.getDb(); // Get the database connection

        // Check if the collection exists and drop it if it does
        const collections = await db.db.listCollections({ name: collectionName }).toArray();
        if (collections.length > 0) {
            await db.db.collection(collectionName).drop(); // Correctly drop the collection
        }
    });

    afterAll(async () => {
        // Optional: Clean up the collection after tests
        const db = await database.getDb();
        await db.db.collection(collectionName).drop().catch(() => {}); // Catch errors if collection does not exist
        await db.client.close(); // Close the database connection
        server.close(); // Close the server
    });
});
