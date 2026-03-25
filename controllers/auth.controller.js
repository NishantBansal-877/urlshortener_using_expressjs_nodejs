import {
  comparePassword,
  createUser,
  getUsersByEmail,
  hashedPassword,
  clearSession,
  authenticateUser,
  findUserById,
  getAllShortLinks,
  verifyUserEmailAndUpdates,
  findVerificationEmailToken,
  clearVerifyEmailTokens,
  sendNewVerificationLink,
  updateUserByName,
  updateUserPassword,
} from "../services/auth.services.js";
import {
  loginUserSchema,
  registerUserSchema,
  verifyEmailSchema,
  verifyPasswordSchema,
  verifyUserSchema,
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

  await authenticateUser({ req, res, user, name, email });

  await sendNewVerificationLink({ email, userId: user.id });

  res.redirect("/");
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

  // const token = generateToken({
  //   id: user.id,
  //   name: user.name,
  //   email: user.email,
  // });

  // res.cookie("access_token", token);
  await authenticateUser({ req, res, user });

  res.redirect("/");
};

export const getMe = (req, res) => {
  if (!req.user) return res.send("Not logged In");
  return res.send(`<h1> Hey ${req.user.name} - ${req.user.email}</h1>`);
};

export const logoutUser = async (req, res) => {
  await clearSession(req.user.sessionId);

  ["access_token", "refresh_token"].forEach((cookie) => {
    res.clearCookie(cookie, { path: "/" });
  });

  res.redirect("/login");
};

export const getProfilePage = async (req, res) => {
  if (!req.user) return res.send("Not logged In");

  const user = await findUserById(req.user.id);
  if (!user) return res.redirect("/login");

  const userShortLinks = await getAllShortLinks(user.id);

  return res.render("auth/profile", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      createdAt: user.createdAt,
      links: userShortLinks,
    },
  });
};

export const getVerifyEmailPage = async (req, res) => {
  // if (!req.user || req.user.isEmailValid) return res.redirect("/");

  const user = await findUserById(req.user.id);

  if (!user || user.isEmailValid) return res.redirect("/");

  return res.render("auth/verify-email", {
    email: req.user.email,
  });
};

export const resendVerificationLink = async (req, res) => {
  if (!req.user) return res.redirect("/");
  const user = await findUserById(req.user.id);
  if (!user || user.isEmailValid) return res.redirect("/");

  await sendNewVerificationLink({ email: req.user.email, userId: req.user.id });

  res.redirect("/verify-email");
};

export const verifyEmailToken = async (req, res) => {
  const { data, error } = verifyEmailSchema.safeParse(req.query);

  if (error) {
    res.send("Verfication link invalid or expired!");
    res.redirect("/login");
  }
  // const token = await findVerificationEmailToken(data); //without join

  //with joins
  const [token] = await findVerificationEmailToken(data);

  // console.log("VerifyEmailToken - token:", token);
  if (!token) res.send("Verification link invalid or expired!");
  await verifyUserEmailAndUpdates(token.email);
  await clearVerifyEmailTokens(token.email).catch(console.error);
  res.redirect("/profile");
};

export const getEditProfilePage = async (req, res) => {
  if (!req.user) return res.redirect("/");

  const user = await findUserById(req.user.id);

  if (!user) return res.status(404).send("User not found");
  console.log("called");
  return res.render("auth/edit-profile", {
    name: user.name,
    errors: req.flash("erros"),
  });
};

export const postEditProfile = async (req, res) => {
  if (!req.user) return res.redirect("/");

  const { data, error } = verifyUserSchema.safeParse(req.body);

  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/edit-profile");
  }

  await updateUserByName({ userId: req.user.id, name: data.name });
  return res.redirect("/profile");
};

export const getChangePasswordPage = async (req, res) => {
  if (!req.user) return res.redirect("/");

  return res.render("auth/change-password", {
    errors: req.flash("errors"),
  });
};

export const postChangePassword = async (req, res) => {
  const { data, error } = verifyPasswordSchema.safeParse(req.body);
  if (error) {
    const errorMessages = error.errors.map((err) => err.message);
    req.flash("errors", errorMessages);
    return res.redirect("/change-password");
  }

  const { currentPassword, newPassword } = data;

  const user = await findUserById(req.user.id);

  if (!user) return res.status(404).send("User not found");

  const isPasswordValid = await comparePassword(user.password, currentPassword);

  if (!isPasswordValid) {
    req.flash("errors", "Current Password that you have entered is invalid");
    return res.redirect("/auth/change-password");
  }

  await updateUserPassword({ userId: user.id, newPassword });

  return res.redirect("/profile");
};

export const getResetPasswordPage = async (req, res) => {
  return res.render("auth/forgot-password", {
    formSubmitted: req.flash("formSubmitted")[0],
    errors: req.flash("errors"),
  });
};
