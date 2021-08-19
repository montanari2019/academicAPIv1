const express = require('express');
const multer = require('multer');

const routes = express.Router();

const multerConfig = require('./config/multer')
const authenticate = require('./app/middleware/auth')

const AssociacaoController = require('./app/controllers/AssociacaoController')
const UserController = require('./app/controllers/UserController')

routes.get('/inicio', (req, res) => res.json({ message: 'Bem vindo a aplicação 09' }));

// Model de associações
routes.post('/associacaoStore',AssociacaoController.store)
routes.get('/associacaoIndex',AssociacaoController.index)
routes.put('/associacaoUpdate/:id',AssociacaoController.update)
routes.delete('/associacaoDelete/:id',AssociacaoController.delete)



// // Rotas dos usuários
routes.post('/userStore', multer(multerConfig).single("file"), UserController.store);
routes.get('/users', authenticate, UserController.index);
routes.get('/users/:id',authenticate, UserController.indexId);
routes.get('/users/associacao/:id',authenticate, UserController.indexAssociated);
routes.post('/authenticate', UserController.authentication);
routes.put('/user/updatePhoto',authenticate, multer(multerConfig).single("file"), UserController.updatePhoto);
routes.put('/user/update',authenticate, UserController.update);
routes.put('/user/password', UserController.updatePassword);
routes.delete('/user/delete/:id', authenticate, UserController.delete);

module.exports = routes;