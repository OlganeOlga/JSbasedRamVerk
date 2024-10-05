process.env.NODE_ENV = "test";
import * as chaiModule from "chai"; 
import chaiHttp from "chai-http";
import mongo from '../../db/mongo/mongoDb.mjs'
import mongoDocs from '../../docs/remoteDocs.mjs';
import { describe } from "node:test";

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
        expect(result).to.have.property('acknowledged', true);
        expect(result).to.have.property('insertedId');
        testDocId = result.insertedId; // Save the ID for later tests
    });

    // Test for getAll function
    it('should retrieve all documents', async () => {
        const documents = await mongoDocs.getAll();
        expect(documents).to.be.an('array');
        expect(documents.length).to.be.greaterThan(0); // Assuming at least one document was added
    });

    // Test for findTitles function
    it('should find documents by title', async () => {
        const documents = await mongoDocs.findTitles('New document');
        expect(documents).to.be.an('array');
        expect(documents.length).to.be.greaterThan(0);
        expect(documents[0]).to.have.property('title', 'New document');
    });

    // Test for getByID function
    it('should retrieve a document by ID', async () => {
        const document = await mongoDocs.getByID(testDocId);
        expect(document).to.have.property('_id');
        expect(document._id.toString()).to.equal(testDocId.toString());
    });

    // Test for updateOne function
    it('should update a document by ID', async () => {
        const updatedDocument = await mongoDocs.updateOne(testDocId, 'Updated Document', 'Updated content');
        expect(updatedDocument).to.have.property('acknowledged', true);

        // Verify the update
        const document = await mongoDocs.getByID(testDocId);
        expect(document).to.have.property('title', 'Updated Document');
    });

    // Test for removeById function
    it('should remove a document by ID', async () => {
        const result = await mongoDocs.removeById(testDocId);
        expect(result).to.have.property('acknowledged', true);

        // Verify removal
        const document = await mongoDocs.getByID(testDocId);
        expect(document).to.be.null; // Expecting null if the document was removed
    });

    // Test for removeByTitle function
    it('should remove a document by title', async () => {
        // Re-add the document to test removal by title
        const result = await mongoDocs.addNew();
        const title = "New document"; // Reuse the same title for the new document
        await mongoDocs.removeByTitle(title);

        // Verify removal
        const documents = await mongoDocs.findTitles(title);
        expect(documents.length).to.equal(0); // Should not find any documents with this title
    });

    // After all tests, cleanup
    after(async () => {
        const localMongo = await mongoDb.localMongo();
        await localMongo.collection.deleteMany({}); // Clear the collection after tests
    });
});
    
    // describe( 'Get all dicuments', () => {
    //     it('should get all documents', async () => {
    //         const docs = await mongoDocs.getAll();
    //         chai.expect(docs).to.be.an('array');
    //         chai.expect(docs.length).to.be.above(0); // Assuming there's data in the collection
    //     });
    // });

    // it('should add a new document', async () => {
    //     const docs = await mongoDocs.getAll();
    //     const result = await mongoDocs.addNew();
    //     const docs2 = await mongoDocs.getAll();
    //     expect(result).to.have.property('acknowledged', true);
    //     expect(docs).not.eql(docs2);
    // });

    // //Test för update
    // it('should update a document by id', async () => {
    //     const docs = await mongoDocs.getAll();

    //     const id = docs[0]._id;
    //     const result = await mongoDocs.updateOne(id, "Test Update", "TEst update content");
    //     const docs2 = await mongoDocs.getAll();

    //     expect(result).to.have.property('acknowledged', true);
    //     expect(docs2).not.eql(docs);
    // });

    // //Test för removeById
    // it('should remove a document by id', async () => {
    //     const docs = await mongoDocs.getAll();

    //     const id = docs[0]._id;
    //     const result = await mongoDocs.removeById(id);
    //     const docs2 = await mongoDocs.getAll();

    //     expect(result).to.have.property('acknowledged', true);
    //     expect(docs).not.eql(docs2);
    // });


    


    // // Test för getByID
    // it('should get a document by id', async () => {
    //     const docs = await mongoDocs.getAll();
    //     const id = docs[0]._id;
    //     const doc = await mongoDocs.getByID(id);
    //     expect(docs[0]).eql(doc);
    //     //sinon.assert.calledOnce(mockCollection.findOne); // Kontrollera att findOne anropades
    // });

//});