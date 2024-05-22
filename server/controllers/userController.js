// laserna/server/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { firstName, lastName, email, userType, password, manager } = req.body; // Include manager in the destructuring
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        let userData = { firstName, lastName, email, userType, password: hashedPassword };
        // Include manager field only if userType is tenant
        if (userType === 'tenant') {
            userData.manager = manager;
        }
        const user = new User(userData);
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ email });
        console.log('User:', user); // Add this console log to check the user retrieved from the database
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Verify the password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // If login is successful, include user data in the response
        const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType
            // Include any other user data you need
        };
        console.log('Login successful for user:', email);
        console.log('User data:', userData); // Add this console log to check the user data being sent in the response
        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const userEmail = req.params.email; // Get the email from the request parameters
        const user = await User.findOne({ email: userEmail }); // Query the database for the user with the provided email
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return user details in the response
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType
            // Add more user details as needed
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserDetailsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};