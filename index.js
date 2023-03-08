require('dotenv').config()
//conectando a la bd
require('./mongo')
const Note = require('./models/Note')


const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const express = require("express");
const app = express();
const logger = require('./loggerMiddleware')
const cors = require('cors');
const { request, response } = require('express');
const notFound = require('./middleware/notFount.js')
const handleError = require('./middleware/handleError.js')


app.use(cors())
app.use(logger)

app.use(express.json());
app.use('/images',express.static('images'))

let notes = [];

Sentry.init({
  dsn: "https://a2d3f09868c548568085ae9dac5f8dc5@o4504766454235136.ingest.sentry.io/4504766460919808",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
}); 
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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
  Note.findOneAndDelete(id).then(result=>{
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

app.use(Sentry.Handlers.errorHandler());
app.use(notFound)
app.use (handleError)

const PORT = process.env.PORT  || 3001;
app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`);
});
