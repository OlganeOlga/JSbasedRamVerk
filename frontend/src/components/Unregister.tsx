import { useState } from 'react';
import utils from '../utils.mjs';

// interface RegiterProps {
//     onLoginSuccess: () => void;  // Callback function to notify App when login is successful
// }

function Unregister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try{
            alert("post your login")
            const respons = await utils.processRoute('DELETE', "/auth/unregister", 
                { 
                    username: username, 
                    password: password 
                },
                );

            if (respons.status === 201) {
                localStorage.remove("tocken");
                localStorage.remove("usename");
                localStorage.remove("passwod");
            }
            alert(respons.result.message);
        } catch (e) {
            alert("Login failed");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>New user? Sign</h2>
                <input 
                    type="email" 
                    placeholder="email" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <button type="submit">Stop registration</button>
            </form>
        </>)};

export default Unregister;
