const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  loginForm,
  registerForm,
  registerUser,
  confirmAccount,
  loginUser,
  logOut,
} = require("../controllers/loginController");

router.get("/register", registerForm);
router.post(
  "/register",
  [body("userName", "Ingrese un nombre válido").trim().notEmpty().escape()],
  [body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail()],
  [
    body("password", "La contraseña requiere 6 dígitos o más")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("No coinciden las contraseñas");
        } else return value;
      }),
  ],
  registerUser
);
router.get("/confirmAcn/:token", confirmAccount);
router.get("/login", loginForm);
router.post(
  "/login",
  [body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail()],
  [
    body("password", "La contraseña requiere 6 o más dígitos")
      .trim()
      .isLength({ min: 6 })
      .escape(),
  ],
  loginUser
);
router.get("/logout", logOut);

module.exports = router;
