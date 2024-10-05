import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

async function restoreDatabase() {
    const dbName = 'docs'; // Update this to your actual database name
    const collectionName = 'texteditor'; // Update this to your actual collection name
    const pathToBackup = './mongo/docs/texteditor'; // Path to the BSON files relative to migrate.mjs

    try {
        const { stdout, stderr } = await execPromise(`mongorestore --nsInclude=${dbName}.${collectionName} ${pathToBackup}`);
        if (stderr) {
            console.error(`Error restoring database: ${stderr}`);
        } else {
            console.log('Database restored successfully:', stdout);
        }
    } catch (error) {
        console.error(`Failed to restore database: ${error.message}`);
    }
}  

export default restoreDatabase;
