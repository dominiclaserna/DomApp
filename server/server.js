// Import necessary modules
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const MONGODB_URI="mongodb+srv://luisdominiclaserna:bGKxeCZ2ghpi8BZ4@cluster0.tuqvzxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_URI1="mongodb://localhost:27017"
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define user routes
const userController = require('./controllers/userController');
app.post('/signup', userController.signup);

// Define create bill route
const billController = require('./controllers/billController');
app.post('/create-bill', billController.createBill);

// Define route to update bill paid status
app.patch('/bills/:billId', billController.updateBillPaidStatus);

// Define bill routes
const billRoutes = require('./routes/billRoutes'); // Import billRoutes
app.use('/bills', billRoutes); // Mount billRoutes at /bills path

// Define login route
const authController = require('./controllers/authController');
app.post('/login', authController.login);

// Define user details route
const userDetailsRoutes = require('./routes/userRoutes');
app.use('/user-details', userDetailsRoutes);

// Define message routes
const messageRoutes = require('./routes/messageRoutes');
app.use('/messages', messageRoutes);

const announcementRoutes = require('./routes/announcementRoutes'); // Import announcementRoutes
app.use('/announcements', announcementRoutes); // Mount announcementRoutes at /announcements path

// Define notification routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/notifications', notificationRoutes); // Mount notificationRoutes at /notifications path

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
