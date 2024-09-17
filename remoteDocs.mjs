import mongoDb from './db/mongoDb.mjs'
import { ServerApiVersion, ObjectId } from 'mongodb';
//const uri = 'mongodb://localhost:27017';

const remoteMongo = mongoDb.remoteMongo();

// Functionality
const mongoDocs = {

    /**
     * See list of collecions
     * @async
     * 
     * @param {string} dbName
     * 
     * @return {Promise<array>} collections
     */
    getCollections: async function getCollections(dbName) {
        
    },

    /**
     * Show all documents in an collection.
     *
     * @async
     * 
     * @param {string} dbName   name of database
     * @param {string} colName    collection to search
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an promis.
     */
      getAll: async function getAll(dbName, colName) {
        const client = await remoteMongo();
        const db = client.db(dbName);
        try {
            //get database
            const collection = await db.collection(colName).find().toArray();
            return collection;
        } catch (error) {
            console.log("ERROR with geting colleciont")
            throw error;
        } finally {
            await client.close();
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} dbName     name of database.
     * @param {string} colName    collection to search
     * @param {string} title      title of document 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findTitles: async function findTitles(dbName, colName, searched) {
        const query = {title: searched};

        const options = {
            projection: { _id: 1, title: 1, content: 1 }
        }
        const client = await remoteMongo();
        const db = client.db(dbName);
        try {
            const result = await db.collection(colName).find(query, options).toArray();
            return result;
        } catch (error) {
            throw error;
        } finally {
            await client.close()
        }
    },

    /**
     * uppdate documents in an collection 
     * or create one if doc does not exists.
     *
     * @async
     * 
     * @param {string} dbName       name of database.
     * @param {string} colName      collection to search
     * @param {string} title        documents title
     * @param {string} content      documents content
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    uppdateOne: async function uppdateOne(dbName, colName, title, content) {

        //const data = req.params;
 
        const filter = { title: title };
    
        const options = { upsert: true }; // add document if the docuent with this title is note found
        const updateDoc = {
            $set: {
              title: title,
              content: content
            },
          };
        const client = await remoteMongo();
        const db = client.db(dbName);
        try {
            const result = await db.collection(colName).updateOne(filter, updateDoc, options);
            return result;
        } catch (error) {
            throw error;
        } finally {
            await client.close();
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     * 
     * @param {string} dbName       name of database.
     * @param {string} colName      collection to searched
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    addNew: async function addNew(dbName, colName) {
        const client = await remoteMongo();
        const db = client.db(dbName);
        const data = {
            title: "unnamed",
            content: ""
        };
        try {
            const document = await db.collection(colName).insertOne(data);
            return document;
        } catch (error) {
            throw error;
        } finally {
            await client.close()
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     * 
     * @param {string} dbName       name of database.
     * @param {string} colName      collection to searched
     * @param {string} id           documents id (_id)
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    removeById: async function removeById(dbName, colName, id) {
        //get database
        const client = await remoteMongo();
        const db = client.db(dbName);
        try {
            const result = await db.collection(colName).deleteOne({_id: new ObjectId(`${id}`)});
            return result;
        
        } catch (error) {
            throw error;
        } finally {
            await client.close()
        }
    },

        /**
     * add empty document in the collection 
     *
     * @async
     * 
     * @param {string} dbName       name of database.
     * @param {string} colName      collection to searched
     * @param {string} title           documents title
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        removeByTitle: async function removeByTitle(dbName, colName, title) {
            //get database
            const client = await remoteMongo();
            const db = client.db(dbName);
            try {
                const result = await db.collection(colName).deleteOne({title: title});
                return result;
            
            } catch (error) {
                throw error;
            } finally {
                await client.close()
            }
        },

        /**
     * fiend document in the collection by _id
     *
     * @async
     * 
     * @param {string} dbName       name of database.
     * @param {string} colName      collection to searched
     * @param {string} id           documents id (_id)
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        getByID: async function getByID(dbName, colName, id) {
            //get database
            const client = await remoteMongo();
            const db = client.db(dbName);
            try {
                const result = await db.collection(colName).findOne({_id: new ObjectId(`${id}`)});
                return result;
            
            } catch (error) {
                throw error;
            } finally {
                await client.close()
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

 

// // remove one dcument as JSON with given _id
// router.get("/mongo/deleat/:id", async(req, res) => {
//     //get database
//     const client = await remoteMongo();
//     const db = client.db(dbName);
//     try {
//         const document = await db.collection(colName).deleteOne({_id: new ObjectId(`${req.params.id}`)});
//         res.json({document: document});
//     } catch (error) {
//         res.json({error: error});
//     } finally {
//         await client.close();
//     }
// });

// // remove one dcuments as JSON with given title
// router.get("/mongo/deleatByTitle/:title", async(req, res) => {
//     //get database
//     const client = await remoteMongo();
//     const db = client.db(dbName);
//     try {
//         const document = await db.collection(colName).deleteOne({title: req.params.title});
//         res.json({document: document});
//     } catch (error) {
//         console.log('error in deleating document by title: ', error);
//         res.json({error: error});
//     } finally {
//         await client.close();
//     }
// });

// // get one dcument as JSON
// router.get("/:id", async(req, res) => {
//     //get database
//     const client = await remoteMongo();
//     const db = client.db(dbName);
//     try {
//         const document = await db.collection(colName).findOne({_id: new ObjectId(`${req.params.id}`)});
//         res.json({document: document});
//     } catch (error) {
//         console.log('error in searching document by _id: ', error);
//         res.json({error: error});
//     } finally {
//         await client.close();
//     }
// });


// router.get('/mongo/getByTitle/:title', async (req, res) => {
//     const searched = req.params.title;
//     const query = {title: searched};

//     const options = {
//         projection: { _id: 1, title: 0, content: 0 }
//     }
//     const client = await remoteMongo();
//     const db = client.db(dbName);
//     try {
//         const result = await db.collection(colName).find(query, options).toArray();
//         res.json({ document: result });
//     } catch (error) {
//         console.log('error in searching document by title: ', error);
//         res.json({ error: error });
//     } finally {
//         await client.close()
//     }
// });


// // uppdate or add a new document with title and content
// router.get('/mongo/uppdate/:title/:content', async (req, res) => {
//     const data = req.params;
 
//     const filter = { title: data.title };

//     const options = { upsert: true }; // add document if the docuent with this title is note found
//     const updateDoc = {
//         $set: {
//           title: data.title,
//           content: data.content
//         },
//       };
//       const client = await remoteMongo();
//     const db = client.db(dbName);
//     try {
//         const result = await db.collection(colName).updateOne(filter, updateDoc, options);
//         console.log("result: ", result);
//         res.json({ result: result });
//     } catch (error) {
//         console.log('error in inserting: ', error);
//         res.json({ error: error });
//     } finally {
//         await client.close();
//     }
// });

// // add an new unnamed document
// router.get('/mongo/new', async (req, res) => {
//     const client = await remoteMongo();
//     const db = client.db(dbName);
//     const query = {title: /^unnamed\d+$/};
//     const options = {
//         projection: { _id: 1, title: 0, content: 0 }
//     }
//     try {
//         //give number for the unnamed document
//         const data = {
//                 //title: "unnamed" + number,
//                 title: "unnamed",
//                 content: ""
//         };
//         const document = await db.collection(colName).insertOne(data);
//         res.json({ document: document });
//     } catch (error) {
//         console.log('error in adding empty document: ', error);
//         res.json({ error: error });
//     } finally {
//         await client.close()
//     }
// });

};

export default mongoDocs;