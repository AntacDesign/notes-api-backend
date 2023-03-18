const mongoose = require('mongoose')

const {MONGO_DB_URI,MONGO_DB_URI_TEST,NODE_ENV} = process.env

const connectionString = NODE_ENV === 'test' 
? MONGO_DB_URI_TEST
: MONGO_DB_URI

mongoose.set('strictQuery', true);

//conexion a mongodb
mongoose.connect(connectionString)
    .then(()=>{
        console.log('Database connected')
    })
    .catch(error=>{
        console.error(error)
    })
mongoose.set('strictQuery', false);
process.on('uncaughtException',()=>{
    mongoose.connection.disconnect()
})
