const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api call response for the notes, an having results sent to browser in the form of an array of object
app.get("/api/notes", (err, res) => {
    try {
      createNoteData = fs.readFileSync("db/db.json", "utf8");
      console.log(`Hello from Port ${PORT}!`);
      createNoteData = JSON.parse(createNoteData);
    } catch (err) {
      console.log("\n error (catch err app.get):");
      console.log(err);
    }
    res.json(createNoteData);
  });
  
  // this section writes the new note to the json file and sending back to the browser
  app.post("/api/notes", (req, res) => {
    try {
      createNoteData = fs.readFileSync("./db/db.json", "utf8");
      console.log(createNoteData);
      createNoteData = JSON.parse(createNoteData);
      req.body.id = createNoteData.length;
      createNoteData.push(req.body);
      createNoteData = JSON.stringify(createNoteData);
      fs.writeFile("./db/db.json", createNoteData, "utf8", (err) => {
        if (err) throw err;
      });
  
      res.json(JSON.parse(createNoteData));
    } catch (err) {
      throw err;
      console.error(err);
    }
  });
  
  // Deleting a note and reading the json file | writing the new notes to the file and sending back to the browser
  
  app.delete("/api/notes/:id", (req, res) => {
    try {
      createNoteData = fs.readFileSync("./db/db.json", "utf8");
      createNoteData = JSON.parse(createNoteData);
      createNoteData = createNoteData.filter((note) => {
        return note.id != req.params.id;
      });
      createNoteData = JSON.stringify(createNoteData);
  
      fs.writeFile("./db/db.json", createNoteData, "utf8", (err) => {
        if (err) throw err;
      });
  
      res.send(JSON.parse(createNoteData));
    } catch (err) {
      throw err;
      console.log(err);
    }
  });
  
  // HTML GET Requests
  
  // when the Get started button is clicked display the note.html Web page
  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });
  
  // If no matching route is found, then default to home
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
  });
  
  app.get("/api/notes", (req, res) => {
    return res.sendFile(path.json(__dirname, "db/db.json"));
  });
  
  // Start the server on the port
  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });