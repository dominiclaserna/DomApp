// Import necessary modules
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Update with your frontend URL
  optionsSuccessStatus: 200
}));

// Connect to MongoDB
const MONGODB_URI = ”mongodb+srv://luisdominiclaserna:bGKxeCZ2ghpi8BZ4@cluster0.tuqvzxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0”;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define user routes
const userController = require('./controllers/userController');
app.post('/signup', userController.signup);

// Define create bill route
const billController = require('./controllers/billController');
app.post('/create-bill', billController.createBill);
app.patch('/bills/:billId', billController.updateBillPaidStatus);

// Define bill routes
const billRoutes = require('./routes/billRoutes');
app.use('/bills', billRoutes);

// Define login route
const authController = require('./controllers/authController');
app.post('/login', authController.login);

// Define user details route
const userDetailsRoutes = require('./routes/userRoutes');
app.use('/user-details', userDetailsRoutes);

// Define message routes
const messageRoutes = require('./routes/messageRoutes');
app.use('/messages', messageRoutes);

// Define announcement routes
const announcementRoutes = require('./routes/announcementRoutes');
app.use('/announcements', announcementRoutes);

// Define notification routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/notifications', notificationRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
