import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI
if(!MONGODB_URI){
    throw new Error("Error to get mongodb uri")
}
let cached = global.mongoose || {
  conn: null,
  promise: null,
};

if(!cached){
    cached = global.mongoose = {conn:null, promise:null}
}

const dbConnect = async() =>{
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI)
    }
    try {
        cached.conn = await cached.promise
    } catch (error) {
        console.log(error)
        throw error
    }
    console.log("DB connected successfully")
    return cached.conn
}

export {dbConnect}

