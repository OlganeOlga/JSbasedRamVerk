import mongo from 'mongodb';
//import dbMongo from './db/database.mjs'


const localMongoDocs = {
    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} dsn        DSN to connect to database.
     * @param {string} colName    Name of collection.
     * @param {object} criteria   Search criteria.
     * @param {object} projection What to project in results.
     * @param {number} limit      Limit the number of documents to retrieve.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an array.
     */
    
    findInCollection: async function findInCollection(dsn, colName, criteria, projection, limit) {
        const client  = await mongo.connect(dsn);
        const db = await client.localMongo();
        const col = await db.collection(colName);
        const res = await col.find(criteria, projection).limit(limit).toArray();

        await client.close();

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