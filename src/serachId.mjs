import {ObjectId} from 'mongodb';

const filter = { _id: ObjectId(body["_id"]) };
const updateDocument = {
    name: body.name,
    html: body.html,
};

const result = await db.collection.updateOne(
    filter,
    updateDocument,
);