const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Idea } = require("./models/idea");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { User } = require("./models/user");
const passport = require("passport");

//set ejs engine and views folder
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

//add css and js in public folder to express
app.use(express.static(path.join(__dirname, "public")));

//express session middleware
app.use(
  session({
    secret: "anythingyouwant",
    resave: true,
    saveUninitialized: true
  })
);

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
    path: "/ideas/add",
    errors: [],
    idea: {}
  });
});

app.post("/ideas", async (req, res) => {
  const ideaId = req.body.ideaId;
  if (ideaId) {
    const idea = await Idea.findById(ideaId);
    const title = req.body.title;
    const description = req.body.description;

    idea.title = title;
    idea.details = description;

    await idea.save();

    const ideas = await Idea.find();

    let successfully = [];

    successfully.push({
      message: "Edit product successful"
    });

    res.render("ideas/showIdeas", {
      pageTitle: "Show All Ideas",
      path: "/ideas",
      ideas: ideas,
      successfully: successfully
    });
  } else {
    const title = req.body.title;
    const description = req.body.description;
    const errors = [];
    if (!title) {
      errors.push({
        message: "Enter Title Of Idea.."
      });
    }

    if (!description) {
      errors.push({
        message: "Enter Description To You Idea"
      });
    }

    if (errors.length > 0) {
      return res.render("ideas/addIdea", {
        pageTitle: "Add New Idea",
        path: "/ideas/add",
        errors: errors,
        idea: {}
      });
    }
    const idea = new Idea({
      title: title,
      details: description
    });
    await idea.save();
    const ideas = await Idea.find();

    res.render("ideas/showIdeas", {
      pageTitle: "Show All Ideas",
      path: "/ideas",
      ideas: ideas,
      successfully: []
    });
  }
});

app.get("/ideas", async (req, res) => {
  const ideas = await Idea.find();

  res.render("ideas/showIdeas", {
    pageTitle: "Show All Ideas",
    path: "/ideas",
    ideas: ideas,
    successfully: []
  });
});

app.get("/ideas/edit/:id", async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  res.render("ideas/addIdea", {
    pageTitle: "Edit product",
    path: "/edit",
    idea: idea,
    errors: []
  });
});

app.get("/ideas/delete/:id", async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  await Idea.deleteOne({ _id: req.params.id });
  const ideas = await Idea.find();
  res.render("ideas/showIdeas", {
    pageTitle: "Show All Ideas",
    path: "/ideas",
    ideas: ideas,
    successfully: []
  });
});

//login route
app.get("/login", (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errors: [],
    successfully: []
  });
});

//signup router
app.get("/signup", (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup"
  });
});

app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 12);

  const user = new User({
    name,
    password,
    email
  });
  let errors = [];
  let successfully = [];

  successfully.push({
    message: "signup done."
  });

  await user.save();
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errors: [],
    successfully: successfully
  });
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let errors = [];
  let successfully = [];

  const user = await User.findOne({ email: email });
  console.log(user);

  if (!user) {
    errors.push({
      message: "email not correct"
    });
    // console.log(errors);

    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errors: errors,
      successfully: []
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    errors.push({
      message: "password not correct"
    });
    return res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errors: errors,
      successfully: []
    });
  }

  const ideas = await Idea.find();

  res.render("ideas/showIdeas", {
    pageTitle: "Show All Ideas",
    path: "/ideas",
    ideas: ideas,
    successfully: []
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
