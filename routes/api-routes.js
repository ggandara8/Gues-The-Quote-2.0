// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const fetch = require("node-fetch");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id,
      });
    }
  });
  //posting score -----------------------------------------------------------------------------
  app.post("/api/score", (req, res) => {
    db.Score.create({
      score: req.body.score,
      UserId: req.body.userid,
    })
      .then((newScore) => {
        res.json(newScore);
      })
      .catch((error) => {
        res.json(error);
      });
  });
  //getting score ------------------------------------------------------------------------------
  app.get("/api/score/:userid", (req, res) => {
    db.Score.findAll({
      where: {
        UserId: req.params.userid,
      },
    }).then((data) => {
      res.json(data);
    });
  });
  //get id for high scores----------------------------------------------------
  app.get("/api/score/:id", (req, res) => {
    db.Score.findAll({
      where: {
        UserId: req.params.id,
      },
    }).then((data) => {
      res.json(data);
    });
  });
  //high score user id
  app.get("/api/alluser_data/:id", (req, res) => {
    db.User.findAll({
      where: {
        Id: req.params.id,
      },
    }).then((dbUser) => {
      res.json(dbUser);
    });
  });
  //all user scores
  app.get("/api/score/", (req, res) => {
    db.Score.findAll({}).then((dbScore) => {
      res.json(dbScore);
    });
  });
  // gettign quotes and authors from the public quote garden api--------------------------------
  app.get("/quotes", async (req, res) => {
    const url = "https://quote-garden.herokuapp.com/api/v3/quotes/random";
    const fetchRes = await fetch(url);
    const json = await fetchRes.json();
    res.json(json);
  });
};
