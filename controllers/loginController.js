const usuario = require("../Models/usuario");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();

const registerForm = (req, res) => {
  res.render(
    "register"
    //{ mensajes: req.flash("mensajes") }
  );
};

const loginForm = (req, res) => {
  res.render(
    "login"
    //{ mensajes: req.flash("mensajes") }
  );
};

const registerUser = async (req, res) => {
  const mensaje = "Revisa tu correo electrónico";
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/login/register");
  }

  const { userName, email, password } = req.body;
  try {
    let user = await usuario.findOne({ email: email });
    if (user) throw new Error("Ya existe éste usuario");

    user = new usuario({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.userEmail,
        pass: process.env.passEmail,
      },
    });

    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: user.email, // list of receivers
      subject: "Verificar cuenta", // Subject line
      //text: "Hello world?", // plain text body
      html: `<a href="http://localhost:5000/login/confirmAcn/${user.tokenConfirm}">Verifica aquí tu cuenta</a>`, // html body
    });

    req.flash("mensajes", [
      { msg: "Revisa tu correo electrónico y valida tu cuenta" },
    ]);
    return res.redirect("/login/login");

    //res.json(user);
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/login/register");
  }
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await usuario.findOne({ tokenConfirm: token });
    if (!user) throw new Error("No existe éste usuario");

    user.confirmAccount = true;
    user.token = null;

    await user.save();

    req.flash("mensajes", [
      { msg: "Cuenta verificada, ya puedes iniciar sesión" },
    ]);
    return res.redirect("/login/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/login/register");
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/login/login");
  }

  const { email, password } = req.body;

  try {
    const user = await usuario.findOne({ email });
    if (!user) throw new Error("No existe éste email.");

    if (!user.confirmAccount) throw new Error("Falta confirmar cuenta.");

    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña incorrecta.");

    //me está creando la sesion de usuario a travez de passport
    req.login(user, function (err) {
      if (err) throw new Error("Error al crear la sesión");
      return res.redirect("/");
    });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/login/login");
  }
};

const logOut = (req, res) => {
  req.logout(() => {
    res.redirect("/login/login");
  });
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmAccount,
  loginUser,
  logOut,
};
