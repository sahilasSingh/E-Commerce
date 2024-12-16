const mongoose = require('mongoose');
const conn = process.env.DB_URL;

mongoose.set('strictQuery',true);

mongoose.connect(conn)
.then(() => {
   console.log('Database connected'); 
})
.catch((err) => {
    console.log(`Error connecting to database. /n ${err}`);   
})