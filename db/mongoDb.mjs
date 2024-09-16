import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
//Connect to database
const uri = "mongodb+srv://texteditor1:dbwebb@cluster0.wf5vm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


/**
 * Connect to database remote
 * 
 * @returns object: mongo database
 */
async function mongoDb() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

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
 * 
 * @param {string} dsn : mongo-port
 * @returns {Promise<object>}: local mongo db
 */
export async function localMongo (dsn = `mongodb://localhost:27017`) {
  
  const client = new MongoClient(dsn);
  
  if (process.env.NODE_ENV === 'test') {
      dsn = "mongodb://localhost:27017/test";
  }

  try {
    return await client.connect();
    // console.log('Client connected');
    // return client.db(dtb); // returning the DB instance
  } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error; // Re-throw error for proper handling
  }
};

// export async function getLocalMongo(dbname) {
//   try {
//       return await localMongo(dbname);
//   } catch (error) {
//       console.error('Error fetching database:', error);
//       throw error;
//   }
// }
  
export default { mongoDb, localMongo };
//run().catch(console.dir);