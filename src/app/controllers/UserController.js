const jwt = require('jsonwebtoken')
const User = require("../models/User")
const Yup = require("yup")


module.exports = {

    async store(req, res){

        // const usersExists = await User.findOne({
        //     where: { email: req.body.email}
        // })

        // if(usersExists){
        //     return res.status(400).json({error: 'Email ja existente'})
        // }

        // const schema = Yup.object().shape({
        //     nome: Yup.string().required(),
        //     email: Yup.string().required().email(),
        //     password: Yup.string().required().min(6),
        //     admin: Yup.boolean().required(),
        //     r_g: Yup.number().required(),
        //     c_p_f: Yup.number().required().min(11).max(11),
        //     telefone: Yup.number().required(),
        //     cep: Yup.number().required(),
        //     endereco: Yup.string().required(),
        //     bairro: Yup.string().required(),
        //     numero: Yup.string().required(),
        //     cidade: Yup.string().required(),
        //     estado: Yup.string().required(),
        //     id_associacao: Yup.number().required(),
        // })

        // if(!(await schema.isValid(req.body))){
        //     return res.status(400).json({ error: 'Falha na validação'})
        // }



        // const { key, location } = req.file

        // console.log("dados do body: ", req.body)
        // console.log("dados do file: ", req.file)

        // const { id, nome, email, admin, foto_url, created_at } = await User.create({
        //     nome: req.body.nome,
        //     email: req.body.email,
        //     password: req.body.password,
        //     admin: req.body.admin,
        //     r_g: req.body.r_g,
        //     c_p_f: req.body.c_p_f,
        //     telefone: req.body.telefone,
        //     cep: req.body.cep,
        //     endereco: req.body.endereco,
        //     bairro: req.body.bairro,
        //     numero: req.body.numero,
        //     cidade: req.body.cidade,
        //     estado: req.body.estado,
        //     id_associacao: req.body.id_associacao,
        //     foto: key,
        //     foto_url: location
        // })

        

        // return res.json({
        //     id,
        //     nome,
        //     email,
        //     admin,
        //     foto_url,
        //     created_at
        // })

        return res.json({ok: true})

    },

    async authentication (req, res){
        const { email, password } = req.body

        const user = await User.findOne({ where: {email} })

        console.log(password)

          //Verificando se o Usuário existe
          if(!user){
            return res.status(401).json({ erro: 'Usuário não exite'})
            
        }
        // Verifcando se a senha informada é a mesma do banco
        if(!(await user.checkPassword(password))){
            return res.status(401).json({ erro: 'Senha Invalida'})
        }

        const { id, nome, id_associacao } = user

        // Gerando token

        return res.json({ 
            user:{
                id,
                nome,
                email,
                id_associacao
            },
            token: jwt.sign({ id, }, process.env.HASH,{
                expiresIn: process.env.EXPIRATION
            } )

        })
    },

    async index(req, res) {
        const { password_hash, ...response } = await User.findAll()
        return res.status(200).json(response)
    },

    async indexId(req, res) {
        const { id } = req.params

        const user = await User.findByPk(id)

        return res.json(user)
    },

    async indexAssociated(req, res) {
        const { id } = req.params

        const userAuth = await User.findByPk(req.userId)

        if(!userAuth) {
            return res.status(401).json({ erro: 'Usuário não existe'}) 
        }else if (userAuth.admin != true) {
            return res.status(401).json({ erro: 'Voce não tem permissão para ver esses dados'})
        }else if (userAuth.id_associacao != id){
            return res.status(401).json({ erro: 'Usuário não tem permissão para ver esses dados'})
        }

        const users = await User.findAll({
            where: { id_associacao: id}
        })

        if(!users) {
            return res.status(401).json({ erro: 'Associação sem usuários'})
        }

        return res.json(users)
    },

    async update (req, res) {

        console.log("dados do body: ", req.body)
        console.log("dados do file: ", req.file)

        const user_id = req.userId
        const { key, location } = req.file

        const user = await User.findByPk(user_id)

        if(!user){
            return res.status(401).json({ erro: 'Usuário não exite'})
        }

        const schema = Yup.object().shape({
            nome: Yup.string(),
            email: Yup.string().email(),
            admin: Yup.boolean(),
            r_g: Yup.number(),
            c_p_f: Yup.number(),
            telefone: Yup.number(),
            cep: Yup.number(),
            endereco: Yup.string(),
            bairro: Yup.string(),
            numero: Yup.string(),
            cidade: Yup.string(),
            estado: Yup.string(),
            id_associacao: Yup.number(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        
        console.log('key da foto', user.foto)

        // Deletando foto do servido AWS
        await user.s3Delete(user.foto)
        

        const { id, nome, email, admin, foto, foto_url, created_at, updated_at } = await user.update({
            nome: req.body.nome,
            email: req.body.email,
            admin: req.body.admin,
            r_g: req.body.r_g,
            c_p_f: req.body.c_p_f,
            telefone: req.body.telefone,
            cep: req.body.cep,
            endereco: req.body.endereco,
            bairro: req.body.bairro,
            numero: req.body.numero,
            cidade: req.body.cidade,
            estado: req.body.estado,
            id_associacao: req.body.id_associacao,
            foto: key,
            foto_url: location
        })

        
        return res.json({
            id,
            nome,
            email,
            admin,
            foto,
            foto_url,
            created_at,
            updated_at,

        })

        // res.json({ok: true})
    },

    async updatePassword (req, res){
        const { password, confirm_password } = req.body

        const user = await User.findOne({
            where: { email: req.body.email}
        })

        const schema = Yup.object().shape({
            
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6),
            confirm_password: Yup.string().required().min(6),
            
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Falha na validação'})
        }

        if(password != confirm_password){
            return res.status(400).json({error: 'As senhas não são iguais'})
        }

        await user.update({
            password: confirm_password,
        })

        return res.json(user)
    },

    async delete(req, res) {
        const { user_id } = req.body
        const adminId = req.userId

        const admin = await User.findByPk(adminId)
        const user = await User.findByPk(user_id)

        // // Validando Admin
        // if(!admin) {
        //     return res.status(401).json({ erro: 'Admin não exite'})
        // }

        if(!user){
            return res.status(401).json({ erro: 'Usuário não exite'})
        }

        console.log('key da foto', user.foto)

        // Deletando foto do servido AWS
        await user.s3Delete(user.foto)
        
        await user.destroy()

        return res.json({ message: 'Usuário deletado'})


    },
    

  

}