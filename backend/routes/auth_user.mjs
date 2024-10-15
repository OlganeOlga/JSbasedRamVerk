import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userFunctions from '../docs/mongoUsers.mjs'

// Define your User schema (mongoose)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// JWT secret key (use dotenv to store the secret key)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    try {
        const user = new User({ username, password: hashedPassword });
        await userFunctions.saveUser(user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User login route
router.post('/login', async (req, res) => {
    console.log("start login at auth/login")
    const { username, password } = req.body;
    console.log(req.body)
    try {
        console.log("start fetching user")
        const user = await userFunctions.getUser(username);
        console.log("after fetching user")
        console.log(user)
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });

        //const isMatch = await bcrypt.compare(password, user.password);
        //if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        if (password === user.password) return res.status(400).json({ message: 'Invalid username or password' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error });
    }
});

// Middleware to protect routes
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

export default router;