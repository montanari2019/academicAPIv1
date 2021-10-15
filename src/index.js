require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");

require("./database/index");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(routes);

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL:
        "https://sandbox.sicoob.com.br/oauth2/authorize?response_type=code&redirect_uri=https://google.com&client_id=Oob9qfkdsDNSAl2hWD43N2oxr58a",
      tokenURL: "https://sandbox.sicoob.com.br/token",
      clientID: "Oob9qfkdsDNSAl2hWD43N2oxr58a",
      clientSecret: "ecKwzvaHxLYBI58b8WwTPYFu220a",
      callbackURL: "http://localhost:3236/auth/example/callback",
    },

    function (accessToken, refreshToken, profile, callback) {
      const object = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile,
        callback: callback,
      };

      console.log(object);
      callback()
    }
  )
);

const port = 3236;

app.listen(process.env.PORT || port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
