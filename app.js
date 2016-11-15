// Wikistack application

// Required modules
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const path = require("path");

// Setup models
const models = require("./models");
const Page = models.Page;
const User = models.User;

// Setup routes
const wikiRoute = require("./routes/wiki");

// App instanciation
const app = express();
module.exports = app;

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/wiki", wikiRoute);

// Nunjucks
const env = nunjucks.configure("views", {noCache: true});
app.use(express.static("public"));
app.set("view engine", "html");
app.engine("html", nunjucks.render);

// Static Routing
app.use(express.static("public"));

// Server initialize
User.sync({ force: true })
    .then(() => {
        return Page.sync({ force: true });
    })
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
