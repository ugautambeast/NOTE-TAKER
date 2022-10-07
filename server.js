const express = require('express');
const notes = require('./db/db.json')

const path = require('path');
const fs = require('fs');
const {v4: uuidv4 } = require('uuid');


const app = express();

const PORT = process.env.PORT || 3400;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get('/api/notes', (req,res) => {
     fs.readFile("./db/db.json", (err, db) => {
        if (err) throw err;
        db = JSON.parse(db)
        res.json(db);
    });
});


app.post('/api/notes', (req, res) => {
    // Read file first
    // Then you can db.push
    // Then write the larger array back to db
    // And then you optionally can res.json({"status":"success"})
    const currentNote = req.body;

    fs.readFile(path.join(__dirname, './db/db.json'), (error, notes) => {
        if(error) {
            return console.log(error)
        }
        notes = JSON.parse(notes)

        if (notes.length > 0) {
        let lastId = notes[notes.length - 1].id
        let id = parseInt(lastId) + 1
        } else {
            let id = 10;
        }

        let newNote = {
            title: currentNote.title,
            text: currentNote.text
        }

        const saveNewNote = notes.concat(newNote)
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(saveNewNote), (error, data) => {
            if (error) {
                return error
            } 
            console.log(saveNewNote)
            res.json(saveNewNote);
        })
    });
  
  });




app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));



app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT)
});