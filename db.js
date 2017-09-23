const cfg = require("./knexfile").development
const knex = require("knex")(cfg)
exports.knex = knex