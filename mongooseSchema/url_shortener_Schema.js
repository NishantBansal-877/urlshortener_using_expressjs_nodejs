import mongoose from "mongoose"

export const url_shortener_Schema = mongoose.Schema({
    url:{type:String,required:true},
    shortCode:{type:String,required:true,unique:true}
})
