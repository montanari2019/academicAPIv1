const express = require('express');
const multer = require('multer');

const routes = express.Router();

const multerConfig = require('./config/multer')
const authenticate = require('./app/middleware/auth')

const AssociacaoController = require('./app/controllers/AssociacaoController')
const DadosBancariosController = require('./app/controllers/DadosBancariosController')
const UserController = require('./app/controllers/UserController')
const FaculdadeController = require('./app/controllers/FaculdadeController')
const ContratoController = require('./app/controllers/ContratoController')

routes.get('/inicio', (req, res) => res.json({ message: 'Bem vindo a aplicação Academic Controll' }));

// Model de associações
routes.post('/associacaoStore',AssociacaoController.store)
routes.get('/associacaoIndex',AssociacaoController.index)
routes.put('/associacaoUpdate/:id',AssociacaoController.update)
routes.delete('/associacaoDelete/:id',AssociacaoController.delete)

// Model de dados bancarios de cada associação
routes.post('/associacao/dadosbancariosStore', DadosBancariosController.store);
routes.get('/associacao/dadosbancarios', authenticate, DadosBancariosController.index);
routes.get('/associacao/dadosbancarios/:id',authenticate, DadosBancariosController.indexSelect);
routes.put('/associacao/dadosbancariosUpdate/:id',authenticate, DadosBancariosController.update);
routes.delete('/associacao/dadosbancariosDelete/:id', authenticate,DadosBancariosController.delete);

// // Rotas dos usuários
routes.post('/userStore', multer(multerConfig).single("file"), UserController.store)
routes.get('/users', authenticate, UserController.index)
routes.get('/users/:id',authenticate, UserController.indexId)
routes.get('/users/associacao/:id',authenticate, UserController.indexAssociated)
routes.post('/authenticate', UserController.authentication)
routes.put('/user/updatePhoto',authenticate, multer(multerConfig).single("file"), UserController.updatePhoto)
routes.put('/user/update',authenticate, UserController.update)
routes.put('/user/password', UserController.updatePassword)
routes.delete('/user/delete/:id', authenticate, UserController.delete)

// // Rotas da Faculdade
routes.post('/faculdadeStore', authenticate, FaculdadeController.store)
routes.get('/faculdades', authenticate, FaculdadeController.index)
routes.get('/faculdades/associacao/:id', FaculdadeController.indexAssociated)
routes.get('/faculdades/:id', authenticate, FaculdadeController.indexId)
routes.put('/faculdade/update/:id',authenticate, FaculdadeController.update)
routes.delete('/faculdade/delete/:id', authenticate, FaculdadeController.delete)

// Rotas do Contrato
routes.post('/contratoStore', ContratoController.store)
routes.get('/contratos', authenticate, ContratoController.index)
routes.get('/contrato/:id', authenticate, ContratoController.indexID)
routes.put('/contrato/update/:id',authenticate, ContratoController.update)
routes.put('/contrato/aprovar/:id',authenticate, ContratoController.aprovarContrato)
routes.put('/contrato/cancelar/:id',authenticate, ContratoController.cancelar)
routes.delete('/contrato/delete/:id', authenticate, ContratoController.delete)

module.exports = routes;