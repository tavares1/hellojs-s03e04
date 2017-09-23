const knex = require("./db").knex
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const api = require("axios").create({
  baseURL: 'http://api.github.com',
})

app.use(express.static("public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


let confereIssue = (issue) => {
  api.get(`repos/seita-ifce/hello-js-v3/issues/${issue}`).then((ret) => {
    let data = new Date(ret.data.body)
    let dataLimite = `${data.getFullYear()}-${data.getMonth()+1}-${data.getDate()+2}`
    let repo = (ret.data.title).toLowerCase()
    api.get(`repos/seita-ifce/hello-js-v3/issues/${issue}/comments`).then((ret) => {
      users = ret.data.filter(e => e.user.login != "sombriks" && e.body.includes("hellojs-s03") && +new Date(e.created_at) <= +new Date(dataLimite))
      for (user of users) {
        let repositorio = (user.body.slice(user.body.trim().indexOf(`hellojs-${repo}`)))
        let episodio = repositorio.slice(repositorio.lastIndexOf('e')).trim().replace(".git", "")
        let info = {
          nome: user.user.login,
          episodio: episodio,
          datapresenca: new Date(user.created_at),
          repositorio: repositorio
        }
        inserirBanco(info)
      }
    }).catch(err=>console.log(err))
  }).catch(err => console.log(err))
}

let confereRepo = (repo) => {
  api.get('repos/seita-ifce/hello-js-v3/issues').then((ret) => {
    let numeroIssue = (ret.data.filter(ret => ret.title == repo))
    confereIssue(numeroIssue[0].number)
  }).catch((err) => {
    console.log(err)
  })
}

let inserirBanco = (info) => {
  let inserir = "insert into presenca(usuario,episodio,datapresenca,repositorio) values (:nome,:episodio,:datapresenca,:repositorio)"
  knex.raw(`select usuario from presenca where usuario='${info.nome}' and episodio='${info.episodio}'`).then((ret) => {
    if (ret.length == 0) {
      knex.raw(inserir, info).then(() => {
        console.log("inserido com sucesso!")
      }).catch((err) => {
        console.log(err)
      })
    }
    else {
      console.log(`${info.nome} já está no banco!`)
    }
  }).catch((err) => {
    console.log(err)
  })
}

app.post("/presenca", (req, res) => {
  console.log(req.body.issue)
  confereIssue(req.body.issue)
})

knex.migrate.latest().then(_ => {
  console.log("knex migrate latest - [DONE]")
  app.listen(4200, _ => console.log('All subsystems - [ONLINE]'))
})