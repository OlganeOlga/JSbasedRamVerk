// /* global it describe */
// process.env.NODE_ENV = 'test';
// process.env.PORT = 4000;


// import { expect } from 'chai';
// import sinon from 'sinon';
// import mongoDocs from '../remoteDocs.mjs'; // Importera funktionerna
// import mongoDb from '../db/mongo/mongoDb.mjs'; // Importera för att mocka MongoDB-anslutningen

// describe('MongoDocs', () => {
//     let sandbox;
//     let mockCollection;
//     let mockClient;
//     const client = mongoDb.client;
//     const collection = mongoDb.collection;
//     beforeEach(() => {
//         // Skapa en sandbox för sinon
//         sandbox = sinon.createSandbox();

//         const tryCollection = [
//             {
//                 _id: '607f1f77bcf86cd799439011',
//                 title: "Test docuent",
//                 content: "Test content"
//             }
//         ]

//         // Mocka MongoDB-collection och client
//         mockCollection = { 
//             find: sandbox.stub().returns({ toArray: sandbox.stub().resolves([{ title: 'Test Document' }]) }),
//             updateOne: sandbox.stub().resolves({ acknowledged: true }),
//             insertOne: sandbox.stub().resolves({ acknowledged: true }),
//             deleteOne: sandbox.stub().resolves({ acknowledged: true }),
//             findOne: sandbox.stub().resolves({ title: 'Test Document', content: 'Test Content' })
//         };


//         mockClient = { close: sandbox.stub().resolves() };

//         // Mocka mongoDb.remoteMongo att returnera vår mockade collection och client
//         sandbox.stub(mongoDb, 'remoteMongo').resolves({
//             collection: 'texteditor',
//             client: mockClient
//         });
//     });

//     afterEach(() => {
//         // Återställ sandbox efter varje test
//         sandbox.restore();
//     });

//     // Test för getAll
//     it('should retrieve all documents', async () => {
//         const docs = await mongoDocs.getAll();
//         console.log(docs)
//         expect(docs).to.be.an('array');
//         expect(docs[0]).to.have.property('title', 'New document');
//         sinon.assert.calledOnce(collection.find); // Kontrollera att find anropades
//     });

//     // // Test för updateOne
//     // it('should update a document', async () => {
//     //     const result = await mongoDocs.updateOne('607f1f77bcf86cd799439011', 'Updated Title', 'Updated Content');
//     //     expect(result).to.have.property('acknowledged', true);
//     //     sinon.assert.calledOnce(mockCollection.updateOne); // Kontrollera att updateOne anropades
//     // });

//     // Test för addNew
//     it('should add a new document', async () => {
//         const result = await mongoDocs.addNew();
//         expect(result).to.have.property('acknowledged', true);
//         sinon.assert.calledOnce(mockCollection.insertOne); // Kontrollera att insertOne anropades
//     });

//     // Test för removeById
//     it('should remove a document by id', async () => {
//         const result = await mongoDocs.removeById('607f1f77bcf86cd799439011');
//         expect(result).to.have.property('acknowledged', true);
//         sinon.assert.calledOnce(mockCollection.deleteOne); // Kontrollera att deleteOne anropades
//     });

//     // Test för getByID
//     it('should get a document by id', async () => {
//         const doc = await mongoDocs.getByID('607f1f77bcf86cd799439011');
//         expect(doc).to.have.property('title', 'Test Document');
//         sinon.assert.calledOnce(mockCollection.findOne); // Kontrollera att findOne anropades
//     });

//     after(function(done) {
//         // Close the server after tests finish
//         server.close(done);
//       });

// });
 /* global it describe */
process.env.NODE_ENV = 'test';
process.env.PORT = 4000;

import { expect } from "chai";
import mongoDocs from './../remoteDocs.mjs';

describe('MongoDocs Integration Tests', function() {
    
    // Optional: This will ensure enough time for async DB operations.
    this.timeout(10000);

    it('should get all documents', async () => {
        const docs = await mongoDocs.getAll();
        expect(docs).to.be.an('array');
        expect(docs.length).to.be.above(0); // Assuming there's data in the collection
    });

    it('should add a new document', async () => {
        const docs = await mongoDocs.getAll();
        const result = await mongoDocs.addNew();
        console.log(docs)
        const docs2 = await mongoDocs.getAll();
        console.log(docs2)
        expect(result).to.have.property('acknowledged', true);
        expect(docs).not.eql(docs2);
    });

    //Test för removeById
    it('should remove a document by id', async () => {
        const docs = await mongoDocs.getAll();

        const id = docs[0]._id;
        const result = await mongoDocs.removeById(id);
        const docs2 = await mongoDocs.getAll();

        expect(result).to.have.property('acknowledged', true);
        expect(docs).not.eql(docs2);
    });


    // //Test för update
    // it('should remove a document by id', async () => {
    //     const docs = await mongoDocs.getAll();

    //     const id = docs[0]._id;
    //     const result = await mongoDocs.removeById(id);
    //     const docs2 = await mongoDocs.getAll();

    //     expect(result).to.have.property('acknowledged', true);
    //     expect(docs).not.eql(docs2);
    // });


    // Test för getByID
    it('should get a document by id', async () => {
        const docs = await mongoDocs.getAll();
        const id = docs[0]._id;
        const doc = await mongoDocs.getByID(id);
        expect(docs[0]).eql(doc);
        //sinon.assert.calledOnce(mockCollection.findOne); // Kontrollera att findOne anropades
    });

});