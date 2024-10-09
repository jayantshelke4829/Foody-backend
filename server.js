// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes'); 
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000; // Fallback to 5000 if PORT is undefined

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use cart routes
app.use('/api', cartRoutes);  // Prefix routes with /api

app.post('/api/save-cart', (req, res) => { // Add save-cart route here
  const { cart } = req.body;

  try {
    // Save cart logic (e.g., store cart to MongoDB)
    res.status(200).json({ message: 'Cart saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
