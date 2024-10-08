// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes'); // Import routes

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://jayantshelke4829:X28OghFzxnZfiX3o@foody.50gxu.mongodb.net/?retryWrites=true&w=majority&appName=Foody', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use cart routes
app.use(cartRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
