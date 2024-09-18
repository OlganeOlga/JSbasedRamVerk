import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
//Connect to remote mongo-database
//const uri = `mongodb+srv://oleg22:DEyTL0mOhfjdcK8g@texteditor.topue.mongodb.net/?retryWrites=true&w=majority&appName=texteditor`;
const username = process.env.ATLAS_USERNAME;
const password = process.env.ATLAS_PASSWORS;
const cluster = "texteditor";
const authSource = "<authSource>";
const authMechanism = "<authMechanism>";
const uri = `mongodb+srv://oleg22:DEyTL0mOhfjdcK8g@texteditor.topue.mongodb.net/admin?retryWrites=true&w=majority&appName=texteditor`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const dsn = `${process.env.LOCAL_DSN}`;

const localDB = "docs";
const localCollection = "document";

//console.log(dsn);
const mongo = {
  /**
   * Connect to remote database
   * 
   * @returns object: mongo database
   */
  remoteMongo: async function remoteMongo() {
    console.log("initiate client")
    const client = new MongoClient(uri);
    console.log("try to connect client")
    await client.connect();
    console.log(" connected client")
    try {
      console.log("try to get/create database")
      const database = client.db('docs');
      console.log("try to get/create collection")
      const documents = database.collection('document');
      console.log("try to return collection")
      return {client: client, documents: documents};
    } catch (error) {
      console.log("error by remote connection : ", error);
    }
  },
    
  // /**
  //  * Create connection to local MongoDB
  //  * 
  //  * @returns {Promise<object>}: local mongo db
  //  */
  // localMongo: async function localMongo () {
  //   console.log("start localMOngo")
    
  //   if (process.env.NODE_ENV === 'test') {
  //       dsn = "mongodb://localhost:27017/test";
  //   }
  //   const client = new MongoClient(dsn);
  //   console.log("after getting clietn")
  //   try {
  //     console.log('Client will be connected');
  //     await client.connect();

  //     const db = client.db(localDB);
  //     const collection = db.collection(localCollection);

  //     return {client: client, collection: collection};

  //   } catch (error) {
  //       console.error("Error connecting to MongoDB:", error);
  //       throw error; // Re-throw error for proper handling
  //   }
  // }
}
  
export default mongo;
//run().catch(console.dir);