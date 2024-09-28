//
import React, { useState } from 'react';
import AppFooter from "../components/includes/AppFooter";
import AppHeader from "../components/includes/AppHeader";
import AppMain from "../components/AppMain";
import ErrorBoundary from '../components/includes/ErrorBoundary';
import utils from '../utils.mjs';

function App() {
    const [documents, setDocuments] = useState([]); // Initialize state for documents
    const [loading, setLoading] = useState(true); // Initialize loading state
    
    return <>
            <ErrorBoundary>
                <AppHeader reloadDocuments={() => utils.loadDocuments(setDocuments, setLoading)} />
            </ErrorBoundary>
            <ErrorBoundary>
              <AppMain documents={documents} reloadDocuments={() => utils.loadDocuments(setDocuments, setLoading)} />
            </ErrorBoundary>
            <AppFooter />
        </>
}

export default App;