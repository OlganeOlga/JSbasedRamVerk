import { useState } from 'react';
import utils from '../utils.mjs';

interface RegiterProps {
    onLoginSuccess: () => void;  // Callback function to notify App when login is successful
}

function Register({ onLoginSuccess }: RegiterProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try{
            alert("post your login")
            const docs = await utils.processRoute("", 'POST', "/auth/register", 
                { 
                    username: username, 
                    password: password 
                },
                );
            console.log (docs);
            localStorage.setItem("tocken", "mocl-tocken");
            localStorage.setItem("usename", username);
            localStorage.setItem("passwod", password);
            onLoginSuccess();  // Call callback to notify App of successful login
            alert("Login successful");
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
                <button type="submit">Sign Up</button>
            </form>
            <div className="terms">
                <h3>Terms and Conditions</h3>

                <p>Your email will be stored together with your personal API-key to be able to contact you if you violate the terms and conditions and/or send an extraordinary amount of requests to the API.</p>

                <p>You are responsible for any data that you store in the API's database and that the data does not violate current jurisdiction.</p>

                <p>You can at any time request that your API-key is deleted together with all of the data that you have stored in the API's database by using the <a href="/api_key/deregister">deregister form</a>.</p>
            </div>
        </>)};

export default Register;
