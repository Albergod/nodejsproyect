// const links = (document.getElementById("bton").onclick = hover());

// function hover() {
//   d.addEventListener("click", (e) => {
//     if (e.target.matches(links) || e.target.matches(`${links} *`)) {
//       links.classList.add("active");
//     } else {
//       links.classList.remove("active");
//     }
//   });
// }

addEventListener("click", (e) => {
  if (e.target.dataset.short) {
    const url = `http://localhost:5000/${e.target.dataset.short}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("texto copiado...");
      })
      .catch((err) => {
        console.log("ha ocurrido un error", err);
      });
  }
});
