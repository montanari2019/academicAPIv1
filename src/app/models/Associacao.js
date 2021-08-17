const  { Model, DataTypes }  = require('sequelize');


class Associacao extends Model{
    static init(sequelize) {
        super.init(
        {
            nome: DataTypes.STRING,
            cnpj: DataTypes.STRING,

        },
        {
            sequelize,
        })
 }

}

module.exports = Associacao


