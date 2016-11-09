var index = require("./index.js");
var blog = require("./blog.js");
var user = require("./user.js");
module.exports = function(app){
    app.get("/", index.index);
    app.get("/list", user.list);
    app.get("/blog", blog.list);
    app.get("/user", user.list);
    app.post("/signup", user.create);
    app.post("/login", user.login);
    app.get("/logout", user.logout);
    app.get("/checklogin", index.getLoginUser);
}