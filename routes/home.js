const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const urls = [
    { origin: "www.google.com/trebal1", shortUrl: "iubfiwu61" },
    { origin: "www.google.com/trebal2", shortUrl: "iubfiwu62" },
    { origin: "www.google.com/trebal3", shortUrl: "iubfiwu63" },
  ];
  res.render("home", { urls });
});
module.exports = router;
