const DadoBancario = require("../models/DadoBancario");
const fetch = require("node-fetch");
const User = require("../models/User");
const schedule = require("node-schedule");

module.exports = {
  async listarPagador(req, res) {
    const userAuth = await User.findByPk(req.userId);

    const dadosBancarios = await DadoBancario.findAll({
      where: { id_associacao: userAuth.id_associacao },
    });

    console.log("Token da api: ", dadosBancarios[0].accessToken);

    const response = await fetch(
      `https://sandbox.sicoob.com.br/cobranca-bancaria/v1/boletos/pagadores/${userAuth.c_p_f}?numeroContrato=${dadosBancarios[0].cod_cedente}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dadosBancarios[0].accessToken}`,
        },
      }
    );
    const data = await response.json();

    // console.log(data);

    return res.json(data);
  },

  async emitirSegundaVia(req, res) {
    const userAuth = await User.findByPk(req.userId);

    const nossoNumero = req.body
    console.log("Nosso Número do boleto: ", nossoNumero);

    const dadosBancarios = await DadoBancario.findAll({
      where: { id_associacao: userAuth.id_associacao },
    });

    console.log("Token da api: ", dadosBancarios[0].accessToken);

    const response = await fetch(
      `https://sandbox.sicoob.com.br/cobranca-bancaria/v1/boletos/segunda-via?numeroContrato=${dadosBancarios[0].cod_cedente}&modalidade=1&nossoNumero=${nossoNumero}&gerarPdf=true
      `,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dadosBancarios[0].accessToken}`,
        },
      }
    );
    const data = await response.json();

    // console.log(data);

    return res.json(data);
  },



  async refreshToken(req, res) {
    const dadosBancarios = await DadoBancario.findAll({
      where: { id_associacao: userAuth.id_associacao },
    });

    const rule = new schedule.RecurrenceRule();
    rule.minute = 1;

    const job = schedule.scheduleJob(rule, function () {
      var body = `grant_type=refresh_token&refresh_token=${dadosBancarios[0].refreshToken}`;

      fetch("https://sandbox.sicoob.com.br/token", {
        method: "POST",
        body,
        headers: {
          "Content-type": "www/form-url-encoded",
          Authorization: `Basic ${process.env.TOKEN_BASIC}`,
        },
        
      });
    });


  },
  
};
