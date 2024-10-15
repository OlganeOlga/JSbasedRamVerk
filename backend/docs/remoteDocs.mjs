import database from '../db/mongo/mongoDb.mjs'
import { ObjectId } from 'mongodb';


// Functionality
const mongoDocs = {

    // /**
    //  * Show all users in an collection.
    //  *
    //  * @async
    //  *
    //  * @throws Error when database operation fails.
    //  *
    //  * @return {Promise<array>} The resultset as an promis.
    //  */
    //   getAll: async function getAll() {
    //     //console.log("BEfor connected from mongoDocs getAll")
    //     const remoteMongo = await database.connect();
    //     //console.log("connected from mongoDocs getAll")
    //     try {
    //         //get database  
    //         //console.log("fetching database from mongoDocs getAll")

    //         const documents = await remoteMongo.collection.find().toArray();
    //         //console.log(documents) 
    //         return documents;
    //     } catch (error) {
    //         return error;
    //     } finally {
    //         await remoteMongo.client.close();
    //     }
    // },

    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     * 
     * @param {string} name  users email 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    userDocuments: async function userDocuments(name, searched) {
        const query = {username: name};

        const options = {
            //projection: { _id: 1, title: 1, content: 1 }
            projection: { documents: 1 }
        }
        const remoteMongo = await database.connect();
        try {
            return await remoteMongo.collection.find(query, options).toArray();
        } finally {
            await remoteMongo.client.close();
        }
    },

        /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     * 
     * @param {string} name  users email
     * @param {string} userPassword users userPassword
     * @param {string} searched     title of document 
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findDocument: async function findDocument(name, password, searched) {
        const query = {username: name, password: password};

        const options = {
            //projection: { _id: 1, title: 1, content: 1 }
            projection: { documents: 1 }
        }
        const remoteMongo = await database.connect();
        try {
            const docs = await remoteMongo.collection.find(query, options).toArray();
            const one = docs.find(one => one.title === searched);
            if(!one) { 
                return "not found";
            } 
            return one;                
        } finally {
            await remoteMongo.client.close();
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
    updateDocument: async function updateDocument(username, password, id, title, content) {

        const query = {
            "username": username, 
            "password": password,
            "documents._id": new ObjectId(`${id}`)
        };
    
        const options = { upsert: false }; // do not add document if the docuent with this title is note found
        const updateDoc = {
            $set: {
                "documents.$.title": title,
                "documents.$.content": content
            },
            };
        const remoteMongo = await database.connect();

        try {
            return await remoteMongo.collection.updateOne(query, updateDoc);
        } finally {
            await remoteMongo.client.close();
        }
    },

    // db.users.updateOne(
        //     { 
        //       "username": "olga@example.com",
        //       "password": "olga@example.com",
        //       "documents._id": ObjectId("670a6fe4b88d1eb49d15cbd5")
        //     },
        //     { 
        //       $set: { 
        //         "documents.$.title": "Updated Document Title",
        //         "documents.$.content": "This is the updated content"
        //       }
        //     }
        //   )
    
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
    updateOne: async function updateOne(username, password, id, title, content) {

        const query = {username: username, password: password};

        //const data = req.params;
 
        const filter = { _id: new ObjectId(`${id}`) };
    
        const options = { upsert: false }; // do not add document if the docuent with this title is note found
        const updateDoc = {
            $set: {
              title: title,
              content: content
            },
          };
        const remoteMongo = await database.connect();
        try {
            return await remoteMongo.collection.updateOne(filter, updateDoc, options);
        } 
        catch(error) {
            console.error('MongoDB update error:', error);
        }
        finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add empty document in the collection 
     *
     * @async
     * 
     * @param {string} username  users email
     * @param {string} password users userPassword
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    newDocument: async function newDocument(username, password) {
        const query = {username: username, password: password};

        console.log("At newDocument befor connection")
        const remoteMongo = await database.connect();
        console.log("At newDocument, connected db")
        const document = {
            _id: new ObjectId(),
            title: "New document",
            content: ""
        };

        try {
            console.log("At newDocument, before update")
            const result = await remoteMongo.collection.updateOne( query, { $push: { documents: document } });
            console.log("At newDocument, after update ", result)
            return result;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add new user in the collection 
     *
     * @async
     * 
     * @param {string} name  users email
     * @param {string} userPassword users userPassword
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    addUser: async function addUser(name, userPassword) {
        const remoteMongo = await database.connect();
        const data = {
            username: name,
            password: userPassword
        };
        try {
            const document = await remoteMongo.collection.insertOne(data);
            return document;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * add new user in the collection 
     *
     * @async
     * 
     * @param {string} name  users email
     * @param {string} userPassword users userPassword
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    findUser: async function findUser(name, userPassword) {
        const remoteMongo = await database.connect();
        const data = {
            username: name,
            password: userPassword
        };
        try {
            const user = await remoteMongo.collection.findOne({password: userPassword});
            if(user.username === name){
                return user;
            } else {
                throw new Error("Name is false")
            }
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * remove document by _id from the collection 
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
        const remoteMongo = await database.connect();
        try {
            console.log("try to delete by removeByID, id =", id);
            return await remoteMongo.collection.deleteOne({_id: new ObjectId(`${id}`)})       
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * remove document by _id from the collection 
     *
     * @async
     * 
     * @param {string} id           documents id (_id)
     * @param {string} username  users email
     * @param {string} password users userPassword
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
    removeDocument: async function removeDocument(id, userName, password) {
        const query = {username: userName, password: password};
        const remove = { documents: {_id: new ObjectId(`${id}`)}};
        const remoteMongo = await database.connect();

        try {
            const result = await remoteMongo.collection.updateOne(query, { $pull: remove});
            return result;
        } finally {
            await remoteMongo.client.close();
        }
    },

    /**
     * remove document vy title in the collection 
     *
     * @async
     * @param {string} title           documents title
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<object>} The resultset as an array.
     */
        removeByTitle: async function removeByTitle(title) {
            const remoteMongo = await database.connect();
            try {
                return await remoteMongo.collection.deleteOne({title: title});           
            } finally {
                await remoteMongo.client.close();
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
            const remoteMongo = await database.connect();
            try {
                return await remoteMongo.collection.findOne({_id: new ObjectId(`${id}`)});           
            } finally {
                await remoteMongo.client.close();
            }
        },
    
    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} col        Collection.
     * @param {string} pass   Search password.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an array.
     */
    
    findByPassword: async function finedByPassword(col, pass) {
        const remoteMongo = await database.connect();
        try {
            return await remoteMongo.collection.findOne({password: pass});
        } finally {
            await remoteMongo.client.close();
        }
    },

    // /**
    //  * Find documents in an collection by matching search criteria.
    //  *
    //  * @async
    //  *
    //  * @param {string} col        Collection.
    //  * @param {object} criteria   Search criteria.
    //  * @param {object} projection What to project in results.
    //  * @param {number} limit      Limit the number of documents to retrieve.
    //  *
    //  * @throws Error when database operation fails.
    //  *
    //  * @return {Promise<array>} The resultset as an array.
    //  */
    
    // findInCollection: async function findInCollection(col, criteria, projection, limit = 1) {
        
    //     return await col.find(criteria, projection).limit(limit).toArray();
    // },
};

export default mongoDocs;