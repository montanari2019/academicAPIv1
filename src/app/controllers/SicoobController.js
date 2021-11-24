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

    const nossoNumero = req.body.nNumero
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

  async emitirBoleto(req, res) {
    const userAuth = await User.findByPk(req.userId);

    const dadosBancarios = await DadoBancario.findAll({
      where: { id_associacao: userAuth.id_associacao },
    });

    const boleto01 = [
      {
          numeroContrato: req.body[0].numeroContrato,
          modalidade: 1,
          numeroContaCorrente: dadosBancarios[0].conta,
          especieDocumento: "DM",
          // dataEmissao: "2018-09-20T00:00:00-03:00",
          // nossoNumero: 2588658,
          seuNumero: req.body[0].seuNumero,
          // identificacaoBoletoEmpresa: "4562",
          identificacaoEmissaoBoleto: 2,
          identificacaoDistribuicaoBoleto: 2,
          valor: req.body[0].valor,
          dataVencimento: req.body[0].dataVencimento,
          // dataLimitePagamento: "2018-09-20T00:00:00-03:00",
          // valorAbatimento: 1,
          // tipoDesconto: 1,
          // dataPrimeiroDesconto: "2018-09-20T00:00:00-03:00",
          // valorPrimeiroDesconto: 1,
          // dataSegundoDesconto: "2018-09-20T00:00:00-03:00",
          // valorSegundoDesconto: 0,
          // dataTerceiroDesconto: "2018-09-20T00:00:00-03:00",
          // valorTerceiroDesconto: 0,
          tipoMulta: req.body[0].tipoMulta,
          dataMulta: req.body[0].dataMulta,
          valorMulta: req.body[0].valorMulta,
          tipoJurosMora: req.body[0].tipoJurosMora,
          dataJurosMora: req.body[0].dataJurosMora,
          valorJurosMora: req.body[0].valorJurosMora,
          numeroParcela: 1,
          aceite: true,
          codigoNegativacao: req.body[0].codigoNegativacao,
          numeroDiasNegativacao: req.body[0].numeroDiasNegativacao,
          codigoProtesto: req.body[0].codigoProtesto,
          numeroDiasProtesto: req.body[0].numeroDiasProtesto,

            pagador: {
              numeroCpfCnpj: req.body[0].pagador.numeroContrato,
              nome: req.body[0].pagador.nome,
              endereco: req.body[0].pagador.endereco,
              bairro: req.body[0].pagador.bairro,
              cidade: req.body[0].pagador.cidade,
              cep: req.body[0].pagador.cep,
              uf: req.body[0].pagador.uf,
              // email: [
              //   req.body[0].pagador.email[0]
              // ]
            },
                mensagensInstrucao: {
                tipoInstrucao: 1,
                mensagens: [
                  req.body[0].mensagensInstrucao.mensagens[0],
                  // req.body[0].mensagensInstrucao[1],
                  // req.body[0].mensagensInstrucao[3],
                ]
              },

      gerarPdf: true,
    
      }
    ]

    const boletoTeste = [
      {
        numeroContrato: 25546454,
        modalidade: 1,
        numeroContaCorrente: 0,
        especieDocumento: "DM",
        dataEmissao: "2018-09-20T00:00:00-03:00",
        nossoNumero: 2588658,
        seuNumero: "1235512",
        identificacaoBoletoEmpresa: "4562",
        identificacaoEmissaoBoleto: 1,
        identificacaoDistribuicaoBoleto: 1,
        valor: 156.23,
        dataVencimento: "2018-09-20T00:00:00-03:00",
        dataLimitePagamento: "2018-09-20T00:00:00-03:00",
        valorAbatimento: 1,
        tipoDesconto: 1,
        dataPrimeiroDesconto: "2018-09-20T00:00:00-03:00",
        valorPrimeiroDesconto: 1,
        dataSegundoDesconto: "2018-09-20T00:00:00-03:00",
        valorSegundoDesconto: 0,
        dataTerceiroDesconto: "2018-09-20T00:00:00-03:00",
        valorTerceiroDesconto: 0,
        tipoMulta: 0,
        dataMulta: "2018-09-20T00:00:00-03:00",
        valorMulta: 5,
        tipoJurosMora: 2,
        dataJurosMora: "2018-09-20T00:00:00-03:00",
        valorJurosMora: 4,
        numeroParcela: 1,
        aceite: true,
        codigoNegativacao: 2,
        numeroDiasNegativacao: 60,
        codigoProtesto: 1,
        numeroDiasProtesto: 30,
        pagador: {
          numeroCpfCnpj: "98765432185",
          nome: "Ikaro Montanari",
          endereco: "Rua 87 Quadra 1 Lote 1 casa 1",
          bairro: "Santa Rosa",
          cidade: "Luziânia",
          cep: "72320000",
          uf: "DF"
        },
      
        gerarPdf: true
        
      }
    ]

    console.log("Token da api: ", dadosBancarios[0].accessToken);

    const response = await fetch(
      `https://sandbox.sicoob.com.br/cobranca-bancaria/v1/boletos`,
      {
        method: "POST",
        body: JSON.stringify(boleto01),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dadosBancarios[0].accessToken}`,
        },
      }
    );

    console.log(response);

    const data = await response.json();

    console.log(data);

    return res.json(data);

    // return res.json({ message: true});
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
