import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connect to remote mongo-database
let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.DB_CLUSTER}.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;

// Create an object to manage the database connection
const database = {
  connect: async function() {
    // If in test environment, use a local database
    if (process.env.NODE_ENV === 'test') {
      uri = "mongodb://localhost:27017/test";
    }

    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME || 'default_db'); // Ensure valid DB name
      const collection = db.collection(process.env.COLLECTION_NAME || 'document'); // Ensure valid collection name
      return { db, client, collection };
    } catch (error) {
      console.error("Error during remote connection: ", error);
      await client.close();
      throw error; 
    }
  },

  getDb: async function() {
    const { client, db } = await this.connect();
    const collection = db.collection(process.env.COLLECTION_NAME || 'document');
    
    return {
      db,
      collection,
      client, // Return the client for cleanup later
    };
  },
};

export default database;
