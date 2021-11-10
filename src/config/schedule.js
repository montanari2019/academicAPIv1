const DadoBancario = require("../app/models/DadoBancario");
const fetch = require("node-fetch");
const schedule = require("node-schedule");
const CronJob = require("cron").CronJob

exports.refreshToken = () => {
  DadoBancario.findByPk(1).then((dadosBancarios) => {

    const job = schedule.scheduleJob('1 * * * * ' , function () {
        console.log("Função da rotina de 1 minuto")
      var body = `grant_type=refresh_token&refresh_token=${dadosBancarios.refreshToken}`;

      fetch("https://sandbox.sicoob.com.br/token", {
        method: "POST",
        body,
        headers: {
          "Content-type": "www/form-url-encoded",
          Authorization: `Basic ${process.env.TOKEN_BASIC}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
        console.log("GRAVANDO REFRES TOKEN NO BANCO")
          dadosBancarios.update({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        })
        .catch(err => console.error(err));
    });

    console.log("Job next invocation", job.nextInvocation())

  })
};
 exports.jobRefreshToken = async () => {
  const dadosBancarios = await DadoBancario.findByPk(1)

  console.log('BUSCA NO BANCO DE DADOS CONCLUIDA')

  if(!dadosBancarios.refreshToken){
    console.log('Refresh token não existe')
  }

  const job = new CronJob('*/5 * * * * *', () => {
    console.log("REFRESH TOKEN FUNCIONANDO",)
    var body = `grant_type=refresh_token&refresh_token=${dadosBancarios.refreshToken}`;

      fetch("https://sandbox.sicoob.com.br/token", {
        method: "POST",
        body,
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.TOKEN_BASIC}`,
        },
      })
        .then((r) => r.json())
        .then((res) => {
        
          dadosBancarios.update({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          });
          console.log(res)
          console.log("GRAVANDO REFRESH TOKEN NO BANCO")
        })
        .catch(err => console.error(err));
  })
  job.start()
}
