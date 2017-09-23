// 20170919140032_esquema_inicial.js
exports.up = knex => knex.schema.createTable("evento", tb => {
    tb.increments("idevento")
    tb.string("tituloevento").notNullable()
    tb.timestamp("dthoraevento").defaultTo(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("evento")