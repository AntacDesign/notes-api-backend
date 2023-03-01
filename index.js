require('dotenv').config()
//conectando a la bd
require('./mongo')
const Note = require('./models/Note')

const express = require("express");
const app = express();
const logger = require('./loggerMiddleware')
const cors = require('cors');
const { request, response } = require('express');
const notFound = request('./middleware/notFount.js')
const handleError = request('./middleware/handleError.js')


app.use(cors())
app.use(logger)

app.use(express.json());

let notes = [];

app.get("/", (request, response) => {
  response.send("<h1>Hello Wolrd</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes=>{
    response.json(notes);
  })
});

app.get("/api/notes/:id", (request, response,next) => {
  const { id } = request.params;
  
  Note.findById(id).then(note=>{
    if (note) {
      return response.status(200).json(note);
    } else {
      response.status(404).end();
    }
  }).catch(err=>{
    next(err)
  })

});

app.delete("/api/notes/:id", (request, response,next) => {
  const {id} = request.params
  Note.findOneAndRemove(id).then(result=>{
    response.status(204).end();
  }).catch(err=>next(err))
  response.status(204).end();
});

app.put("/api/notes/:id", (request, response,next) => {
  const {id} = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id,newNoteInfo,{new:true})
    .then((result =>{
      response.status(200).json(result).end()
    }))
});

/* crear post */
app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  } )

  //guardando nota
  newNote.save().then(savedNote=>{
    response.status(200).json(savedNote)
  })
});

app.use(notFound)

app.use (handleError)
const PORT = process.env.PORT  || 3001;
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
