
import mongoDb from '../db/mongoDb.mjs'
import { ObjectId } from 'mongodb';

let database = mongoDb.remoteMongo;
if (process.env.NODE_ENV === "test") {
    database = mongoDb.localMongo;
    console.log("use local DB");
}
// Functionality
const mongoDocs = {

    /**
     * Show all documents in an collection.
     *
     * @async
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an promis.
     */
      getAll: async function getAll() {
        const action = await database();
        try {
            //get database         
            const documents = await action.collection.find().toArray();
            console.log(documents)
            return documents;
        } catch (error) {
            return error;
        } finally {
            await action.client.close();
        }
    },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} title      title of document 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findTitles: async function findTitles(searched) {
        const query = {title: searched};

        const options = {
            projection: { _id: 1, title: 1, content: 1 }
        }
        const action = await database();
        try {
            return await action.collection.find(query, options).toArray()       
        } finally {
            await action.client.close();
        }
    },

    /**
     * update documents in an collection 
     * or create one if doc does not exists.
     *
     * @async
     *
     * @param {string} title        documents title
     * @param {string} content      documents content
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    updateOne: async function updateOne(id, title, content) {

        //const data = req.params;
 
        const filter = { _id: new ObjectId(`${id}`) };
    
        const options = { upsert: false }; // do not add document if the docuent with this title is note found
        const updateDoc = {
            $set: {
              title: title,
              content: content
            },
          };
        const action = await database();
        try {
            return await action.collection.updateOne(filter, updateDoc, options);
        } finally {
            await action.client.close();
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    addNew: async function addNew() {
        const action = await database();
        const data = {
            title: "New document",
            content: "New content"
        };
        try {
            const document = await action.collection.insertOne(data);
            return document;
        } finally {
            await action.client.close();
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     * @param {string} id           documents id (_id)
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    removeById: async function removeById(id) {
        //get database
        const action = await database();
        try {
            console.log("try to delete by removeByID, id =", id);
            return await action.collection.deleteOne({_id: new ObjectId(`${id}`)})       
        } finally {
            await action.client.close();
        }
    },

        /**
     * add empty document in the collection 
     *
     * @async
     * @param {string} title           documents title
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        removeByTitle: async function removeByTitle(title) {
            const action = await database();
            try {
                return await action.collection.deleteOne({title: title});           
            } finally {
                await action.client.close();
            }
        },

        /**
     * fiend document in the collection by _id
     *
     * @async
     * @param {string} id           documents id (_id)
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        getByID: async function getByID(id) {
            const action = await database();
            try {
                return await action.collection.findOne({_id: new ObjectId(`${id}`)});           
            } finally {
                await action.client.close();
            }
        },
};

export default mongoDocs;