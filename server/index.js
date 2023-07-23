const data = require("./tableData.json");
const cors = require('cors');
const express = require('express');

const app = express();
const port = 3005;

// Use the CORS middleware to allow requests from all origins
app.use(cors());

// Endpoint to get all data
app.get('/api/items', (req, res) => {
    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});
