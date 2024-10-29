import { useState } from 'react'; 
import logo from './../../functions/logo.svg';
import utils from '../../utils.mjs';
import ButtonConteiner from './ButtonConteiner';
import { json } from 'stream/consumers';

interface AppHeaderProps {
    reloadDocuments: () => void;
    selectedIndex: number | null;
    username: string | null;
    token: string | null;
    handleClose: () => void;
    selectedDocumentId: string;
}

function AppHeader({
    selectedIndex, 
    handleClose, 
    selectedDocumentId, 
    username, 
    token, 
    reloadDocuments,
}: AppHeaderProps) {
    const [adress, setAdress]=useState('');

    const logOut = async () => {
        sessionStorage.clear()
        window.location.reload();
    };
    const shareDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = JSON.stringify({query:
            `mutation {shareDoc (owner:"${username}", 
                               adress:"${adress}", 
                               docid:"${selectedDocumentId}")}`
       });
        try {
            // const result = await utils.processRoute("POST", "/data/share", 
            //     { username: username, docId:selectedDocumentId, adress:adress });
            //USER GRAPHQL
                 const result = await utils.graphQL(body, token);
            if (result.status === 200) {
                alert('Document is shared!')
            }
        } catch (error) {
            console.error('Failed to share document: ', error);
        }
    };

    const addDocument = async () => {
        const body = JSON.stringify({query:
            `mutation {addDoc (username:"${username}")}`
       });
        try {
            // const result = await utils.processRoute("POST", "/data", { username: username });

            //USE GRAPHQL
            const result = await utils.graphQL(body, token);
            if (result.status === 200) {
                alert('New document is created!');
                reloadDocuments();
            }
        } catch (error) {
            console.error('Failed to create document: ', error);
        }
    };

    const deleteDocument = async () => {
        const body = JSON.stringify({query:`mutation{deleteDoc(username:"${username}",id: "${selectedDocumentId}")}`});
        try {
            //const response = await utils.processRoute('DELETE', 
                // `/data/delete/${selectedDocumentId}`,
                // { username: username, password: password });

            //USE GRAPHQL
            const response = await utils.graphQL(body, token)
            console.log(response)
            if (response.status === 200) {
                alert('Document deleted successfully!');
                handleClose();
                reloadDocuments();
            } else {
                alert("Failed to delete document.");
            }
        } catch (error) {
            console.error('Failed to delete document: ', error);
        }
    };

    return (
        <header className="header">
            <img src={logo} className="App-logo" alt="logo" width="100" />
            <h1>SSR Documents Editor</h1>

            {/* Conditionally render "Create Document" and "Logout" buttons based on login status */}
            {token && (
                <>
                    <div>
                        {selectedIndex === null ? (
                        <>
                            <ButtonConteiner
                            buttonType='button'
                            buttonName='change-collection'
                            buttonText='Create document'
                            buttonFunction={addDocument}
                             />
                            {sessionStorage.getItem("docType") === "shared/" ? 
                            (<ButtonConteiner
                            buttonType='button'
                            buttonName='see-shared'
                            buttonText="See users's dokuments"
                            buttonFunction={() => {
                                                        sessionStorage.setItem("docType", "");
                                                        reloadDocuments();
                                                    }}
                             />) :
                             (<ButtonConteiner
                                buttonType='button'
                                buttonName='see-shared'
                                buttonText="See shared documents"
                                buttonFunction={() => {
                                                        sessionStorage.setItem("docType", "shared/");
                                                        reloadDocuments();
                                                    }}
                                 />)
                            }
                            <ButtonConteiner
                            buttonType='button'
                            buttonName='change-collection'
                            buttonText='Logout'
                            buttonFunction={logOut}
                             />
                        </>
                        ) : (
                        <>
                        {sessionStorage.getItem("docType") === null || sessionStorage.getItem("docType") === "" ? (
                            <form className='shareForm' onSubmit={shareDoc}>
                                <div className="input-group">
                                    <label className="share"> 
                                        With whom will you share your document?
                                        <input
                                            type="email"
                                            name='adress'
                                            placeholder="write email"
                                            value={adress}
                                            onChange={(e) => setAdress(e.target.value)}
                                            required
                                        />
                                    </label>
                                </div>
                                <ButtonConteiner
                                    buttonType='submit'
                                    buttonName='see-shared'
                                    buttonText='Share document'
                                    buttonFunction={() => console.log("Button clicked")}
                                />
                            </form>
                        ) : null}
                        {sessionStorage.getItem("docType") === null || sessionStorage.getItem("docType") === "" ? (
                            <ButtonConteiner
                                buttonType='button'
                                buttonName='change-collection'
                                buttonText='Remove document'
                                buttonFunction={deleteDocument}
                                />) : null}
                            <ButtonConteiner
                                buttonType='button'
                                buttonName='change-collection'
                                buttonText='Logout'
                                buttonFunction={logOut}
                                />
                        </>
                        )}
                    </div>
                    
                </>
            )}
        </header>
    );
}

export default AppHeader;