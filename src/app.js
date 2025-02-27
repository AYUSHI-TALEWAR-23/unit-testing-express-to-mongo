const express = require("express");
const mongoose = require("mongoose");
const logger = require("./config/logger"); 
const User = require("./models/userModel"); 
require("dotenv").config(); 

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello, Express Server is Running!");
});

// Creating a New User
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = new User({ name, email });
    await user.save();

    logger.info(`User Created: ${user._id}`);
    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error Creating User: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    logger.info("Fetched All Users");
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error Fetching Users: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a User by ID
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User Updated: ${user._id}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error Updating User: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app; 
