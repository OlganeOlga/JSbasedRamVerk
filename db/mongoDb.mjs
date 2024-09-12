import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
//Connect to database
const uri = "mongodb+srv://texteditor1:dbwebb@cluster0.wf5vm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/**
 * Connect to database
 * 
 * @returns object: mongo database
 */
async function mongoDb() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  };
  
  /**
   * Create connection to local MongoDB
   * @returns object: local mongo db
   */
  async function localMongo () {
      let dsn = `mongodb://localhost:27017/mummin`;
  
      if (process.env.NODE_ENV === 'test') {
          dsn = "mongodb://localhost:27017/test";
      }
  
      const client  = await client.connect(dsn, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      const db = await client.db();
      return db;
  };
  
  export default { mongoDb, localMongo };
  //run().catch(console.dir);