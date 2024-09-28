import React from 'react';
// import fucntion that fetch routes
import utils from '../../utils.mjs';

// Accept reloadDocuments as a prop
interface AppHeaderProps {
    reloadDocuments: () => void; // Prop type for the reload function
}

function AppHeader({ reloadDocuments }: AppHeaderProps) {

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

    return (
        <header>
            {/* <!-- Namechange?--> */}
            <h1>SSR Editor</h1>
           <div className="headers">
               <h2>Documents</h2>
               {/* Add button that create nes document */}
               <button className="create-new-doc button" onClick={addDocument}>
                   Create a new document
               </button>
           </div>
        </header>
        
    );
}

export default AppHeader;

