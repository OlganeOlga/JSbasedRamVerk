import database from "../db/mongo/mongoDb.mjs";

let dbConnection;  // Holds a persistent connection for comments

const comments = {
  initDbConnection: async () => {
    if (!dbConnection) {
      dbConnection = await database.getDb();
    }
    return dbConnection;
  },

  addComment: async (roomId, comment, caret, row) => {
    console.log("in addComment")
    const db = await comments.initDbConnection();
    console.log("in addComment connect to db")
    await db.collection.insertOne({
      roomId: roomId,
      comment: comment,
      caret: caret,
      row: row,
    });
    console.log("in addComment finish")
  },

  getComments: async (roomId) => {
    const db = await comments.initDbConnection();
    const roomComments = await db.collection
      .find({
        roomId: roomId,
      })
      .toArray();

    return roomComments;
  }
};

export default comments;
