import database from "../db/mongo/mongoDb.mjs";

const collectionName = "rooms";
let dbConnection;

const roomState = {
  initDbConnection: async () => {
    if (!dbConnection) {
      dbConnection = await database.getDb(collectionName);
    }
    return dbConnection;
  },

  updateRoomState: async (roomId, update) => {
    try {
      const db = await roomState.initDbConnection();
      const checker = await db.collection.findOne({ roomId });
      if (!checker) {
        await db.collection.insertOne({ roomId, content: update });
      } else {
        await db.collection.updateOne(
          { roomId },
          { $set: { content: update } }
        );
      }
    } catch (error) {
      console.error("Error updating room state:", error);
    }
  },

  getRoomState: async (roomId) => {
    try {
      const db = await roomState.initDbConnection();
      return await db.collection.findOne({ roomId });
    } catch (error) {
      console.error("Error fetching room state:", error);
    }
  },

  clearRoomState: async (roomId) => {
    try {
      const db = await roomState.initDbConnection();
      await db.collection.deleteOne({ roomId });
    } catch (error) {
      console.error("Error clearing room state:", error);
    }
  },
};

export default roomState;
