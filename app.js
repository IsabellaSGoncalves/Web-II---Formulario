const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.post("/cadastrar", function(req, res){
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log("Cadastrado com sucesso")
        res.send("Cadastrado com sucesso")
    })
})
app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.get("/confirmar", function(req, res){
    res.render("quarta_pagina", {posts})
    console.log(posts)
})

app.get("/consultar", function(req, res){
    post.findAll().then(function(posts){
        res.render("segunda_pagina",{posts})
        console.log(posts)
    })
})

app.post("/atualizar", function(req,res){
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    },{
        where:{
            id: req.body.id
        }
        
    }).then(
        function(){
            console.log("Dados atualizados com sucesso!")
            res.render("primeira_pagina")
        }
    )
})

app.get("/excluir/:id", function(req, res) {
    post.findAll({ where: { id: req.body.id } }).then(posts => {
        if (posts) {
            res.render("quarta_pagina", { posts });
        } else {
            res.status(404).send("Post não encontrado");
        }
    }).catch(err => {
        console.error("Erro ao buscar post para excluir:", err);
        res.status(500).send("Erro ao buscar post");
    });
});

app.post("/excluir", function(req, res) {
    post.destroy({ where: { id: req.body.id } }).then(() => {
        console.log("Dados excluídos com sucesso!");
        res.redirect("/consultar"); 
    }).catch(err => {
        console.error("Erro ao excluir:", err);
        res.status(500).send("Erro ao excluir");
    });
});



app.get("/editar/:id", function(req, res){
        post.findAll({where: {'id' : req.params.id}}).then(
            function(posts){
                res.render("terceira_pagina", {posts})
                console.log(posts)
            }
        )
    })

app.listen(8081, function(){
    console.log("Servidor funfando")
})

