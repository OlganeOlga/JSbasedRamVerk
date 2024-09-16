//import { localMongo } from './db/mongoDb.mjs'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// if (process.env.NODE_ENV === 'test') {
//     dsn = "mongodb://localhost:27017/test";
// }

async function run() {
    try {
      await client.connect();
      console.log("Connected successfully to server");
    } finally {
      await client.close();
    }
}


const localMongoDocs = {

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an promis.
     */
      findCollection: async function findCollection() {
        await client.connect();
        const db = client.db('docs');

        const collection = db.collection('collection1');
        return collection;
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} dbName     name of database.
     * @param {string} colName    collection to search
     *  
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    getAll: async function getAll() {

        try {
            await client.connect();
            const db = client.db('docs');
    
            const collection = await db.collection('collection1');
            const docs = await collection.find().toArray();
           return docs;
        } catch (e) {
            console.log('error in inserting: ', e);
            return e;
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     * 
     * @param {string} dbName     name of database.
     * @param {string} colName    collection to search
     * @param {<object>} doc  document to add
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    addOne: async function addOne(dbName, colName, doc) {

        try {
            const db  = await localMongo(dbName);
            const col = db.collection(colName);
            const res = await col.insertOne(doc)
           return res;
        } catch (e) {
            console.log('error in inserting: ', e);
            return e;
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {promis<collection>} collection       DSN to connect to database.
     * @param {object} toInsert    object that should be inserted.
     * 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    insert: async function insert(collection, toInsert) {
        
        try{
            const res  = await collection.insertOne(toInsert);
            return res;
        } catch (e) {
            console.log('error in inserting: ', e);
            return e;
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} col        Collection.
     * @param {object} criteria   Search criteria.
     * @param {object} projection What to project in results.
     * @param {number} limit      Limit the number of documents to retrieve.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an array.
     */
    
    findInCollection: async function findInCollection(col, criteria, projection, limit) {
        
        const res = await col.find(criteria, projection).limit(limit).toArray();

        return res;
    },

 

    // const filter = { _id: ObjectId(body["_id"]) };
    // const updateDocument = {
    //     name: body.name,
    //     html: body.html,
    // };

    // updateOne: await db.collection.updateOne(
    //     filter,
    //     updateDocument,
    // );


};

export default localMongoDocs;