
import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";




const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
});

const prisma = new PrismaClient({ adapter });


export const loadLinks = async ()=>{
    const allShortLinks = await prisma.shortLink.findMany();
    return allShortLinks;
}


export const getLinkByShortCode = async (shortCode)=>{
  const shortLink = await prisma.shortLink.findUnique({
    where:{shortCode : shortCode}
  })
  return shortLink;
}

export const saveLinks=async ({url, shortCode})=>{
    const newShortLink = await prisma.shortLink.create({
        data:{
            shortCode,url
        }
    })
    return newShortLink;
}

export const checkLinks = async(shortCode)=>{
  
    const links = await prisma.shortLink.findUnique({
        where:{shortCode:shortCode}
    })

    if(links){
        return true;
    }
    else{
       return false;
    }
}