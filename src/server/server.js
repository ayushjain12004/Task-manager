const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User"); // Import the User model

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors()); // Enable cross-origin requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ email, password: hashedPassword, name });
  await newUser.save();

  res.status(201).json({ success: true, message: "User registered successfully." });
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid credentials." });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ success: true, token });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
