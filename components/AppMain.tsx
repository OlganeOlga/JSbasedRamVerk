import React, { useEffect } from 'react';
import AppArticle from './AppArticle';

function AppMain({ documents, loading, reloadDocuments }) { // Access documents and loading props

    // Load documents on component mount
    useEffect(() => {
        reloadDocuments(); // Call the passed-in function to load documents
    }, [reloadDocuments]);

    // Handle loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AppArticle documents={documents} reloadDocuments={reloadDocuments} />
        </>
    );
}

export default AppMain;
