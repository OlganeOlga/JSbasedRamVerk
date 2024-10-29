import { useState, useEffect } from 'react'; 
import AppFooter from "./components/includes/AppFooter";
import AppHeader from "./components/includes/AppHeader";
import ErrorBoundary from './components/includes/ErrorBoundary';
import { BrowserRouter } from 'react-router-dom';
import AppMain from "./components/AppMain";
import Auth from './components/Auth';
import utils from './utils.mjs';
import Document from './functions/interface'; // import interface for object Document
import { socket } from './socket.mjs';

function App() {
    // //socet variables
    // const [isConnected, setIsConnected] = useState(socket.connected);
    // const [fooEvents, setFooEvents] = useState([]);
    
    const [documents, setDocuments] = useState<Document[]>([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Initialize selected index
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
   

    useEffect(() => { 
        const storedUsername = sessionStorage.getItem('username');
        const storedToken = sessionStorage.getItem('token');
        
        if (storedUsername) {
            setUsername(storedUsername);
        };
        if (storedToken) {
            setToken(storedToken);
        };
        
    }, []);

    const loadDocuments = async () => {        
        //let route = "/data/" + doctype + username;
        let body;
        let docType = sessionStorage.getItem("docType") || "";
        switch(docType) {
            case "": 
                body = JSON.stringify({
                    query: `
                        {
                            user(username: "${username}") {
                                documents {
                                    _id
                                    title
                                    content
                                    comments {
                                        author
                                        content
                                    }
                                    allowed_users
                                }
                            }
                        }
                    `
                    });
                break;
            case "shared/":
                body = JSON.stringify({
                    query: `
                        {
                            sharedWithUser(username: "${username}") {
                                owner
                                _id
                                title
                                content
                                comments {
                                    author
                                    content
                                }
                            }
                        }
                    `
                    });
        }

        setLoading(true); // Start loading
        try {
            //const result = await utils.processRoute('GET', route); // Call fetch function here

            //GRAPHQL VARIANT
              
            
            const result = await utils.graphQL(body, token);
            
            if (result.status === 200) {
                // Update documents state
                switch(docType){
                    case "":
                        setDocuments(result.result.data.user.documents);
                        break;
                    case "shared/":
                        setDocuments(result.result.data.sharedWithUser);
                        break; 
                    }
                
            } else {
                setDocuments([]); // Handle no documents case
            }
        } catch (error) {
            console.error("Error loading documents:", error);
            setDocuments([]); // Reset documents on error
        } finally {
            setLoading(false); // End loading
        }
    };

    const getDocuments = (async() => {
        if (sessionStorage.getItem('username')) {
            setUsername(sessionStorage.getItem('username'));
        }
        if (sessionStorage.getItem('token')) {
            setToken(sessionStorage.getItem('token'));
        }
        if (!token) return; // Prevent calling if username is not set
        setLoading(true); // Start loading

        try {
            const res = await loadDocuments();
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false); // End loading
        }
    });
    
     useEffect(() => {
        if (token) {
            getDocuments(); // Load documents if the token exists
        }
    }, [token, username]); // Re-run when token or username changes

    // Handle successful login
    const handleLoginSuccess = () => {
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken); // Update token in state after login
        }
    };

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
                    username={username}
                    token={token} 
                    />
            </ErrorBoundary>
            <ErrorBoundary>
            <BrowserRouter>
            {token ?( 
                <AppMain
                    docType={sessionStorage.getItem("docType") || ""}
                    username={username}
                    documents={documents}
                    loading={loading} 
                    reloadDocuments={loadDocuments} 
                    selectedIndex={selectedIndex} 
                    setSelectedIndex={setSelectedIndex} 
                />) : (<Auth onLoginSuccess={handleLoginSuccess} />)}
            </BrowserRouter>
            </ErrorBoundary>
            
            <AppFooter />
        </>
    );
}

export default App;
