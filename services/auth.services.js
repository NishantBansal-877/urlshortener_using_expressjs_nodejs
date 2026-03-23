import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { usersTable } from "../drizzle/schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const getUsersByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
};

export const createUser = async ({ name, email, password }) => {
  return await db
    .insert(usersTable)
    .values({ name, email, password })
    .$returningId();
};

export const hashedPassword = async (password) => {
  return await argon2.hash(password);
};

export const comparePassword = async (hash, password) => {
  return await argon2.verify(hash, password);
};

export const generateToken = ({ id, name, email }) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
