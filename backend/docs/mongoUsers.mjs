import getDb from '../db/mongo/mongoDb.mjs'

// Functionality
const mongoUsers = {

    /**
     * Show all users in an collection.
     *
     * @async
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an promis.
     */
      getAll: async function getAll() {
        let db;

        try {
            db = await getDb.connect();

            // const filter = { key: apiKey };

            // const suppress = { users: { email: 1, password: 0 }};
            

            const keyObject = await getDb.collection.find({}, { projection: { username: 1, password: 1, _id: 0 } });;

            let returnObject = [];

            if (keyObject.users) {
                returnObject = keyObject.users.map(function (user) {
                    return { name: user.username };
                });
            }

            return res.status(200).json({
                data: returnObject
            });
        } catch (err) {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "/users",
                    title: "Database error",
                    message: err.message
                }
            });
        } finally {
            await getDb.client.close();
        }
    },

    /**
     * Show a user in an collection.
     *
     * @async
     * @param {string} userName  users email 
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an promis.
     */
    getUser: async function getUser(userName) {
        console.log("at userDocs: getUser")
        const query = {username: userName};
        
        let db;
        
        try {
            console.log("BEfor connected from mongoDocs getUser")
            db = await getDb.connect();
            console.log("connected from mongoDocs getOne")
            //get database  
            //console.log("fetching database from mongoUsers getUser")

            let user = [];
            user = await db.collection.find(query).toArray();
            console.log("user: ",user) 
            console.log("after fetching user")
            return user;
            // return res.status(200).json({
            //     user: user
            // });

        } catch (error) {
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "/auth/login",
                    title: "Database error",
                    message: err.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    // /**
    //  * Find documents in an collection by matching search criteria.
    //  *
    //  * @async
    //  * 
    //  * @param {string} name  users email 
    //  *
    //  * @throws Error when database operation fails.
    //  *
    //  * @return {Promise<object>} The resultset as an array.
    //  */
    // findDocuments: async function findDocuments(name, searched) {
    //     const query = {username: name};

    //     const options = {
    //         //projection: { _id: 1, title: 1, content: 1 }
    //         projection: { username: 1, password: 1 }
    //     }
    //     const remoteMongo = await database.connect();
    //     try {
    //         return await remoteMongo.collection.find(query, options).toArray();
    //     } finally {
    //         await remoteMongo.client.close();
    //     }
    // },

    //     /**
    //  * Find documents in an collection by matching search criteria.
    //  *
    //  * @async
    //  * 
    //  * @param {string} name  users email
    //  * @param {string} userPassword users userPassword
    //  * @param {string} searched     title of document 
    //  *
    //  * @throws Error when database operation fails.
    //  *
    //  * @return {Promise<object>} The resultset as an array.
    //  */
    // findDocument: async function findDocument(name, password, searched) {
    //     const query = {username: name, password: password};

    //     const options = {
    //         //projection: { _id: 1, title: 1, content: 1 }
    //         projection: { documents: 1 }
    //     }
    //     const remoteMongo = await database.connect();
    //     try {
    //         const docs = await remoteMongo.collection.find(query, options).toArray();
    //         const one = docs.find(one => one.title === searched);
    //         if(!one) { 
    //             return "not found";
    //         } 
    //         return one;                
    //     } finally {
    //         await remoteMongo.client.close();
    //     }
    // },

};

export default mongoUsers;