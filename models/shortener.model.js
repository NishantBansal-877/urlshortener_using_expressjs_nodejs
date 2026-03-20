

// import { URL } from "../config/mongoose-client.js";
// import { env } from "../config/env.js";
import { db } from "../config/mysql-client.js";

export const loadLinks = async()=>{
    // return await URL.find();
    const [rows] = await db.execute(
        "select short_code, url from short_links"
    );
    return rows;
}

export const saveLinks = async(link)=>{
    // return URL.insertOne(link);
   const result =  await db.execute(`insert into short_links(short_code, url) values (? , ?) `,[link.shortCode,link.url]);
   return result;
}

export const getLinkByShortCode = async(shortCode)=>{
// return await URL.findOne({shortCode:shortCode});

 const [rows] = await db.execute("select * from short_links where short_code = ?",[shortCode]);

 if(rows.length>0){
     return rows;
 }
 else{
    return null;
 }
}

export const checkLinks = async(shortCode)=>{
    console.log("called");
    const [rows] = await db.execute("select * from short_links where short_code = ?",[shortCode]);
    if(rows.length>0){
        return true;
    }
    else{
       return false;
    }
}