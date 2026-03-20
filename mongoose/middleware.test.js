import mongoose from "mongoose";


//to connect mongodb server and database
try {
    await mongoose.connect("mongodb://127.0.0.1/mongoose_middleware");
    //this debug hels to log query
    mongoose.set("debug",true)

} catch (error) {
    console.error(error);
    process.exit();
}





// create schema
const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type: String,required:true, unique:true},
    age:{type:Number,required:true,min:5},
    // createdAt:{type:Date,default:Date.now()},
    // updatedAt:{type:Date,default:Date.now()}
},{
    timestamps:true //to get created at and updatedat
})


//use middleware always before model
//we will use middleware["define all functions on which middleware should run"]
// userSchema.pre(["updateOne","updateMany"],function(next){
// this.set({updatedAt:Date.now()});
// next;
// });


//create model
const Users = mongoose.model("user",userSchema);

//insert data
// await Users.create({name:"nishant",age:20,email:"nishant@email.com"})




await Users.updateOne({email:"nishant@email.com"},{$set:{age:12}})

await mongoose.connection.close();