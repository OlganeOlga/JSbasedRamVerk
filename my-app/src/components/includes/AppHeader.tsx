import React from 'react';
import logo from './../../functions/logo.svg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import utils from './../../utils.mjs';

// Accept reloadDocuments as a prop
interface AppHeaderProps {
    reloadDocuments: () => void; // Prop type for the reload function
    selectedIndex: number | null; // Accept selectedIndex prop
    handleClose: () => void;
    selectedDocumentId: string; 
}


function AppHeader({ selectedIndex, handleClose, selectedDocumentId, reloadDocuments }: AppHeaderProps) {

   //create new document
   const addDocument = async () => {
        try {
            const result = await utils.processRoute("POST");
            if (result.result.acknowledged){
                alert('New document is created!');
                reloadDocuments();
            }
        } catch (error) {
            return(error);
        }     
        
    };

    const delateDocument = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        try {
            await utils.processRoute('DELETE', `/delete/${selectedDocumentId}`); // Call the function with the URL and ID
            alert('Document deleted successfully!'); // show that document is deleted
            handleClose();
            reloadDocuments(); // remove selection on the document with index
        } catch (error) {
            console.error('Failed to delete document at DeleteDocument: ', error);
            alert('Failed to delete document.');
        };
    };

    return (
        <header className='header'>
            <img src={logo} className="App-logo" alt="logo" width=" 100" />
            {/* <!-- Namechange?--> */}
            <h1>SSR Documents Editor</h1>
           <div>
           {selectedIndex === null ? ( 
            // if no document is selected or invalid selection
               <button className="change-collection" value={'Add'} onClick={addDocument}>
                   Create document
               </button>) : ( // if a document is selected, render OneDocument component
              <button className="change-collection" value={'Remove'} onClick={delateDocument}>
                Remove document
                {/* <FontAwesomeIcon icon={faTrashCan} width={10}/> */}
            </button>)}
           </div>
        </header>
        
    );
}

export default AppHeader;