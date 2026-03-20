import mongoose from "mongoose";


//to connect mongodb server and database
try {
    await mongoose.connect("mongodb://127.0.0.1/mongoose_database");
    //this debug hels to log query
    mongoose.set("debug",true)

} catch (error) {
    console.error(error);
    process.exit();
}

//create schema
const userSchema = mongoose.Schema({
    // name: String,
    name:{type:String,required:true},
    email:{type: String,required:true, unique:true},
    age:{type:Number,required:true,min:5},
    createdAt:{type:Date,default:Date.now()}
})

//create model (collection name in singular and it will store in plural here :users ,collection schema)
const Users = mongoose.model("user",userSchema);

await Users.create({name:"nishant",age:20,email:"nishant@email.com"})

await mongoose.connection.close();