//configurar o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentr arquivos estáticos
server.use(express.static('public'))

//habilitar corpo do formulário
server.use(express.urlencoded({ extended: true}))

// configurar conexão com banco de dados
const Pool = require('pg').Pool // mantem a conexão ativa.
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: '5432',
    database: 'doe'
}) // configura o pool 

//configurar a apresentação da página
server.get("/", function (req, res)
{
    db.query("SELECT * FROM donors", 
    function(err, result)
    {
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows
        return res.render("index.html", {donors})
    })
})

server.post("/", function(req, res)
{
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    // Se alguem dado estiver vazio (fluxo de erro)
    if(name == "" || email == "" || blood == "")
    {
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocando valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)
    `
    const values = [name, email, blood]


    db.query(query, values, 
    function(err)
    {
        // fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        // fluxo ideal
        return res.redirect("/")
    })
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log('iniciei o servidor')
})