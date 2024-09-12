const doc = {
    name: body.name,
    html: body.html,
};

const result = await db.collection.insertOne(doc);

if (result.result.ok) {
    return res.status(201).json({ data: result.ops });
} else {
    return res.status(500).json({data: result.ops });
}