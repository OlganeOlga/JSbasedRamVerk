import database from "../db/mongo/mongoDb.mjs";

const roomState = {
  initDbConnection: async () => {
    return await database.connect();
  },

  updateRoomState: async (roomId, update) => {
    try {
      const { collection } = await roomState.initDbConnection();
      const checker = await collection.findOne({ roomId });
      if (!checker) {
        await collection.insertOne({ roomId, content: update });
      } else {
        await collection.updateOne({ roomId }, { $set: { content: update } });
      }
    } catch (error) {
      console.error("Error updating room state:", error);
    }
  },

  getRoomState: async (roomId) => {
    try {
      const { collection } = await roomState.initDbConnection();
      return await collection.findOne({ roomId });
    } catch (error) {
      console.error("Error fetching room state:", error);
    }
  },

  clearRoomState: async (roomId) => {
    try {
      const { collection } = await roomState.initDbConnection();
      await collection.deleteOne({ roomId });
    } catch (error) {
      console.error("Error clearing room state:", error);
    }
  },
};

export default roomState;
