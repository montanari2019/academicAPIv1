const jws = require('jsonwebtoken')
const { promisify } = require('util')

module.exports = async (req, res, next) => {

    const tokenHeader = req.headers.authorization

    if(!tokenHeader){
        return res.status(401).json({error: 'Token não existe'})
    }

    const [, token] = tokenHeader.split(' ')

    try {

        const decoded = await promisify(jws.verify)(token, process.env.HASH)
        req.userId = decoded.id
         return next()

    }catch (err){
        return res.status(401).json({ erro: 'Token invalid'})
    }

}