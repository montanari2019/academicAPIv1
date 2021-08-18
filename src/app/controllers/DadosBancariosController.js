const DadoBancario = require('../models/DadoBancario')
const Associacao = require('../models/Associacao')
const Yup = require("yup")

module.exports = {

    async store(req, res) {
        const schema = Yup.object().shape({
            banco: Yup.number().required(),
            agencia: Yup.number().required(),
            conta: Yup.number().required(),
            cod_cedente: Yup.number().required(),
            cod_convenio: Yup.number().required(),
            id_associacao: Yup.number().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        const associacao = await Associacao.findByPk(req.body.id_associacao)

        if(!associacao){
            return res.status(404).json({ error: 'Associação não existe'})
        }

        const dadosBancarios = await DadoBancario.create(req.body)

        return res.json(dadosBancarios)

        
    },

    async index(req, res) {
        const dadosBancarios = await DadoBancario.findAll()
        return res.json(dadosBancarios)
    },

    async indexSelect(req, res) {

        const { id } = req.params

        const dadosBancarios = await DadoBancario.findAll({
            where: { id_associacao: id },
        })
        return res.json(dadosBancarios)
    },

    async update(req, res) {

        const { id } = req.params
        const { id_associacao } = req.body
        console.log("ID PASSADO PELO USER",  id)

        const dadosBancarios = await DadoBancario.findByPk(id)

        

        if(!dadosBancarios){
            return res.status(400).json({ error: 'Dados bancários não encontrados'})
        }

        if(dadosBancarios.id_associacao != id_associacao){
            return res.status(401).json({ error: 'Dados bancários não encontrados'})
        }


        const schema = Yup.object().shape({
            banco: Yup.number().integer(),
            agencia: Yup.number().integer(),
            conta: Yup.number().integer(),
            cod_cedente: Yup.number().integer(),
            cod_convenio: Yup.number().integer(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        await dadosBancarios.update(req.body)

        return res.json(dadosBancarios)
    },

    async delete(req, res) {
        const { id } = req.params

        const dadosBancarios = await DadoBancario.findByPk(id)

        if(!dadosBancarios){
            return res.status(400).json({ error: 'Dados bancários não encontrados'})
        }

        await dadosBancarios.destroy()

        return res.json({ message: 'Dados bancários deletados'})
    },

}