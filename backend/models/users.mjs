import database from "../db/mongo/mongoDb.mjs";


const users = {
    getAll: async function (apiKey=null) {
        let db;
        try {
            db = await database.connect();
            let filter = null;
            if(apiKey){
                filter = { key: apiKey };
            }

            //const suppress = { users: { username: 1, password: 1 }};

            //const keyObject = await db.collection.findOne(filter, suppress);

            const keyObject = await db.collection.find({}).toArray();
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
            return returnObject;
        } catch (err) {
            console.log("EROOR IN USERS MODELS")
            return res.status(500).json({
                error: {
                    status: 500,
                    path: "/users",
                    title: "Database error",
                    message: err.message
                }
            });
        } finally {
            await db.client.close();
        }
    },

    getUser: async function (userName) {
        console.log("in get user models/users")
        const query = {'username': userName};

        let db;
        
        try {
            db = await database.connect();
            let user;
            user = await db.collection.findOne(query);
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

    deleteUser:async function (username) {
        const db = await  database.connect();
        try {
            const result = await db.collection.deleteOne({ username });
            return result;
        } catch (error) {
            console.error("Error in deleteUser function:", error);
            throw error;
        } finally {
            await db.client.close();
        }
    },

    createUser:async function (user) {
        console.log("in create user models/users")
        const db = await database.connect();
        try {
            const result = await db.collection.insertOne(user);
            //return result.deletedCount > 0; // Return true if a user was deleted
            console.log(result)
            return result;
        } catch (error) {
            console.error("Error in deleteUser function:", error);
            throw error;
        } finally {
            await db.client.close();
        }
    },
};

export default users;
