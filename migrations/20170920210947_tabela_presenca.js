exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("presenca",(table)=>{
        table.increments("idusuario")
        table.string("usuario")
        table.string("episodio")
        table.dateTime("datapresenca")
        table.string("repositorio")
    })
  }
  
  exports.down = function(knex, Promise) {
      return knex.schema.dropTableIfExists("presenca")
  }
  