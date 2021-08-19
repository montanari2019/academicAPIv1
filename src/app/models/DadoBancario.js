const  { Model, DataTypes }  = require('sequelize')

class DadoBancario extends Model {
    static init(sequelize) {
        super.init({
            banco: DataTypes.STRING,
            agencia: DataTypes.STRING,
            conta: DataTypes.STRING,
            cod_cedente: DataTypes.STRING,
            cod_convenio: DataTypes.STRING,
                
        },
        {
            sequelize,
        })     
        return this
    }

    static associate(models){
        // this.belongsTo(models.Associacao, {foreignKey: 'id_associacao', as: 'associacao'})
        this.belongsTo(models.Associacao, {foreignKey: 'id_associacao', as: 'associacao'})
    }
}

module.exports = DadoBancario
