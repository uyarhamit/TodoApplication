const mongoose = require("mongoose");

module.exports = () =>{
    mongoose.connect("mongodb+srv://uyarhamit:Hu5462547730@cluster0.5c70f.mongodb.net/todoapp?authSource=admin&replicaSet=atlas-yotwq2-shard-0&readPreference=primary&ssl=true");

    mongoose.connection.on('open',()=>{
        console.log('MongoDb connected');
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDb Error', err);
    })

    mongoose.Promise = global.Promise;

}