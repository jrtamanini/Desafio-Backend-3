const express = require('express'); //importaçao express
const rotas = require('./rotas'); //importação do arquivo de rotas

const app = express(); //instaciando para criar a app em node

app.use(express.json()); //indicar que esse API pode trabalhar com req, res no formato JSON
app.use(rotas); //rotas sempre abaixo do app.use(express.json())


app.listen(3000, () => {
    console.log('servidor ok')
});