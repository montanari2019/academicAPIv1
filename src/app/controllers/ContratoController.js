const Faculdade = require("../models/Faculdade")
const User = require("../models/User")
const Associacao = require("../models/Associacao")
const Contrato = require("../models/Contrato")
const Yup = require("yup")


const validade_1year = '2021-12-31T23:59:59'
const validade_6months = '2021-06-30T23:59:59'

module.exports = {

    async store(req, res){

        const schema = Yup.object().shape({
            validade: Yup.number().required(),
            aprovado: Yup.boolean().required(),
            vigente: Yup.boolean().required(),
            cancelado: Yup.boolean(),
            descricao: Yup.string(),
            dias_ultilizados: Yup.number().required(),
            dias_viagem: Yup.string().required(),
            mensalidade: Yup.string().required(),
            data_vencimento: Yup.number().required(),
            id_user: Yup.number().required(),
            id_faculdade: Yup.number().required(),
            id_associacao: Yup.number().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        console.log("id Associacao", req.body.id_associacao)

        const user = await User.findByPk(req.body.id_user)
        const faculdade = await Faculdade.findByPk(req.body.id_faculdade)
        const associacao = await Associacao.findByPk(req.body.id_associacao)

        if(!user){
            return res.status(404).json({ error: 'Usuário não existe'})
        }
        if(!faculdade){
            return res.status(404).json({ error: 'Faculdade não existe'})
        }
        if(!associacao){
            return res.status(404).json({ error: 'Associaçcao não existe'})
        }
        if(req.body.data_vencimento < 5 || req.body.data_vencimento > 25){
            return res.status(404).json({ error: 'A data de vencimento deve ser superior ao dia 05 e inferior ao dia 25'})
        }

        

        console.log("Usário infomado", user.nome)
        console.log("Faculdade informada", faculdade.nome)
        console.log("Associação informada", associacao.nome)


        if(req.body.validade == 12){
            req.body.validade = validade_1year
        }else{
            req.body.validade = validade_6months
        }

        const contrato = await Contrato.create(req.body)

        return res.json(contrato)
        // return res.json({ok: true})
    },

    async index(req, res) {

        const userAuth = await User.findByPk(req.userId)
        const contratos = await Contrato.findAll({
            where: { id_associacao: userAuth.id_associacao}
        })
        if(!contratos){
            return res.status(404).json({ error: 'Contratos não encontrados'})
        }
        return res.json(contratos)

    },

    async indexID(req, res){
        const { id } = req.params
        const userAuth = await User.findByPk(req.userId)
        const contrato = await Contrato.findByPk(id)

        console.log("USER", userAuth.nome)
        console.log("Contrato", contrato)

        if(!contrato){
            return res.status(404).json({ error: 'Contrato não encontrado'})
        }

        if(userAuth.id_associacao != contrato.id_associacao){
            return res.status(401).json({ error: 'Usuário não tem permissão'})
        }
        
        return res.json(contrato)
    },

    async contratosPendentes(req, res){
        const userAuth = await User.findByPk(req.userId)
        if(userAuth.admin == false){
            return res.status(401).json({ error: 'Usuário sem autorização'})
        }
        const contratosPendentes = await Contrato.findAll({
            where: { aprovado: false },
            include: [
                { model: User, as: 'user' },
            ]
        })
        // console.log(contratosPendentes)

        return res.json(contratosPendentes)
    },

    async contratosVigentes(req, res){
        const userAuth = await User.findByPk(req.userId)
        if(userAuth.admin == false){
            return res.status(401).json({ error: 'Usuário sem autorização'})
        }
        const contratosPendentes = await Contrato.findAll({
            where: { vigente: true },
            include: [
                { model: User, as: 'user' },
            ]
        })
        // console.log(contratosPendentes)

        return res.json(contratosPendentes)
    },

    async listUserContratoFaculdade (req,res){
        const userAuth = await User.findByPk(req.userId)
        const userAssociated = req.params.id
        if(userAuth.admin == false){
            return res.status(401).json({ error: 'Usuário sem autorização'})
        }

        const userContratoList = await Contrato.findAll({
            where: { id_user: userAssociated },
            include: [
                { model: User, as: 'user' },
                {model: Faculdade, as: 'faculdade'}
            ]
        })
        return res.json(userContratoList)
    },

    async indexUserAuthID (req, res) {
        const userAuth = await User.findByPk(req.userId)
        const contratos = await Contrato.findAll({
            where: { id_user: userAuth.id}
        })
        if(!contratos){
            return res.status(404).json({ error: 'Contratos não encontrados'})
        }
        return res.json({ contratos })
        
    },

    async update(req, res) {

        const schema = Yup.object().shape({
            validade: Yup.number(),
            aprovado: Yup.boolean(),
            vigente: Yup.boolean(),
            cancelado: Yup.boolean(),
            descricao: Yup.string(),
            dias_ultilizados: Yup.number(),
            dias_viagem: Yup.string(),
            mensalidade: Yup.string(),
            data_vencimento: Yup.number(),

        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        const { id } = req.params

        const userAuth = await User.findByPk(req.userId)
        const faculdade = await Faculdade.findByPk(req.body.id_faculdade)
        const contrato = await Contrato.findByPk(id)


        // console.log("USER", userAuth.nome)
        // console.log("Faculdade", faculdade.nome)
        // console.log("Contrato", contrat.id)

        if(!contrato){
            return res.status(404).json({ error: 'Contrato inexistente' })
        }
        if(contrato.id_associacao != userAuth.id_associacao){
            return res.status(401).json({ error: 'Usuário sem permissão para alterar esse contrato'})
        }
        if(!faculdade){
            return res.status(404).json({ error: 'Faculdade não existe'})
        }
        if(userAuth.admin != true){
            return res.status(401).json({ error: 'Usuário sem permissão'})
        }

        // Validando validade rsrs (Redundancia)
        if(req.body.validade == 12){
            req.body.validade = validade_1year
        }else{
            req.body.validade = validade_6months
        }

        // Validação dos dias de venciamento
        if(await(req.body.data_vencimento)){
            console.log("Entrando na validação do vencimento")
            if(req.body.data_vencimento < 5 || req.body.data_vencimento > 25){
                
                return res.status(400).json({ error: 'A data de vencimaento deve ser superior ao dia 05 e inferior ao dia 25'})
            }
        }

        await contrato.update(req.body)
         
        return res.json(contrato)

    },

    async aprovarContrato (req, res){
        const schema = Yup.object().shape({
            validade: Yup.number(),
            aprovado: Yup.boolean(),
            vigente: Yup.boolean(),
            cancelado: Yup.boolean(),
            descricao: Yup.string(),
            dias_ultilizados: Yup.number(),
            dias_viagem: Yup.string(),
            mensalidade: Yup.string(),
            data_vencimento: Yup.number(),

        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        const { id } = req.params

        const userAuth = await User.findByPk(req.userId)
        const contrato = await Contrato.findByPk(id)


        // console.log("USER", userAuth.nome)
        // console.log("Faculdade", faculdade.nome)
        // console.log("Contrato", contrat.id)

        if(!contrato){
            return res.status(404).json({ error: 'Contrato inexistente' })
        }
        if(contrato.id_associacao != userAuth.id_associacao){
            return res.status(401).json({ error: 'Usuário sem permissão para alterar esse contrato'})
        }
        if(userAuth.admin != true){
            return res.status(401).json({ error: 'Usuário sem permissão'})
        }
        if(contrato.aprovado == true){
            return res.status(400).json({error: 'Contrato ja aprovado'})
        }

        await contrato.update({
            admin_aprovocao: userAuth.nome,
            aprovado: req.body.aprovado,
            descricao: req.body.descricao,
            vigente: true,
        })
         
        return res.json(contrato)
    },

    async cancelar(req, res) {
        const schema = Yup.object().shape({
            validade: Yup.number(),
            aprovado: Yup.boolean(),
            vigente: Yup.boolean(),
            cancelado: Yup.boolean(),
            descricao: Yup.string(),
            dias_ultilizados: Yup.number(),
            dias_viagem: Yup.string(),
            mensalidade: Yup.string(),
            data_vencimento: Yup.number(),

        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        const { id } = req.params

        const userAuth = await User.findByPk(req.userId)
        const contrato = await Contrato.findByPk(id)


        if(!contrato){
            return res.status(404).json({ error: 'Contrato inexistente' })
        }
        if(contrato.id_associacao != userAuth.id_associacao){
            return res.status(401).json({ error: 'Usuário sem permissão para alterar esse contrato'})
        }
        if(userAuth.admin != true){
            return res.status(401).json({ error: 'Usuário sem permissão'})
        }
        if(contrato.vigente != true){
            return res.status(400).json({error: 'Contrato não vigente'})
        }

        await contrato.update({

            descricao: req.body.descricao,
            vigente: false,
            cancelado: true,
        })
         
        return res.json(contrato)
    },

    async delete(req, res) {

        const { id } = req.params
        const contrato = await Contrato.findByPk(id)

        if(!contrato){
            return res.status(404).json({ error: 'Contrato não econtrado'})
        }else if(contrato.cancelado != true){    
            return res.status(401).json({ error: 'Contrato ainda vigente não podemos apagalo'})
        }

        await contrato.destroy()
        return res.json({message: 'Contrato deletado'})

    },

}