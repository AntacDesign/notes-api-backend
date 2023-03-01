const {Schema,model} = require('mongoose')


//creando el esquema para la coleccion

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean
})

noteSchema.set('toJSON',{
    transform:(document, returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//modelo para la coleccion
const Note = model('Note', noteSchema)

module.exports = Note

//mostrando el esquema de notes
/* Note.find({})
.then(result=>{
    console.log(result)
    mongoose.connection.close()
}) */

/* const note = new Note({
    content: 'MongoDb es ingreible, Antac',
    date: new Date(),
    important: true
})


//guardando datos en la bd
note.save()
    .then(result=>{
        console.log(result)
        mongoose.connection.close()
    })
    .catch(
        err =>{
            console.log(err)
        }
    ) */