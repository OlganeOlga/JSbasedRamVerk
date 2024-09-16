import localMongo from './mongoDb.mjs';
let dsn = `mongodb://localhost:27017/docs`;
const resultSet = await localMongo('docs').collection.find({}).toArray();

await db.client.close();