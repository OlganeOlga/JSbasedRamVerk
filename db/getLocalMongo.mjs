import localMongo from './database.mjs';
const resultSet = await localMongo.collection.find({}).toArray();

await db.client.close();