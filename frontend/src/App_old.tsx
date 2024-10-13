import { useState, useCallback, useEffect } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import AppMain from "./components/AppMain";
import Login from './components/Login';
import utils from './utils.mjs';
import Document from './functions/interfase'; // import interface for object Document

function App() {
    // empty local storage befor restarting app
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // Clear specific items or clear all of localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            // Optionally, clear all of localStorage: localStorage.clear();
        }
    }, []); // Empty dependency array to ensure this only runs once on mount

    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Track login state

    //const token = localStorage.getItem('token');

    const [username, setUsername] = useState(localStorage.getItem('username'));

    const getDocuments = (async() => {
        try {
            const res = await utils.loadDocuments(localStorage.getItem("username"), setDocuments, setLoading); 
            console.log(res, "Loaded documents"); // Log the loaded documents
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    });

    // const loadDocuments = useCallback(async () => {
    //     const token = localStorage.getItem('token');  // Get token from localStorage

    //     if (!token) {
    //         setIsAuthenticated(false);  // If no token, user is not authenticated
    //         return;
    //     }
        
    //     setLoading(isAuthenticated); // Set loading to true before fetching
    //     getDocuments();
    // }, [localStorage.getItem("username"), isAuthenticated]); // Depend on username to reload documents if it changes
    
    const loadDocuments = useCallback(async () => {
        const token = localStorage.getItem('token');  // Get token from localStorage
        
        if (!token) {
            setIsAuthenticated(false);  // If no token, user is not authenticated
            return;
        }
    
        setLoading(true); // Set loading to true before fetching
        
        try {
            await getDocuments();  // Fetch documents
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setLoading(false);  // Ensure loading is set to false after fetch
        }
    }, [isAuthenticated, username]);

    // Handle successful login by reloading documents and setting authenticated state
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);  // Mark the user as authenticated
    };

    // // Use useEffect to load documents when the component mounts
    // useEffect(() => {
    //     loadDocuments(); // Call loadDocuments when the component mounts
    // }, [loadDocuments]); // Dependencies for the effect

    //
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);  // Set authentication state
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadDocuments();  // Load documents if the user is authenticated
        }
    }, [isAuthenticated, loadDocuments]);

   

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
            {isAuthenticated ?( 
                <AppMain 
                    documents={documents} 
                    loading={loading} 
                    reloadDocuments={loadDocuments} 
                    selectedIndex={selectedIndex} 
                    setSelectedIndex={setSelectedIndex} 
                />) : (<Login onLoginSuccess={handleLoginSuccess} />)}
            </ErrorBoundary>
            <AppFooter />
        </>
    );
}

export default App;
