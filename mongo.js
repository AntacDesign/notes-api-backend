const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

//conexion a mongodb
mongoose.connect(connectionString,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=>{
        console.log('Database connected')
    })
    .catch(error=>{
        console.error(error)
    })
mongoose.set('strictQuery', false);