const mongoose = require('mongoose');


const mongoURL = "mongodb://localhost:27017/inotebook";
const connectToMongo = ()=>{
    mongoose.connect(mongoURL).then(()=>console.log("Connected")).catch((e)=>console.log(e.message));
}

module.exports = connectToMongo;