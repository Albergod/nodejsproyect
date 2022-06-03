const express = require("express");
const { create } = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const usuario = require("./Models/usuario");
const csrf = require("csurf");
const MongoStore = require("connect-mongo");
const clientDB = require("./database/date");
const MongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

require("dotenv").config();

const app = express();

const cortOption = {
  Credentials: true,
  origin: process.env.PATHHEROKU || "*",
  methods: ["GET", "POST"],
};
app.use(cors());

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: "secret-name-trebal",
    store: MongoStore.create({
      clientPromise: clientDB,
      dbName: process.env.DBNAME,
    }),
    cookie: {
      secure: process.env.MODE === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(flash());
app.use(MongoSanitize());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) =>
  done(null, { id: user._id, userName: user.userName })
); //req.user
passport.deserializeUser(async (user, done) => {
  //es necesario revisar la base de dato¿?
  const userDB = await usuario.findById(user.id);
  return done(null, { id: userDB._id, userName: userDB.userName });
});

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.mensajes = req.flash("mensajes");
  next();
});

app.use("/", require("./routes/home"));
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/login"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("servidor andando" + PORT);
});
