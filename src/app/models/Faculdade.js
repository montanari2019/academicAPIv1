const  { Model, DataTypes }  = require('sequelize');

class Faculdade extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            cep: DataTypes.STRING,
            endereco: DataTypes.STRING,
            bairro: DataTypes.STRING,
            numero: DataTypes.STRING,
            cidade: DataTypes.STRING,
            estado: DataTypes.STRING,

        },
        {
            sequelize,
        },

    ) 
    }

    // Fazendo a associação do campo Associação ID
    static associate(models){
        // this.belongsTo(models.Associacao, {foreignKey: 'id_associacao', as: 'associacao'})
        this.belongsTo(models.Associacao, {foreignKey: 'id_associacao', as: 'associacao'})
    }
}

module.exports = Faculdade