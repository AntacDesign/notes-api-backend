const {app} = require('../index')
const supertest = require('supertest')

const api = supertest(app)

const initialNotes=[
    {
        content : 'Aprendiendo FullStack Js con midudev',
        important:true,
        date: new Date()
    },
    {
        content : 'Sigueme en antac69 github',
        important:true,
        date: new Date()
    }
]

const getAllcontentFromNotes = async()=>{
    const response = await api.get('/api/notes')
    return {
        contents: response.body.map(note=>note.content),
        response
}
}

module.exports={
    api,
    initialNotes,
    getAllcontentFromNotes
}