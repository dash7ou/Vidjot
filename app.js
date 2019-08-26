const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

//set ejs engine and views folder
app.set("view engine", "ejs");
app.set("views", "views");

//add css and js in public folder to express
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

app.get("/ideas/add", (req, res) => {
  res.render("ideas/addIdea", {
    pageTitle: "Add New Idea",
    path: "/ideas/add"
  });
});

//setup port
const port = 3000 || process.env.PORT;

//connect to DB mongodb port 27018
mongoose
  .connect("mongodb://localhost:27018/vid-jot-dev", {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(_ => console.log("Connect to mongodb done. port 27018"))
  .then(_ => {
    //listen to port run
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
