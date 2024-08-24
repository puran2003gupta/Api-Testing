const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to extract numbers from strings
function extractNumbersFromStrings(array) {
    return array.map(obj => {
        const newObj = {};
        for (const key in obj) {
            const value = obj[key];
            newObj[key] = typeof value === 'string' ? value.match(/\d+/g) : value;
        }
        return newObj;
    });
}

// Route to handle file upload and processing
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        
        // Assuming the file contains a JSON array of objects
        const jsonArray = JSON.parse(data);

        const result = extractNumbersFromStrings(jsonArray);
        res.json({ message: 'Numbers extracted', result });
        
        // Optional: Remove the file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    });
});

// Add a basic route to the root path
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use POST /upload to upload a file.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
