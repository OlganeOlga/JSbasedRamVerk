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
            const docs = await utils.processRoute("olga@example.com", 'POST', "/auth/login", 
                { 
                    username: "olga@example.com", 
                    password: "olga@example.com" 
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
    );
}

export default Register;
