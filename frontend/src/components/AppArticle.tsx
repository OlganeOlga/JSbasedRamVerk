import OneDocument from './OneDocument';
import Document from '../functions/interface'; 

interface AppArticleProps {
    docType: string;
    usersname:string | null;
    documents: Document[];
    reloadDocuments: () => void;
    selectedIndex: number | null; // Selected document index from parent
    setSelectedIndex: (index: number | null) => void; // Function to update selectedIndex in parent
}

function AppArticle({docType, usersname, documents, reloadDocuments, selectedIndex, setSelectedIndex }: AppArticleProps) {

    // select document
    const handleSelect = (index: number) => {
        setSelectedIndex(index); // Update the parent component's selectedIndex
    };

    // remove selection and reload documents
    const handleClose = () => {
        setSelectedIndex(null);
        reloadDocuments();
    };
    const selectedDocument = selectedIndex !== null && documents[selectedIndex];

    return (
        <div className='article'>
            {selectedIndex === null || !selectedDocument ? ( // if no document is selected or invalid selection
                <ul className='list-group'>
                    {Array.isArray(documents) && documents.length === 0 ? (
                    <p>No documents found</p>
                        ) : null
                    }
                    {Array.isArray(documents) && documents.map((doc, index) => (
                        <li
                            className="list-group-item"
                            key={doc._id}
                            onClick={() => handleSelect(index)}
                        >
                            <h3>{doc.title}</h3>
                        </li>
                    ))}
                </ul>
            ) : ( // if a document is selected, render OneDocument component
                <>
                <OneDocument
                    docType={docType}
                    username={usersname}
                    docOwner={documents[selectedIndex]?.owner ?? usersname}
                    id={documents[selectedIndex]._id}
                    title={documents[selectedIndex].title}
                    content={documents[selectedIndex].content}
                    initialComments={documents[selectedIndex].comments}
                    handleClose={handleClose}
                />
                </>
            )}
        </div>
    );
}

export default AppArticle;