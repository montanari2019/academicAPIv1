const  { Model, DataTypes }  = require('sequelize');

class Contrato extends Model {
    static init(sequelize) {
        super.init({
            validade: DataTypes.DATE,
            aprovado: DataTypes.BOOLEAN,
            vigente: DataTypes.BOOLEAN,
            cancelado: DataTypes.BOOLEAN,
            descricao: DataTypes.STRING,
            dias_ultilizados: DataTypes.INTEGER,
            dias_viagem: DataTypes.STRING,
            admin_aprovocao: DataTypes.STRING,
            mensalidade: DataTypes.FLOAT,
            data_vencimento: DataTypes.INTEGER,
   
            
        },

        {
            sequelize,
        },

    ) 
     
       return this
    }

    // Fazendo a associação do campo Associação ID
    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'id_user', as: 'user'}),
        this.belongsTo(models.Associacao, {foreignKey: 'id_associacao', as: 'associacao'}),
        this.belongsTo(models.Faculdade, {foreignKey: 'id_faculdade', as: 'faculdade'})
    }
}

module.exports = Contrato