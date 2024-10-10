// Importing the necessary modules
process.env.NODE_ENV = 'test';
import mongoDocs from '../../docs/remoteDocs.mjs';

// Jest integration tests for MongoDocs
describe('MongoDocs Integration Tests', () => {
    
    // Optional: This will ensure enough time for async DB operations.
    jest.setTimeout(10000); // Set timeout for tests

    it('should get all documents', async () => {
        const docs = await mongoDocs.getAll();
        expect(docs).toBeInstanceOf(Array);
        expect(docs.length).toBe(0); // Assuming there's data in the collection
    });

    it('should add a new document', async () => {
        const docs = await mongoDocs.getAll();
        const result = await mongoDocs.addNew();
        const docs2 = await mongoDocs.getAll();
        
        expect(result).toHaveProperty('acknowledged', true);
        expect(docs).not.toEqual(docs2);
    });

    // Test for update
    it('should update a document by id', async () => {
        const docs = await mongoDocs.getAll();

        const id = docs[0]._id;
        const result = await mongoDocs.updateOne(id, "Test Update", "Test update content");
        const docs2 = await mongoDocs.getAll();

        expect(result).toHaveProperty('acknowledged', true);
        expect(docs2).not.toEqual(docs);
    });

    // Test for getByID
    it('should get a document by id', async () => {
        const docs = await mongoDocs.getAll();
        console.log(docs)
        const id = docs[0]._id;
        const doc = await mongoDocs.getByID(id);
        expect(docs[0]).toEqual(doc);
        // If you are using mocks, you might want to verify the function call as well
        // expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    });
    
    // Test for removeById
    it('should remove a document by id', async () => {
        const docs = await mongoDocs.getAll();
        console.log(docs)
        const id = docs[0]._id;
        const result = await mongoDocs.removeById(id);
        const docs2 = await mongoDocs.getAll();

        expect(result).toHaveProperty('acknowledged', true);
        expect(docs).not.toEqual(docs2);
    });

    

});
