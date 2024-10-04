import openDb from "./database.mjs";

async function addOne(title, content) {
    const db = await openDb();
    try {
        await db.run(`
            INSERT INTO documents (title, content)
            VALUES (?, ?)
        `, [title, content]);

        console.log('Row inserted successfully.');
    } catch (err) {
        console.error('Error inserting row:', err);
    } finally {
        await db.close();
    }
}

export default addOne;
