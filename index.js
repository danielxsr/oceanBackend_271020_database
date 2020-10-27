const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('mongodb');

(async () => {

const connectionString = 'mongodb://localhost:27017';
console.info('Conectando ao banco e dados MongoDB');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

console.info('MongoDB conectado com sucesso!');

const app = express();

const port = 3000;

//  Precisamos avisar o Expres para utilizar o body-parser
//  Assim, ele saberá como transformar as imformações no BODY da requisição
//      em imformação útil para a programação

app.use(bodyParser.json());

/*
    ->CRUD
        Create, Read(All, Single), Update and Delete
*/

/*
URL -> http://localhost:3000
Endpoint ou Rota -> [GET] /mensagem
Endpoint ou Rota -> [POST] /mensagem
Endpoint: [GET] /mensagem
Descrição: Ler todas as mensagens
Endpoint: [POST] /mensagem
Descrição: Criar uma mensagem
Endpoint: [GET] /mensagem/{id}
Descrição: Ler mensagem específica pelo ID
Exemplo: [GET] /mensagem/1
Endpoint: [PUT] /mensagem/{id}
Descrição: Edita mensagem específica pelo ID
Endpoint: [DELETE] /mensagem/{id}
Descrição: Remove mensagem específica pelo ID
*/
 
app.get('/', function (req, res) {
  res.send('SALVE MUNDO.');
});

const db = client.db('oceanBackend_271020');
const mensagens = db.collection('mensagens');

//  Read All
app.get('/mensagem', async (req, res) => {
    const findResult = await mensagens.find({}).toArray();
    res.send(findResult); // Devolve a lista com todas as mensagens
});

//  Create
app.post('/mensagem', async (req, res) => { // Criar uma mensagem na lista de mensagens
    //  Obtendo o texto a partir do body da requisição
    const texto = req.body.texto;

    //  Adiciono o texto recebido na lsita de mensagens
    const mensagem = {
        'texto': texto
    }

    const resultado = await mensagens.insertOne(mensagem);

    const objetoInserido = resultado.ops[0]

    res.send(objetoInserido);
})

// Read Single
app.get('/mensagem/:id', (req, res) => {
    const id = req.params.id;

    const mensagem = mensagens[id - 1];

    res.send(mensagem);
});

// Update
app.put('/mensagem/:id', (req, res) => {
    const id = req.params.id;
    const texto = req.body.texto;

    mensagens[id - 1].texto = texto;

    res.send(`A mensagem '${texto}' com o Id ${id} foi atualizada com sucesso.`);
});

// Delete
app.delete('/mensagem/:id', (req, res) => {
    const id = req.params.id;

    delete mensagens[id - 1];

    res.send(`A mensagem com o Id ${id} foi removida com sucesso.`);
});

// Local onde a minha aplicação está rodando
app.listen(port, function () {
    console.info('App rodando em http://localhost:' + port);
});

// Projeto dos dias 22, 27 e 29 de outubro

})();