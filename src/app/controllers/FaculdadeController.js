const Faculdade = require('../models/Faculdade')
const User = require("../models/User")
const Associacao = require("../models/Associacao")
const Yup = require("yup")

module.exports = {

    async store(req, res){

        const user = await User.findByPk(req.userId)
        const associacao = await Associacao.findByPk(req.body.id_associacao)

        if(user.admin != true){
            return res.status(401).json({ erro: 'Usuário não tem permissão para cadastrar esses dados'})
        }

        if(!associacao){
            return res.status(404).json({ erro: 'Associação não existe'})
        }

        
        const faculdadeExists = await Faculdade.findOne({
            where: { nome: req.body.nome, id_associacao: user.id_associacao}
        })

        if(faculdadeExists){
            return res.status(400).json({error: 'Faculdade ja existente'})
        }

        
        const schema = Yup.object().shape({
            nome: Yup.string().required(),
            cep: Yup.number().required(),
            endereco: Yup.string().required(),
            bairro: Yup.string().required(),
            numero: Yup.string().required(),
            cidade: Yup.string().required(),
            estado: Yup.string().required(),
            id_associacao: Yup.number().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        const faculdade = await Faculdade.create(req.body)

        res.json(faculdade)

    },

    async index(req, res) {
        const userAuth = await User.findByPk(req.userId)

        const faculdades = await Faculdade.findAll({
            where: { id_associacao: userAuth.id_associacao }
        })

        return res.json(faculdades)

    },

    async indexId(req, res) {
        const userAuth = await User.findByPk(req.userId)
        const { id } = req.params


        if(userAuth.admin != true) {
            return res.status(401).json({ erro: 'Usuário não tem permissão para acessar esses dados'})
        }

        const faculdades = await Faculdade.findAll({
            where: { id_associacao: userAuth.id_associacao, id: id }
        })

        if(!faculdades){
            return res.status(404).json({error: 'Faculdades inexistentes'})
        }

        return res.json(faculdades)
    },

    async indexAssociated(req, res) {
        const { id } = req.params

        const faculdades = await Faculdade.findAll({
            where: { id_associacao: id }
        })

        if(faculdades == null) {
            return res.status(404).json({ error: 'Não existem faculdade para essa associação'})
        }

        return res.json(faculdades)
    },

    async update(req, res) {

        const userAuth = await User.findByPk(req.userId)
        const { id } = req.params

        if(userAuth.admin != true){
            return res.status(401).json({ erro: 'Usuário não tem permissão para cadastrar esses dados'})
        }

        const faculdade = await Faculdade.findByPk(id)

        if(!faculdade) {
            return res.status(404).json({ error: 'Não existem faculdade para essa associação'})
        }
        
        const schema = Yup.object().shape({
            nome: Yup.string(),
            cep: Yup.number(),
            endereco: Yup.string(),
            bairro: Yup.string(),
            numero: Yup.string(),
            cidade: Yup.string(),
            estado: Yup.string(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }


        await faculdade.update(req.body)

       return res.json(faculdade)

    },

    async delete(req, res) {
        const { id } = req.params
        const userAuth = await User.findByPk(req.userId)
        const faculdade = await Faculdade.findByPk(id)

        if(userAuth.admin != true){
            return res.status(401).json({ erro: 'Usuário não tem permissão para cadastrar esses dados'})
        }
        if(!faculdade){
            return res.status(400).json({error: 'Faculdade não encontrada'})
        }

        await faculdade.destroy()

        return res.json({ message: 'Faculdade deletada'})

    },

}