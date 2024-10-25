import { useState } from 'react'; 
import logo from './../../functions/logo.svg';
import utils from '../../utils.mjs';

interface AppHeaderProps {
    reloadDocuments: () => void;
    selectedIndex: number | null;
    username: string | null;
    password: string | null;
    token: string | null;
    handleClose: () => void;
    selectedDocumentId: string; 
    seeShared: () => void;
}

function AppHeader({ 
    selectedIndex, 
    handleClose, 
    selectedDocumentId, 
    username, 
    password, 
    token, 
    reloadDocuments,
    seeShared 
}: AppHeaderProps) {
    const [adress, setAdress]=useState('');

    const logOut = async () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('password');
        window.location.reload();

        // //chenge for token in cookies:
        // console.log("try to loggout")
        // await utils.processRoute('POST', '/auth/logout');
        // localStorage.clear();
        // window.location.reload(); 
    };
    const shareDoc = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            const result = await utils.processRoute("POST", "/data/share", 
                { username: username, docId:selectedDocumentId, adress:adress });
            if (result.status === 200) {
                console.log("result of shearing: ", result)
                console.log("selected doc: ", selectedDocumentId, "   ", selectedIndex)
                //selectedIndex = selectedIndex
                alert('Document is shared!');
            }
        } catch (error) {
            console.error('Failed to share document: ', error);
        }
    };

    const addDocument = async () => {
        try {
            const result = await utils.processRoute("POST", "/data", { username: username });
            if (result.status === 200) {
                alert('New document is created!');
                reloadDocuments();
            }
        } catch (error) {
            console.error('Failed to create document: ', error);
        }
    };

    const deleteDocument = async () => {
        try {
            const response = await utils.processRoute('DELETE', 
                `/data/delete/${selectedDocumentId}`,
                { username: username, password: password });

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
                            <button className="change-collection" onClick={addDocument}>
                                Create document
                            </button>
                            <button className="see-shared" onClick={seeShared}>
                                See shared dokument
                            </button>
                            <button className="change-collection" onClick={logOut}>
                                Logout
                            </button>
                        </>
                        ) : (
                        <>
                            <button className="change-collection" onClick={deleteDocument}>
                                Remove document
                            </button>
                            <form className='smalForm' onSubmit={shareDoc}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name='adress'
                                    placeholder="Email"
                                    value={adress}
                                    onChange={(e) => setAdress(e.target.value)}
                                    required
                                />
                            </div>
                                <button className="see-shared">
                                    share dokument
                                </button>
                            </form>
                            <button className="change-collection" onClick={logOut}>
                                Logout
                            </button>
                        </>
                        )}
                    </div>
                    
                </>
            )}
        </header>
    );
}

export default AppHeader;
