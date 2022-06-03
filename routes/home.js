const express = require("express");
const {
  leerUrls,
  agregar,
  eliminarURL,
  editarURlform,
  editarURl,
  redirect,
} = require("../controllers/home_controller");
const { FormPerfil, editarPhoto } = require("../controllers/perfilController");
const validarURL = require("../middleware/Validar");
const verificarUser = require("../middleware/verificarUser");

const router = express.Router();

router.get("/", verificarUser, leerUrls);
router.post("/", verificarUser, validarURL, agregar);
router.get("/eliminar/:id", verificarUser, eliminarURL);
router.get("/editar/:id", verificarUser, editarURlform);
router.post("/editar/:id", verificarUser, validarURL, editarURl);

router.get("/perfil", verificarUser, FormPerfil);
router.post("/perfil", editarPhoto);

router.get("/:shortUrl", redirect);

module.exports = router;
