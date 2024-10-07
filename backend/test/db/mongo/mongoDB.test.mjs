import * as chaiModule from "chai"; // fingerar inte med enkelt import pga js-filer i chai
import chaiHttp from "chai-http";
import {server} from "../../../app.mjs"; // det finns inte defoult export

const chai = chaiModule.use(chaiHttp);

chai.should();

import database from "../../../db/mongo/mongoDb.mjs"

const collectionName = "keys";    // Define the collection name

describe('auth', () => {
   
    before(async () => {
        const db = await database.getDb(); // Get the database connection

        // Check if the collection exists and drop it if it does
        await db.db.listCollections({ name: collectionName })
            .next()
            .then(async (info) => {
                if (info) {
                    await db.db.collection(collectionName).drop(); // Correctly drop the collection
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

    after(async () => {
        // Optional: Clean up the collection after tests
        const db = await database.getDb();
        await db.db.collection(collectionName).drop().catch(() => {});
        await db.client.close(); // Close the database connection
       
        
        server.close(done);
        
    });
});
