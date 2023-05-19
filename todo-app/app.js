/* eslint-disable no-undef */
const express = require("express");
const app = express();
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

const { Todo, User } = require("./models");
const bcrpyt = require("bcrypt");

const saltRounds = 10;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("shh! some secret string"));
app.use(csrf({ cookie: true }));

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
app.use(flash());
app.use(
  session({
    secret: "my_super-secret-key-217263018951768",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hrs
    },
  })
);
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async function (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return done(error);
        });
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("Serilaizing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async function (request, response) {
  response.render("index", {
    title: "Todo Application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const loggeduser = request.user.id;
    const allTodos = await Todo.getTodos(loggeduser);
    const overdue = await Todo.overdue(loggeduser);
    const dueToday = await Todo.dueToday(loggeduser);
    const dueLater = await Todo.dueLater(loggeduser);
    const completedItems = await Todo.completedItems();
    if (request.accepts("html")) {
      response.render("todos", {
        allTodos,
        overdue,
        dueToday,
        dueLater,
        completedItems,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        allTodos,
        overdue,
        dueToday,
        dueLater,
        completedItems,
      });
    }
  }
);

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("creating a todo", request.body);
    console.log(request.user.id);
    try {
      // eslint-disable-next-line no-unused-vars
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      console.log(response);
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
      const st = await Todo.remove(request.params.id);
      return response.json(st > 0);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);
app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "signup",
    csrfToken: request.csrfToken(),
  });
});
app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});
app.post("/users", async (request, response) => {
  console.log(request.body.firstName);
  const hashedpwd = await bcrpyt.hash(request.body.password, saltRounds);
  try {
    // eslint-disable-next-line no-unused-vars
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedpwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(error);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    // we are calling this method for authentications
    console.log(request.user);
    response.redirect("/todos");
  }
);
app.get("/signout", (request, response) => {
  request.logOut((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

module.exports = app;
