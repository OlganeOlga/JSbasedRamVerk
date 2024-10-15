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
        console.log("at userDocs: getUser", userName)
        const query = {'username': userName};
        console.log("at userDocs query", query)
        let db;
        
        try {
            console.log("BEfor connected from mongoUser getUser")
            db = await getDb.connect();
            console.log("connected from mongoUser getUser")
            let user = [];
            let users = await db.collection.find();
            console.log(users)
            user = await db.collection.findOne(query);
            console.log("After fetchoing user : in MongoUsers :")
            if (user.length > 0){
                return user;
            } else {
                throw new Error("No users found");
            }
        } catch (error) {
            console.error("Error in getUser:", error);  // Log the error
            throw new Error("Database error: " + error.message);  // Re-throw or handle error
        } finally {
            await db.client.close();
        }
    },

    saveUser: async function saveUser(user) {
        console.log("at saveuser: saveUser")
        let db;
        try {
            db = await getDb.connect();
            const respons = await db.collection.insertOne(user);
        } catch (error) {
            console.error("Error in getUser:", error);  // Log the error
            throw new Error("Database error: " + error.message);  // Re-throw or handle error
        } finally {
            await db.client.close();
        }
    }
};

export default mongoUsers;