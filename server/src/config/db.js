import mongoose from "mongoose";

function dbConnect(){

    mongoose.connect("mongodb://127.0.0.1:27017/syncspaceDB")
    .then(()=>console.log("database connected"))
    .catch((e)=>console.log(e));
}

export default dbConnect;