import { useState, useCallback, useEffect } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import AppMain from "./components/AppMain";
import utils from './utils.mjs';
import Document from './functions/interfase'; // import interface for object Document

function App() {
    // const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    // const [loading, setLoading] = useState(true); // Initialize loading state
    // const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [username, setIsAuthenticated] = useState<boolean>(false); // Track login state

    const loadDocuments = useCallback(async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const res = utils.loadDocuments('olga@example.com', setDocuments, setLoading); 
            console.log(res, "Loaded documents"); // Log the loaded documents
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }, [username]); // Depend on username to reload documents if it changes

    // Use useEffect to load documents when the component mounts
    useEffect(() => {
        loadDocuments(); // Call loadDocuments when the component mounts
    }, [loadDocuments]); // Dependencies for the effect

    // Get the selected document ID
    const selectedDocumentId = selectedIndex !== null ? documents[selectedIndex]?._id : null;
    return (
        <>
            <ErrorBoundary>
                <AppHeader 
                    selectedIndex={selectedIndex} 
                    handleClose={() => setSelectedIndex(null)} // Reset selected index on close
                    selectedDocumentId={selectedDocumentId || ""} // Pass the selected document ID
                    reloadDocuments={loadDocuments}
                />
            </ErrorBoundary>
            <ErrorBoundary>
                <AppMain 
                    documents={documents} 
                    loading={loading} 
                    reloadDocuments={loadDocuments} 
                    selectedIndex={selectedIndex} 
                    setSelectedIndex={setSelectedIndex} 
                />
            </ErrorBoundary>
            <AppFooter />
        </>
    );
}

export default App;
