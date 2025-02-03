const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // Ensure email is unique
    lowercase: true,  // Convert email to lowercase before saving
  },
  password: {
    type: String,
    required: true,
  },
  // Optionally, you can add more fields like username, name, etc.
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // This will add createdAt and updatedAt fields
});

// Create a model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
