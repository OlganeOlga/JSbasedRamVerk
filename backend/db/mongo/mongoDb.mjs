import 'dotenv/config';
import { MongoClient, ServerApiVersion} from 'mongodb';

//Connect to remote mongo-database
let uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.DB_CLUSTER}.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;


/**
 * Connect to remote database
 * 
 * @returns object: mongo database
 */
const database = { 
     connect: async function connect() {
        //console.log("initiate client");
        if (process.env.NODE_ENV === 'test') {
            uri = "mongodb://localhost:27017";
        }
        const client = new MongoClient(uri, {
                    serverApi: {version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true
                }
            }
        );
        //console.log("try to connect client")

        await client.connect();
            //console.log(" connected client")
        try {
            //console.log("try to get/create database")
        const db = client.db(process.env.DB_NAME);
            //console.log("try to get/create collection")
        const documents = db.collection(process.env.COLLECTION_NAME);
            //console.log("try to return collection")
        return {db:db, client: client, collection: documents};
        } catch (error) {
            console.error("Error by remote connection: ", error);
            await client.close(); // Close client on error
            throw error; // Rethrow the error for proper handling
        }
  }
}
  
export default database;
