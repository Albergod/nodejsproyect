const Url = require("../Models/Url");
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    res.render("home", { urls });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const agregar = async (req, res) => {
  const { origin } = req.body;

  try {
    const url = new Url({ origin, shortURL: nanoid(8), user: req.user.id });
    await url.save();
    req.flash("mensajes", [{ msg: "Url agregada" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const eliminarURL = async (req, res) => {
  //console.log(req.user);
  const { id } = req.params;
  try {
    await Url.findByIdAndDelete(id);
    // const url = await Url.findById(id);
    // if (!url.user.equals(req.user.id)) {
    //   throw new Error("No es tu Url");
    // }
    // await url.remove();

    req.flash("mensajes", [{ msg: "url eliminada" }]);
    return res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarURlform = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    // const url = await Url.findById(id);
    // if (!url.user.equals(req.user.id)) {
    //   throw new Error("No es tu Url");
    // }
    res.render("home", { url });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarURl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    await Url.findByIdAndUpdate(id, { origin });
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redirect = async (req, res) => {
  const shortUrl = req.params;
  try {
    const urlDb = await Url.findOne({ shortUrl });
    res.redirect(urlDb.origin);
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

module.exports = {
  leerUrls,
  agregar,
  eliminarURL,
  editarURlform,
  editarURl,
  redirect,
};
