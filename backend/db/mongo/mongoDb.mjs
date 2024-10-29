import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connect to remote mongo-database
let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.DB_CLUSTER}.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;

// Create an object to manage the database connection
const database = {
  /**
   * Connect to the remote database
   * 
   * @returns {Promise<object>} Object containing the database, client, and collection
   */
  connect: async function() {
    // If in test environment, use a local database
    if (process.env.NODE_ENV === 'test') {
      uri = "mongodb://localhost:27017/test";
    }

    console.log(uri);
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    try {
      await client.connect();
      console.log("dbName: ", process.env.DB_NAME);
      console.log("colName: ", process.env.COLLECTION_NAME);
      const db = client.db(process.env.DB_NAME);
      const users = db.collection(process.env.COLLECTION_NAME);
      return { db, client, collection: users }; // Return the db, client, and collection
    } catch (error) {
      console.error("Error during remote connection: ", error);
      await client.close(); // Close client on error
      throw error; // Rethrow the error for proper handling
    }
  },

  /**
   * Get a specific collection from the database
   * 
   * @param {string} collectionName - Name of the collection to access
   * @returns {Promise<object>} Object containing the database, collection, and client
   */
  getDb: async function(collectionName) {
    const { client, db } = await this.connect(); // Call the connect function

    const dbName = process.env.NODE_ENV === 'test' ? 'test' : process.env.DB_NAME || 'docs';
    const collection = db.collection(collectionName);

    return {
      db,
      collection,
      client, // Return the client to close the connection after use
    };
  },
};

export default database;
