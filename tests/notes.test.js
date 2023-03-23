const { mongoose } = require('mongoose')
const {server} = require('../index')
const Note = require('../models/Note')
const {api,initialNotes,getAllcontentFromNotes}=require('./helpers')

beforeEach(async ()=>{
    await Note.deleteMany({})

    const note1= new Note(initialNotes[0])
    await note1.save()

    const note2= new Note(initialNotes[1])
    await note2.save()
})

test ('notes are returned as json', async()=>{
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two notes', async()=>{
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
})

test('the first notes is about midudev', async() =>{
    const {contents,response}= await getAllcontentFromNotes()
    expect(contents).toContain('Aprendiendo FullStack Js con midudev')
})

test('a valid note can be added', async()=>{
    const newNote = {
        content: 'Proximamente asycn/await',
        important:true
    }

    await api  
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type',/application\/json/)

    const {contents,response}= await getAllcontentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
})

test('note without content is not added', async()=>{
    const newNote = {
        important:true
    }

    await api  
        .post('/api/notes')
        .send(newNote)
        .expect(400)
        .expect('Content-Type',/application\/json/)

    const {response}= await getAllcontentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async()=>{
    const {response} = getAllcontentFromNotes()
    const {body:notes} = response
    const noteToDelete=note[0]
    await api.delete(`api/notes/${noteToDelete.id}`)
})

afterAll(()=>{
    mongoose.connection.close()
    server.close()
})