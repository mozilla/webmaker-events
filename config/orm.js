var DB_FIELDS = ['dialect', 'host', 'port', 'database', 'username', 'password', 'storage'];
module.exports = function () {
    var Sequelize = require('sequelize'), db;

    /* Load Database Configuration */
    try { db = require('./databases')[this.get('env')]; } catch (e) {}
    if (!isValidDB(db)) {
        db = {};
        DB_FIELDS.forEach(function (v) {
            db[v] = process.env['DB_'+v.toUpperCase()];
        });
        console.log(db);
    }
    if (!isValidDB(db)) throw new Error("Database configuration not found.");

    /* Connect to Database Server */
    var Model; Model = function(name, fields, init) {
        var model = Model.models[name] = Model.sequelize.define(name, fields);
        init = init || function(){};
        model.init = function () {
            init.call(model, Model.models);
        };
        model.init.bind(model);
        return model;
    };
    Model.sequelize = new Sequelize(db.database, db.username, db.password,
                                    { host: db.host, port: db.port, dialect: db.dialect,
                                      storage: db.storage });
    Model.models    = {};
    Model.types     = extend(Object.create(Sequelize), {
        String: Sequelize.STRING,
        Text:   Sequelize.TEXT,
        Float:  Sequelize.FLOAT,
        Int:    Sequelize.INTEGER,
        Date:   Sequelize.DATE,
        URL: {
            type: Sequelize.STRING,
            validate: { isUrl: true },
            allowNull: true,
        },
        Email: {
            type: Sequelize.STRING,
            validate: { isEmail: true }
        }
    });
    Model.app  = this;
    this.models = Model.models;
    return Model;
};

function extend(o, a) {
    Object.keys(a).forEach(function (k) { o[k] = a[k]; });
    return o;
}
function isValidDB(db) {
    return db && DB_FIELDS.every(function (x) { return db[x] !== undefined });
}
