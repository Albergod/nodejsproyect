const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const usuario = require("../Models/usuario");
const jimp = require("jimp");

module.exports.FormPerfil = async (req, res, next) => {
  try {
    const user = await usuario.findById(req.user.id);
    return res.render("perfil", { user: req.user, imagen: user.imagen });
  } catch (error) {
    req.flash("mensaje", [{ msg: "Error al leer Usuario" }]);
    return res.render("perfil");
  }
};

module.exports.editarPhoto = async (req, res) => {
  const form = new formidable.IncomingForm();
  const maxsise = (form.maxFileSize = 50 * 1024 * 1024); // 5 mb

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("Falló la alzada de imagenes");
      }

      console.log(files);
      console.log(fields);
      const file = files.myFile;

      if (file.originalFilename === "") {
        throw new Error("Por favor agrege una imagen");
      }
      // if (!file.mimetype === "image/jpeg" || file.mimetype === "image/jng") {
      //   throw new Error("Por favor agrege una imagen tipo jpg ó png");
      // }
      if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
        throw new Error("Por favor agrege una imagen tipo jpg ó png");
      }
      if (file.size > maxsise) {
        throw new Error("Menos de 5mb por favor");
      }

      const extension = file.mimetype.split("/")[1];
      const dirFile = path.join(
        __dirname,
        `../public/img/perfiles/${req.user.id}.${extension}`
      );
      //console.log(dirFile);

      fs.renameSync(file.filepath, dirFile);

      const imgge = await jimp.read(dirFile);
      imgge.resize(200, 200).quality(80).writeAsync(dirFile);

      const user = await usuario.findById(req.user.id);
      user.imagen = `${req.user.id}.${extension}`;
      await user.save();

      req.flash("mensajes", [{ msg: "ya se subió la imagen" }]);
    } catch (error) {
      req.flash("mensajes", [{ msg: error.message }]);
    } finally {
      return res.redirect("/perfil");
    }
  });
};
