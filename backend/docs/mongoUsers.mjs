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
            

            const keyObject = await getDb.collection.find({});;

            let returnObject = [];

            if (keyObject) {
                returnObject = keyObject.map(function(user) {
                    return {
                        username: user.username,
                        password: user.password,
                        documents: user.documents,
                    }
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
        const query = {'username': userName};

        let db;
        
        try {
            db = await getDb.connect();
            let user = [];
            user = await db.collection.findOne(query);
            console.log("user : ", user)
            if (user){
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in getUser:", error);  // Log the error
            throw new Error("Database error: " + error.message);  // Re-throw or handle error
        } finally {
            await db.client.close();
        }
    },

    saveUser: async function saveUser(user) {
        let db;
        try {
            db = await getDb.connect();
            const respons = await db.collection.insertOne(user);
            return respons;
        } catch (error) {
            console.error("Error in getUser:", error);  // Log the error
            throw new Error("Database error: " + error.message);  // Re-throw or handle error
        } finally {
            await db.client.close();
        }
    },

    removeUser: async function removeUser(username) {
        const query = {'username': username};
        console.log(query)
        let db;
        try {
            db = await getDb.connect();
            const result = await db.collection.deleteOne(query);
            if (result.deletedCount === 0) {
                throw new Error("No user found with the specified username");
            }
            return { message: "User successfully removed", deletedCount: result.deletedCount };
        } catch (error) {
            console.error("Error in removeUser:", error);  // Log the error
            throw new Error("Database error: " + error.message);  // Re-throw or handle error
        } finally {
            await db.client.close();
        }
    }
};

export default mongoUsers;