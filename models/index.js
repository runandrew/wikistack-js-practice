// Models

// Required modules
const Sequelize = require("sequelize");
const marked = require("marked");

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
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue: []
    }
}, {
    getterMethods: {
        route : function()  { return "/wiki/" + this.urlTitle; },
        renderedContent: function() { return marked(this.content); }
    },
    hooks: {
        beforeValidate: (page) => {
            page.urlTitle = generateUrlTitle(page.title);
        }
    },
    classMethods: {
        findByTag: function(tag) {
            return this.findAll({
                where: {
                    tags: {
                        $contains: [tag]
                    }
                }
            });
        }
    },
    instanceMethods: {
        findSimilar: function() {
            return Page.findAll({
                where: {
                    id: {
                        $ne: this.id
                    },
                    tags: {
                        $overlap: this.tags
                    }
                }
            });
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
