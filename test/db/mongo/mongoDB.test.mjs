process.env.NODE_ENV = "test";
import * as chaiModule from "chai"; 
import chaiHttp from "chai-http/index.js";
import { describe } from "node:test";
import mongo from '../../db/mongo/mongoDb.mjs'
import mongoDocs from '../../docs/remoteDocs.mjs';

const chai = chaiModule.use(chaiHttp);

chai.should();

describe('MongoDocs TESTS', ()  => {
    let testDocId; // To store the ID of the document we add

    // Before all tests, create a test database and collection
    before(async () => {
        const localMongo = await mongo.localMongo();
        await localMongo.collection.deleteMany({}); // Clear the collection
    });

    // Test for addNew function
    it('should add a new document', async () => {
        const result = await mongoDocs.addNew();
        chai.expect(result).to.have.property('acknowledged', true);
        chai.expect(result).to.have.property('insertedId');
        testDocId = result.insertedId; // Save the ID for later tests
    });

    // Test for getAll function
    it('should retrieve all documents', async () => {
        const documents = await mongoDocs.getAll();
        chai.expect(documents).to.be.an('array');
        chai.expect(documents.length).to.be.greaterThan(0); // Assuming at least one document was added
    });

    // Test for findTitles function
    it('should find documents by title', async () => {
        const documents = await mongoDocs.findTitles('New document');
        chai.expect(documents).to.be.an('array');
        chai.expect(documents.length).to.be.greaterThan(0);
        chai.expect(documents[0]).to.have.property('title', 'New document');
    });

    // Test for getByID function
    it('should retrieve a document by ID', async () => {
        const document = await mongoDocs.getByID(testDocId);
        chai.expect(document).to.have.property('_id');
        chai.expect(document._id.toString()).to.equal(testDocId.toString());
    });

    // Test for updateOne function
    it('should update a document by ID', async () => {
        const updatedDocument = await mongoDocs.updateOne(testDocId, 'Updated Document', 'Updated content');
        chai.expect(updatedDocument).to.have.property('acknowledged', true);

        // Verify the update
        const document = await mongoDocs.getByID(testDocId);
        chai.expect(document).to.have.property('title', 'Updated Document');
    });

    // Test for removeById function
    it('should remove a document by ID', async () => {
        const result = await mongoDocs.removeById(testDocId);
        chai.expect(result).to.have.property('acknowledged', true);

        // Verify removal
        const document = await mongoDocs.getByID(testDocId);
        chai.expect(document).to.be.null; // Expecting null if the document was removed
    });

    // Test for removeByTitle function
    it('should remove a document by title', async () => {
        // Re-add the document to test removal by title
        const result = await mongoDocs.addNew();
        const title = "New document"; // Reuse the same title for the new document
        await mongoDocs.removeByTitle(title);

        // Verify removal
        const documents = await mongoDocs.findTitles(title);
        chai.expect(documents.length).to.equal(0); // Should not find any documents with this title
    });

    // After all tests, cleanup
    after(async () => {
        const localMongo = await mongoDocs.localMongo();
        await localMongo.collection.deleteMany({}); // Clear the collection after tests
    });
});
