import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//import userSchema from './../db/mongo/db_schema.json' assert { type: 'json' };
//import userSchema from './../db/mongo/db_schema.json' assert { type: 'json' };
import docs from '../docs/remoteDocs.mjs';

// // Define your User schema (mongoose)
// const UserSchema = new mongoose.Schema(userSchema);
// const User = mongoose.model('User', UserSchema);

// JWT secret key (use dotenv to store the secret key)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log (username, " ", password)
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        //const user = new User({ username, password: hashedPassword });
        const user = { username, password};
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        console.log(username)
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });
        console.log(username)
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });
        if (user.password !== password) {
            console.log(user.password)
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        console.log(token)
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
