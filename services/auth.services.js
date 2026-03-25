import {
  ACCESS_TOKEN_EXPIRY,
  MILLISECONDS_PER_SECOND,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constants.js";
import fs from "fs/promises";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "../config/db.js";
import {
  sessionsTable,
  shortLinksTable,
  usersTable,
  verifyEmailTokensTable,
} from "../drizzle/schema.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import { sendEmail } from "../lib/resend-email.js";
import path from "path/posix";
import mjml2html from "mjml";
import ejs from "ejs";

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

// export const generateToken = ({ id, name, email }) => {
//   return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

export const createSession = async (userId, { ip, userAgent }) => {
  const [session] = await db
    .insert(sessionsTable)
    .values({ userId, ip, userAgent })
    .$returningId();
  return session;
};

export const createAccessToken = ({ id, name, email, sessionId }) => {
  return jwt.sign({ id, name, email, sessionId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND, //15min
  });
};
export const createRefreshToken = (sessionId) => {
  return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND, //15min
  });
};

export const verifyJwtToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const findSessionById = async (sessionId) => {
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));
  return session;
};

export const findUserById = async (userId) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return user;
};

export const refreshTokens = async (refreshToken) => {
  try {
    const decodedToken = verifyJwtToken(refreshToken);

    const currentSession = await findSessionById(decodedToken.sessionId);

    if (!currentSession || !currentSession.valid) {
      throw new Error("Invalid session");
    }

    const user = await findUserById(currentSession.userId);

    if (!user) throw new Error("Invalid User");

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      sessionId: currentSession.id,
    };

    const newAccessToken = createAccessToken(userInfo);

    const newRefreshToken = createRefreshToken(currentSession.id);

    return {
      newAccessToken,
      newRefreshToken,
      user: userInfo,
    };
  } catch (error) {
    console.log(error.message);
  }
};

export const clearSession = async (sessionId) => {
  return db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
};

export const authenticateUser = async ({ req, res, user, name, email }) => {
  const session = await createSession(user.id, {
    ip: req.clientIp,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = createAccessToken({
    id: user.id,
    name: user.name || name,
    email: user.email || email,
    isEmailValid: false,
    sessionId: session.id,
  });
  const refreshToken = createRefreshToken(session.id);

  const baseConfig = { httoOnly: true, secure: true };

  res.cookie("access_token", accessToken, {
    ...baseConfig,
    maxAge: ACCESS_TOKEN_EXPIRY,
  });
  res.cookie("refresh_token", refreshToken, {
    ...baseConfig,
    maxAge: REFRESH_TOKEN_EXPIRY,
  });
};

export const getAllShortLinks = async (userId) => {
  return await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.userId, userId));
};

export const generateRandomToken = (digit = 8) => {
  const min = 10 ** (digit - 1); //10000000
  const max = 10 ** digit; //100000000

  return crypto.randomInt(min, max).toString();
};

export const inserVerifyEmailToken = async ({ userId, token }) => {
  console.log("userd", userId);
  return db.transaction(async (tx) => {
    //tx=transaction shortform
    try {
      await tx
        .delete(verifyEmailTokensTable)
        .where(lt(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`));
      await tx
        .delete(verifyEmailTokensTable)
        .where(eq(verifyEmailTokensTable.userId, userId));
      return await tx.insert(verifyEmailTokensTable).values({ userId, token });
    } catch (error) {
      console.error("Failed to insert verification token:", error.message);
      throw new Error("Unable to create verification token");
    }
  });
};

export const createVerifyEmailLink = async ({ email, token }) => {
  // const uriEncodedEmail = encodeURIComponent(email);
  // return `${process.env.FRONTEND_URL}/verify-email-token?token=${token}&email=${uriEncodedEmail}`;

  const url = new URL(`${process.env.FRONTEND_URL}/verify-email-token`);
  url.searchParams.append("token", token);
  url.searchParams.append("email", email);

  return url.toString();
};

// export const findVerificationEmailToken = async ({ token, email }) => {
//   const tokenData = await db
//     .select({
//       userId: verifyEmailTokensTable.userId,
//       token: verifyEmailTokensTable.token,
//       expiresAt: verifyEmailTokensTable.expiresAt,
//     })
//     .from(verifyEmailTokensTable)
//     .where(
//       and(
//         eq(verifyEmailTokensTable.token, token),
//         gte(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`),
//       ),
//     );

//   if (!tokenData.length) {
//     return null;
//   }
//   const { userId } = tokenData[0];

//   const userData = await db
//     .select({
//       userId: usersTable.id,
//       email: usersTable.email,
//     })
//     .from(usersTable)
//     .where(eq(usersTable.id, userId));

//   if (!userData.length) {
//     return null;
//   }

//   return {
//     userId: userData[0].userId,
//     email: userData[0].email,
//     token: tokenData[0].token,
//     expiresAt: tokenData[0].expiresAt,
//   };
// };

export const verifyUserEmailAndUpdates = async (email) => {
  return db
    .update(usersTable)
    .set({ isEmailValid: true })
    .where(eq(usersTable.email, email));
};

export const clearVerifyEmailTokens = async (email) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return await db
    .delete(verifyEmailTokensTable)
    .where(eq(verifyEmailTokensTable.userId, user.id));
};

export const findVerificationEmailToken = async ({ token, email }) => {
  return await db
    .select({
      userId: usersTable.id,
      email: usersTable.email,
      token: verifyEmailTokensTable.token,
      expiresAt: verifyEmailTokensTable.expiresAt,
    })
    .from(verifyEmailTokensTable)
    .where(
      and(
        eq(verifyEmailTokensTable.token, token),
        eq(usersTable.email, email),
        gte(verifyEmailTokensTable.expiresAt, sql`CURRENT_TIMESTAMP`),
      ),
    )
    .innerJoin(usersTable, eq(verifyEmailTokensTable.userId, usersTable.id));
};

export const sendNewVerificationLink = async ({ email, userId }) => {
  const randomToken = generateRandomToken();

  await inserVerifyEmailToken({ userId, token: randomToken });

  const verifyEmailLink = await createVerifyEmailLink({
    email: email,
    token: randomToken,
  });

  const mjmlTemplate = await fs.readFile(
    path.join(import.meta.dirname, "..", "emails", "verify-email.mjml"),
    "utf-8",
  );

  const filledTemplate = ejs.render(mjmlTemplate, {
    code: randomToken,
    link: verifyEmailLink,
  });

  const htmlOutput = mjml2html(filledTemplate).html;

  sendEmail({
    to: email,
    subject: "Verify your email",
    html: htmlOutput,
  }).catch(console.error);
};

export const updateUserByName = async ({ userId, name }) => {
  return await db
    .update(usersTable)
    .set({ name: name })
    .where(eq(usersTable.id, userId));
};

export const updateUserPassword = async ({ userId, newPassword }) => {
  const newHashPassword = await hashedPassword(newPassword);

  return await db
    .update(usersTable)
    .set({ password: newHashPassword })
    .where(eq(usersTable.id, userId));
};
