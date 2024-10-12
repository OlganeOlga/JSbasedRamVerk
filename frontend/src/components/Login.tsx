import { useState } from 'react';
import Register from './Register';
import utils from '../utils.mjs';

interface LoginProps {
    onLoginSuccess: () => void;  // Callback function to notify App when login is successful
}

function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            alert("post your login")
            const docs = await utils.processRoute("olga@example.com", 'POST', "/auth/login", 
                { 
                    username: "olga@example.com", 
                    password: "olga@example.com" 
                }
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
    }


    return (
        <div className="loginform">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="name"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            <Register onLoginSuccess={onLoginSuccess} />
        </div>
    );
};

export default Login;
