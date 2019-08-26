const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Welcome Page"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    pageTitle: "About"
  });
});

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
