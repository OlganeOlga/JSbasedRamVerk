import React from 'react';
import logo from './../../functions/logo.svg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import utils from '../../utils.mjs';

// Accept reloadDocuments as a prop
interface AppHeaderProps {
    reloadDocuments: () => void; // Prop type for the reload function
    selectedIndex: number | null; // Accept selectedIndex prop
    handleClose: () => void;
    selectedDocumentId: string; 
}


function AppHeader({ selectedIndex, handleClose, selectedDocumentId, reloadDocuments }: AppHeaderProps) {
    let username = localStorage.getItem("username");
    if (localStorage.getItem("username") === null)
    {
        username = 'olga@example.com';
    }
   //create new document
   const addDocument = async () => {
        try {   
            const result = await utils.processRoute(username, "POST", "/data", {username: username, password: 'olga@example.com'});
            if (result.status === 200){
                alert('New document is created!');
                reloadDocuments();
            }
        } catch (error) {
            return(error);
        }
    };

    const deleteDocument = async () => { 
        try {
            const respons = await utils.processRoute(username, 'DELETE', 
                `/data/delete/${selectedDocumentId}`,
                {username: username, password: 'olga@example.com'});

            // Call the function with the URL and ID
            if(respons.status === 200){
                alert('Document deleted successfully!'); 
                // show that document is deleted
                handleClose();
                reloadDocuments();
            } else {
                alert("Faile to delate document");
            }
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
              <button className="change-collection" value={'Remove'} onClick={deleteDocument}>
                Remove document
                {/* <FontAwesomeIcon icon={faTrashCan} width={10}/> */}
            </button>)}
           </div>
        </header>
        
    );
}

export default AppHeader;