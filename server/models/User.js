const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        enum: ['manager', 'tenant'],
        default: 'tenant'
    },
    password: {
        type: String,
        required: true // Make password a required field
    },
    manager: {
        type: String,
        required: function() {
            return this.userType === 'tenant'; // Manager field is required only for tenant users
        }
    }
});

module.exports = mongoose.model('User', userSchema);
