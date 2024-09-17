import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
//Connect to remote mongo-database
//const uri = `mongodb+srv://oleg22:DEyTL0mOhfjdcK8g@texteditor.topue.mongodb.net/?retryWrites=true&w=majority&appName=texteditor`;
const username = encodeURIComponent("oleg22");
const password = encodeURIComponent("DEyTL0mOhfjdcK8g");
const cluster = "texteditor";
const authSource = "<authSource>";
const authMechanism = "<authMechanism>";
const uri = `mongodb+srv://${username}:${password}@${cluster}.topue.mongodb.net/?retryWrites=true&w=majority&appName=texteditor`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const dsn = `${process.env.LOCAL_DSN}`;

const localDB = "docs";
const localCollection = "document";

//console.log(dsn);
const mongo = {
  /**
   * Connect to database remote
   * 
   * @returns object: mongo database
   */
  remoteMongo: async function remoteMongo() {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    try {
      // Connect the client to the server	(optional starting in v4.7)
      const connectedClient= await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      return connectedClient;
    } catch (error) {
      console.log("error by remote connection : ", error);
    }
  },
    
  /**
   * Create connection to local MongoDB
   * 
   * @returns {Promise<object>}: local mongo db
   */
  localMongo: async function localMongo () {
    console.log("start localMOngo")
    //const dsn = `mongodb://localhost:27017`
    if (process.env.NODE_ENV === 'test') {
        dsn = "mongodb://localhost:27017/test";
    }
    const client = new MongoClient(dsn);
    console.log("after getting clietn")
    try {
      console.log('Client will be connected');
      await client.connect();

      const db = client.db(localDB);
      const collection = db.collection(localCollection);

      return {client: client, collection: collection};

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Re-throw error for proper handling
    }
  }
}
  
export default mongo;
//run().catch(console.dir);