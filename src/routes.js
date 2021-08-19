const express = require('express');

const routes = express.Router();

const AssociacaoController = require('./app/controllers/AssociacaoController')

routes.get('/inicio', (req, res) => res.json({ message: 'Bem vindo a aplicação 09' }));

// Model de associações
routes.post('/associacaoStore',AssociacaoController.store)
routes.get('/associacaoIndex',AssociacaoController.index)
routes.put('/associacaoUpdate/:id',AssociacaoController.update)
routes.delete('/associacaoDelete/:id',AssociacaoController.delete)

module.exports = routes;