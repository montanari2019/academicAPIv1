const DadoBancario = require("../models/DadoBancario");
const fetch = require('node-fetch')
const Associacao = require("../models/Associacao");
const User = require("../models/User");


module.exports = {
  async listarPagador(req, res) {
    const userAuth = await User.findByPk(req.userId);

    const dadosBancarios = await DadoBancario.findAll({
      where: { id_associacao: userAuth.id_associacao },
    });

    

    console.log("Token da api: ", dadosBancarios[0].accessToken)
  

    const response = await fetch(`https://sandbox.sicoob.com.br/cobranca-bancaria/v1/boletos/pagadores/${userAuth.c_p_f}?numeroContrato=${dadosBancarios[0].cod_cedente}`, {
      method: "GET",
      headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${dadosBancarios[0].accessToken}`,
          },
    });
    const data = await response.json();

    
    // console.log(data);

    return res.json(data);

  },
};
