const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Associacao = require("../models/Associacao");
const Yup = require("yup");
const jsBR = require("js-brasil");

module.exports = {
  async store(req, res) {
    console.log("body: ", req.body);

    const usersExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (usersExists) {
      return res.status(400).json({ error: "Email ja existente" });
    }

    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean().required(),
      r_g: Yup.number().required(),
      c_p_f: Yup.number().required().min(11),
      telefone: Yup.number().required(),
      cep: Yup.number().required(),
      endereco: Yup.string().required(),
      bairro: Yup.string().required(),
      numero: Yup.string().required(),
      cidade: Yup.string().required(),
      estado: Yup.string().required(),
      id_associacao: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação 01" });
    }

    const cpf = jsBR.validateBr.cpf(req.body.c_p_f);

    console.log("Validação CPF", cpf);

    if (cpf == false) {
      return res.status(400).json({ erro: "Cpf Inválido" });
    }

   

    console.log("dados do body: ", req.body);
    console.log("dados do file: ", req.file);

    const { id, nome, email, admin, foto_url, created_at } = await User.create({
      nome: req.body.nome,
      email: req.body.email,
      password: req.body.password,
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

    });

    return res.json({
      id,
      nome,
      email,
      admin,
      foto_url,
      created_at,
    });

    // return res.json({ok: true})
  },

  async authentication(req, res) {
    const email_login = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ where: { email: email_login } });

    console.log(password);

    //Verificando se o Usuário existe
    if (!user) {
      return res.status(401).json({ erro: "Usuário não exite" });
    }
    // Verifcando se a senha informada é a mesma do banco
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ erro: "Senha Invalida" });
    }

    const {
      id,
      nome,
      email,
      admin,
      foto_url,
      created_at,
      update_at,
      id_associacao,
      r_g,
      c_p_f,
      telefone,
      cep,
      endereco,
      bairro,
      numero,
      cidade,
      estado,
    } = user;

    // Gerando token

    return res.json({
      user: {
        id,
        nome,
        email,
        admin,
        r_g,
        c_p_f,
        telefone,
        cep,
        endereco,
        bairro,
        numero,
        cidade,
        estado,
        foto_url,
        created_at,
        update_at,
        id_associacao,
      },
      token: jwt.sign({ id }, process.env.HASH, {
        expiresIn: process.env.EXPIRATION,
      }),
    });
  },

  async loadSession(req, res) {
    const {
      id,
      nome,
      email,
      admin,
      foto_url,
      created_at,
      update_at,
      id_associacao,
      r_g,
      c_p_f,
      telefone,
      cep,
      endereco,
      bairro,
      numero,
      cidade,
      estado,
    } = await User.findByPk(req.userId);
    return res.json({
      user: {
        id,
        nome,
        email,
        admin,
        r_g,
        c_p_f,
        telefone,
        cep,
        endereco,
        bairro,
        numero,
        cidade,
        estado,
        foto_url,
        created_at,
        update_at,
        id_associacao,
      },
    });
  },

  async index(req, res) {
    const { password_hash, ...response } = await User.findAll();
    return res.status(200).json(response);
  },

  async indexId(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ erro: "Usuário não exite" });
    }

    return res.json(user);
  },

  async indexAssociated(req, res) {
    const { id } = req.params;

    const userAuth = await User.findByPk(req.userId);

    if (!userAuth) {
      return res.status(401).json({ erro: "Usuário não existe" });
    } else if (userAuth.admin != true) {
      return res
        .status(401)
        .json({ erro: "Voce não tem permissão para ver esses dados" });
    } else if (userAuth.id_associacao != id) {
      return res
        .status(401)
        .json({ erro: "Usuário não tem permissão para ver esses dados" });
    }

    const users = await User.findAll({
      where: { id_associacao: id },
    });

    if (!users) {
      return res.status(401).json({ erro: "Associação sem usuários" });
    }

    return res.json(users);
  },

  async updatePhoto(req, res) {
    console.log("dados do body: ", req.body);

    const user_id = req.userId;

    const { key, location } = req.file;

    const user = await User.findByPk(user_id);
    const associacao = await Associacao.findByPk(user.id_associacao);

    if (!user) {
      return res.status(404).json({ erro: "Usuário não exite" });
    }
    if (!associacao) {
      return res.status(404).json({ erro: "Associação não existe" });
    }

    console.log("key da foto", user.foto);

    // Deletando foto do servido AWS
    await user.s3Delete(user.foto);

    const { id, nome, email, admin, foto, foto_url, createdAt, updatedAt } = await user.update({
        foto: key,
        foto_url: location,
      });

    return res.json({
      id,
      nome,
      email,
      admin,
      foto,
      foto_url,
      createdAt,
      updatedAt,
    });

    // res.json({ok: true})
  },

  async update(req, res) {
    console.log("dados do body: ", req.body);

    const user_id = req.userId;

    const user = await User.findByPk(user_id);
    const associacao = await Associacao.findByPk(user.id_associacao);

    if (!user) {
      return res.status(404).json({ erro: "Usuário não exite" });
    }
    if (!associacao) {
      return res.status(404).json({ erro: "Associação não existe" });
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
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { id, nome, email, admin, foto, foto_url, createdAt, updatedAt } =
      await user.update(req.body);

    return res.json({
      id,
      nome,
      email,
      admin,
      foto,
      foto_url,
      createdAt,
      updatedAt,
    });

    // res.json({ok: true})
  },

  async updatePassword(req, res) {
    const { password, confirm_password } = req.body;

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      confirm_password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    if (password != confirm_password) {
      return res.status(400).json({ error: "As senhas não são iguais" });
    }

    await user.update({
      password: confirm_password,
    });

    return res.json(user);
  },

  async delete(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id);

    console.log("key da foto", user.foto);

    // Deletando foto do servido AWS
    await user.s3Delete(user.foto);

    await user.destroy();

    return res.json({ message: "Usuário deletado" });
  },
};
