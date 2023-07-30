const data = require("./tableData.json");
const cors = require('cors');
const express = require('express');
const tableData = require('./tableData.json');

const app = express();
const port = 3005;

// Use the CORS middleware to allow requests from all origins
app.use(cors());
app.use(express.json());
// Endpoint to get all data
app.get('/api/items', (req, res) => {
    res.json(data);
});

app.put('/api/items/:id', (req, res) => {
    const { id, amount } = req.body;
    const itemIndex = tableData.findIndex(item => item.id === id);
    console.log(itemIndex);
    // modify json file/ database here
    tableData[itemIndex].amount = amount;
    // Send a response back to the client
    res.json({ id: id, amount: amount });
});

// Start the server
app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});
