import { expect } from "chai";
import mongoDocs from '../../docs/remoteDocs.mjs';

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
        const docs2 = await mongoDocs.getAll();
        expect(result).to.have.property('acknowledged', true);
        expect(docs).not.eql(docs2);
    });

    //Test för update
    it('should update a document by id', async () => {
        const docs = await mongoDocs.getAll();

        const id = docs[0]._id;
        const result = await mongoDocs.updateOne(id, "Test Update", "TEst update content");
        const docs2 = await mongoDocs.getAll();

        expect(result).to.have.property('acknowledged', true);
        expect(docs2).not.eql(docs);
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


    


    // Test för getByID
    it('should get a document by id', async () => {
        const docs = await mongoDocs.getAll();
        const id = docs[0]._id;
        const doc = await mongoDocs.getByID(id);
        expect(docs[0]).eql(doc);
        //sinon.assert.calledOnce(mockCollection.findOne); // Kontrollera att findOne anropades
    });

});