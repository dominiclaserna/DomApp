// laserna/server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to fetch user details by email
router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // If user found, send user details in the response
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
