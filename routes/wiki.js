// Wiki router

// Required modules
const express = require("express");

// Declare router
const router = express.Router();
module.exports = router;

// Import models
const models = require("../models");
const Page = models.Page;
const User = models.User;

// Routes

// GET /wiki/
router.get("/", (req, res, next) => {

    Page.findAll({})
        .then((pages) => {
            //console.log(pages);
            res.render("index", {
                pages: pages
            });
        })
        .catch(next);
});

// POST /wiki/
router.post("/", (req, res, next) => {

    let user;
    User.findOrCreate({
        where: {
            name: req.body.name,
            email: req.body.email
        }
    })
    .spread(function(theUser) {
        user = theUser;
        return Page.create(req.body);
    })
    .then((page) => page.setAuthor(user))
    .then((page) => res.redirect(page.route)) // What's the difference between page.get("route") and page.route
    .catch(next);

});

// GET /wiki/add
router.get("/add", (req, res, next) => {
    res.render("addpage");
});

// GET /wiki/:page
router.get("/:urlTitle", (req, res, next) => {
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        },
        include: [
            {model: User, as: "author"}
        ]
    })
    .then((page) => {
        if (page === null) {
            res.status(404).send();
        } else {
            res.render("wikipage", page.get({ plain: true }));
        }

    })
    .catch(next);
});
