const data = require("./tableData.json");
const cors = require('cors');
const express = require('express');
const tableData = require('./tableData.json');

const fs = require('fs').promises;




const app = express();
const port = 3005;

// Use the CORS middleware to allow requests from all origins
app.use(cors());
app.use(express.json());
// Endpoint to get all data
app.get('/api/items', (req, res) => {
    res.json(data);
});

app.put('/api/items/edit', async (req, res) => {
    // console.log(req.body);

    try {
        const { list } = req.body
        console.log("list" + list);
        let i = 0;
        while (i < list.length) {
            const { id, amount } = list[i];
            const itemIndex = tableData.findIndex(item => item.id === id);

            if (itemIndex === -1) {
                return res.status(404).json({ error: 'Item not found.' });
            }

            // Modify the "amount" attribute in the array
            tableData[itemIndex].amount = amount;

            // Write the updated data back to the file (tabledata.json)
            await fs.writeFile('tabledata.json', JSON.stringify(tableData, null, 2), 'utf8');


            i++;
        }
        // Send a response back to the client
        res.json({ list: list });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});
