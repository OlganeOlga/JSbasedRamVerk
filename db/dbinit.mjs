import openDb from "./database.mjs";

async function initializeDb() {
    const db = await openDb();

    // Example: Create a table called 'documents'
    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS documents (
                title TEXT,
                content TEXT,
                created_at DATE DEFAULT (datetime('now','localtime'))
            );
        `);

        console.log('Table created or already exists.');
    } catch (error) {
        console.error('Error creating table:', error);
    }

    // Check if the table exists
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table';");
    console.log('Tables:', tables);

    console.log('Database initialized.');
}

initializeDb().catch(err => {
    console.error('Error initializing the database:', err);
});

export default initializeDb;
