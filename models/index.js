// Models

// Required modules
const Sequelize = require("sequelize");

// Connect to database
const db = new Sequelize("postgres://localhost:5432/wikistack-practice", {
    logging: false
});

// Schemas
const Page = db.define("page", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM("open", "closed")
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    // getterMethods: {
    //     route: () => { return "/wiki/" + this.urlTitle; }
    // },
    // This = {} using es6 arrow function
    getterMethods: {
        route : function()  { return "/wiki/" + this.urlTitle; }
    },
    hooks: {
        beforeValidate: (page) => {
            page.urlTitle = generateUrlTitle(page.title);
        }
    }
});

var User = db.define("user", {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

// Helper functions
function generateUrlTitle (title) {
    if (title) {
        return title.replace(/\s+/g, "_").replace(/\W/g, "");
    } else {
        return Math.random().toString(36).substring(2, 7);
    }
}

// Connect page to author
Page.belongsTo(User, {
    as: "author"
});

// Export module
module.exports = {
    Page: Page,
    User: User
};
