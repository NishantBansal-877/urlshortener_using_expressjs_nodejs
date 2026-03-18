
import express from "express";
import router from "./routes/shortener.route.js";


const app = express();

const PORT = process.env.PORT || 3000;



app.use(express.static("public"));

// setting template engine
app.set("view engine","ejs");
// setting views folder
// by default it sets to views
app.set("views","./views");


app.use(router)



app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})