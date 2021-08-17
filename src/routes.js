const express = require('express');

const routes = express.Router();

const AssociacaoController = require('./app/controllers/AssociacaoController')

routes.get('/inicio', (req, res) => res.json({ message: 'Bem vindo a aplicação 09' }));

// Model de associações
routes.post('/associacaoStore',AssociacaoController.store)
routes.get('/associacaoIndex',AssociacaoController.index)
routes.put('/associacaoUpdate/:id',AssociacaoController.update)
routes.delete('/associacaoDelete/:id',AssociacaoController.delete)

// Model de dados bancarios de cada associação
// routes.post('/associacao/dadosbancariosStore', DadosBancariosController.store);
// routes.get('/associacao/dadosbancarios', DadosBancariosController.index);
// routes.get('/associacao/dadosbancarios/:id', DadosBancariosController.indexSelect);
// routes.put('/associacao/dadosbancariosUpdate/:id', DadosBancariosController.update);
// routes.delete('/associacao/dadosbancariosDelete/:id', DadosBancariosController.delete);

module.exports = routes;