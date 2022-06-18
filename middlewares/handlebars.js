const exhbs = require('express-handlebars');
const path = require('path');
// console.log("path join", path.join(__dirname, 'views/partials'));

module.exports = (app) => {

    const hbs = exhbs.create({

        defaultLayout: "user",
        extname: "hbs",
        // partialsDir: '/views/partials',
        helpers: {
            compareString(s1, s2, options) {
                return s1 === s2 ? options.fn(this) : options.inverse(this);
            },

            compareInt(int1, int2, options) {
                return +int1 === +int2 ? options.fn(this) : options.inverse(this);
            },

            checkExists(obj1, options) {
                return obj1 ? options.fn(this) : options.inverse(this);
            },

            forN(n, block) {
                let acum = "";
                for (let i = 1; i <= n; i++) {
                    acum += block.fn(i);
                }
                return acum;
            },

            formatTime(time) {
                return time.toLocaleString();
            },

            formatBirthday(time) {
                return time.toLocaleDateString();
            },

            ifCond: function(v1, operator, v2, options) {
                switch (operator) {
                    case "==":
                        return v1 == v2 ? options.fn(this) : options.inverse(this);
                    case "===":
                        return v1 === v2 ? options.fn(this) : options.inverse(this);
                    case "!=":
                        return v1 != v2 ? options.fn(this) : options.inverse(this);
                    case "!==":
                        return v1 !== v2 ? options.fn(this) : options.inverse(this);
                    case "<":
                        return v1 < v2 ? options.fn(this) : options.inverse(this);
                    case "<=":
                        return v1 <= v2 ? options.fn(this) : options.inverse(this);
                    case ">":
                        return v1 > v2 ? options.fn(this) : options.inverse(this);
                    case ">=":
                        return v1 >= v2 ? options.fn(this) : options.inverse(this);
                    case "&&":
                        return v1 && v2 ? options.fn(this) : options.inverse(this);
                    case "||":
                        return v1 || v2 ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            },
        },

    });


    app.engine("hbs", hbs.engine);
    app.set("view engine", "hbs");
    app.set("views", "views");
    // app.engine('hbs', exhbs.express4({
    //     partialsDir: __dirname + '/views/partials'
    // }));

}