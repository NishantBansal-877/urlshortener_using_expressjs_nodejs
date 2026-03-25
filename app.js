import express, { urlencoded } from "express";
import session from "express-session";
import flash from "connect-flash";
import requestIp from "request-ip";
import cookieParser from "cookie-parser";

import { shortenerRoutes } from "./routes/shortener.route.js";
import { authRoutes } from "./routes/auth.routes.js";
import { verifyAuthentication } from "./middlewares/verify-auth-middleware.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

// setting template engine
app.set("view engine", "ejs");
// setting views folder
// by default it sets to views
app.set("views", "./views");
app.use(cookieParser());

app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: false,
    name: "session_id",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use(flash());
app.use(requestIp.mw());

//this middleware should be used after cookieparser
app.use(verifyAuthentication);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(authRoutes);
app.use(shortenerRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
