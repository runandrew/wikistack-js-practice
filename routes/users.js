// Users router

// Required modules
const express = require("express");
const Promise = require("bluebird");

// Declare router
const router = express.Router();
module.exports = router;

// Import models
const models = require("../models");
const Page = models.Page;
const User = models.User;

// Routes
// GET /
router.get("/", (req, res, next) => {

    User.findAll({})
    .then((users) => {
        res.render("users", { users });
    })
    .catch(next);
});

// GET /users/:id
router.get("/:id", (req, res, next) => {

    let query1 = User.findOne({
        where: {
            id: req.params.id
        }
    });

    let query2 = Page.findAll({
        where: {
            authorId: req.params.id
        }
    });

    Promise.all([query1, query2])
    .spread((user, pages) => {
        res.render("userpages", {
            user,
            pages
        });
    })
    .catch(next);

});
