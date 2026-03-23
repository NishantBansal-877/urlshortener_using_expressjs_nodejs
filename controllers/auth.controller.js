import {
  comparePassword,
  createUser,
  getUsersByEmail,
  hashedPassword,
  generateToken,
} from "../services/auth.services.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validators/auth-validator.js";

export const getRegisterPage = (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("../views/auth/register", { errors: req.flash("errors") });
};

export const getLoginPage = (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("auth/login", { errors: req.flash("errors") });
};

export const postRegister = async (req, res) => {
  if (req.user) return res.redirect("/");
  //   console.log(req.body);

  const { data, error } = registerUserSchema.safeParse(req.body);

  if (error) {
    const errors = error.errors[0].message;
    req.flash("errors", errors);
    res.redirect("/register");
  }

  const { name, email, password } = data;
  const userExists = await getUsersByEmail(email);

  if (userExists) {
    req.flash("errors", "User already exists");
    return res.redirect("/register");
  }

  const hashPassword = await hashedPassword(password);

  const [user] = await createUser({ name, email, password: hashPassword });
  // console.log(user);/
  res.redirect("/login");
};

export const postLogin = async (req, res) => {
  if (req.user) return res.redirect("/");

  const { data, error } = loginUserSchema.safeParse(req.body);

  if (error) {
    const errors = error.errors[0].message;
    req.flash("errors", errors);
    res.redirect("/login");
  }

  const { email, password } = data;

  const user = await getUsersByEmail(email);

  if (!user) {
    req.flash("errors", "Invalid Email or Password");
    return res.redirect("/login");
  }

  const isPasswordValid = await comparePassword(user.password, password);

  if (!isPasswordValid) {
    req.flash("errors", "Invalid Email or Password");
    return res.redirect("/login");
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  res.cookie("access_token", token);

  res.redirect("/");
};

export const getMe = (req, res) => {
  if (!req.user) return res.send("Not logged In");
  return res.send(`<h1> Hey ${req.user.name} - ${req.user.email}</h1>`);
};

export const logoutUser = (req, res) => {
  ["access_token", "session_id"].forEach((cookie) => {
    res.clearCookie(cookie, { path: "/" });
  });

  res.redirect("/login");
};
