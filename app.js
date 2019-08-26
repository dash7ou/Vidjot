const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Welcome Page",
    path: "/"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About",
    path: "/about"
  });
});

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
