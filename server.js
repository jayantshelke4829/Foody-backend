const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes'); 
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// Allow CORS from specific origin or all origins
app.use(cors({
  origin: ['http://localhost:5173', 'https://foody-backend-kjpp.onrender.com'],  // Add the origin of your frontend app
  credentials: true // If your app requires credentials like cookies, tokens
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use cart routes
app.use('/api', cartRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
