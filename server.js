// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Allows the use of style.css and index.js
app.use(express.static(__dirname + '/public'));

// --FUNCTIONS--
// read from database
function readDb(callback) {
    const dbName = '/db/db.json';
    const filePath = path.join(__dirname, dbName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return;
        }
        const dataAsJson = JSON.parse(data);

        callback(dataAsJson);
    })
}

// edit database
function editDb(callback) {
    const dbName = '/db/db.json';
    const filePath = path.join(__dirname, dbName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return;
        }
        const dataAsJson = JSON.parse(data);

        const editedData = callback(dataAsJson);
        fs.writeFile(filePath, JSON.stringify(editedData), () => {
        });
    })
};


// --ROUTES--
// Index
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// Notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// --GET--
// Displays all notes
app.get("/api/notes", (req, res) => {
    readDb((data) => {
        res.json(data);
    })
});

// --POST--
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    // Using a RegEx Pattern to remove spaces from newCharacter
    newNote.title = newNote.title.replace(/\s+/g, "").toLowerCase();
    editDb((data) => {
        data.push(newNote);
        res.json(data);
        return data;
    });
});

// --DELETE--
app.delete("/api/notes/:id", (req, res) => {
    noteId = req.params['id'];
    editDb((data) => {
        data.splice(noteId,1);
        for(let i = 0;i < data.length;i++) {
            data[i].id = i;
        }
        res.json(data);
        return data;
    });
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
});