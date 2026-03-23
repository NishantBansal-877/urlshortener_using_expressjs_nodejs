// import "dotenv/config";

// import { PrismaClient } from "../generated/prisma/client.ts";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { shortLinksTable } from "../drizzle/schema.js";

// const adapter = new PrismaMariaDb({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     port: process.env.DATABASE_PORT,
// });

// const prisma = new PrismaClient({ adapter });

// export const loadLinks = async ()=>{
//     const allShortLinks = await prisma.shortLink.findMany();
//     return allShortLinks;
// }

export const getAllShortLinks = async (userId) => {
  const shortLinks = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, userId));

  //   const [{ totalCount }] = await db
  //     .select({ totalCount: count() })
  //     .from(shortLinksTable)
  //     .where(condition);

  return shortLinks;
};

// export const getLinkByShortCode = async (shortCode)=>{
//   const shortLink = await prisma.shortLink.findUnique({
//     where:{shortCode : shortCode}
//   })
//   return shortLink;
// }

export const getShortLinkByShortCode = async (shortCode) => {
  const [result] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.shortCode, shortCode));
  return result;
};

// export const saveLinks=async ({url, shortCode})=>{
//     const newShortLink = await prisma.shortLink.create({
//         data:{
//             shortCode,url
//         }
//     })
//     return newShortLink;
// }

export const insertShortLink = async ({ url, shortCode, userId }) => {
  const result = await db
    .insert(shortLinksTable)
    .values({ url, shortCode, userId });
};

// export const checkLinks = async(shortCode)=>{

//     const links = await prisma.shortLink.findUnique({
//         where:{shortCode:shortCode}
//     })

//     if(links){
//         return true;
//     }
//     else{
//        return false;
//     }
// }

export const checkLinks = async (shortCode) => {
  const link = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.shortCode, shortCode));
  if (link.length > 0) {
    return true;
  } else {
    return false;
  }
};

// // findShortLinkById
// export const findShortLinkById = async (id) => {
//   const [result] = await db
//     .select()
//     .from(shortLinksTable)
//     .where(eq(shortLinksTable.id, id));
//   return result;
// };

// updateShortCode
export const updateShortCodeLink = async ({ id, url, shortCode }) => {
  return await db
    .update(shortLinksTable)
    .set({ url, shortCode })
    .where(eq(shortLinksTable.id, id));
};

// /deleteShortCodeById
export const deleteShortCodeById = async (id) => {
  return await db.delete(shortLinksTable).where(eq(shortLinksTable.id, id));
};

export const findShortLinkById = async (id) => {
  const [result] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.id, id));
  return result;
};
