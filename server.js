// Required imports
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET routes for navigating the webpage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

// GET route for api database
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', function (err, data) {
    let json = JSON.parse(data);
    res.json(json)
    });
});

// POST route to add new notes to database
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
      const newNote = {
        title,
        text,
        id : uuidv4()
      };

      fs.readFile('./db/db.json', function (err, data) {
        let json = JSON.parse(data);
        json.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(json, null, "\t"), function (err) {
          if (err) throw err;
          console.log("Note saved successfully!");
        });
      });

      const response = {
        status: 'success',
        body: newNote
        };

      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note')
    }
});

// DELETE route to get rid of any notes
app.delete('/api/notes/:id', (req, res) => {
    const noteID = req.params.id;
    console.log(noteID);

    fs.readFile('./db/db.json', function (err, data) {
      let json = JSON.parse(data);
      console.log(json);
      for (let i = 0; i < json.length; i++) {
        if (json[i].id == noteID) {
          json.splice(i, 1);
        }
      }
      
      fs.writeFile('./db/db.json', JSON.stringify(json, null, "\t"), function (err) {
        if (err) throw err;
        console.log("Note deleted successfully");
      });
    });
    res.json();
});

app.listen(PORT, () => {
  console.log(`Note taker app listening at http://localhost:${PORT}`);
});