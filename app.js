// Wikistack application

// Required modules
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const path = require("path");
const Promise = require("bluebird");

// Setup models
const models = require("./models");
const Page = models.Page;
const User = models.User;

// Setup routes
const wikiRoute = require("./routes/wiki");
const usersRoute = require("./routes/users");

// App instanciation
const app = express();
module.exports = app;

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/wiki", wikiRoute);
app.use("/users", usersRoute);

// Nunjucks
const env = nunjucks.configure("views", {noCache: true});
const AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));
app.use(express.static("public"));
app.set("view engine", "html");
app.engine("html", nunjucks.render);

// Static Routing
app.use(express.static("public"));

// Server initialize
Promise.all([User.sync({}), Page.sync({})])
    .then(() => {
        app.listen(3001, () => {
            console.log("Server is listening on port 3001!");
        });
    })
    .catch((err) => {
        console.error;
    });

// Error handling
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(err.message);
});
