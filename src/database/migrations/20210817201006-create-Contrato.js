const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.createTable('Contrato', { 
       
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      validade: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      aprovado:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      vigente:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      cancelado:{
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      descricao:{
        type: Sequelize.STRING,
        allowNull: true
      },
      dias_ultilizados:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dias_viagem:{
        type: Sequelize.STRING,
        allowNull: false
      },
      admin_aprovocao:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      mensalidade:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      data_vencimento:{
        type: Sequelize.INTEGER,
        allowNull: false
      },  
     created_at:{
       type: Sequelize.DATE,
       allowNull: false
     },
     updated_at:{
       type: Sequelize.DATE,
       allowNull: false
     },
     id_user:{
       type: sequelize.INTEGER,
       references: { model: 'User', key: 'id' },
       allowNull: false
     },
     id_associacao:{
      type: sequelize.INTEGER,
      references: { model: 'Associacao', key: 'id' },
      allowNull: false
    },
     id_faculdade:{
      type: sequelize.INTEGER,
      references: { model: 'Faculdade', key: 'id' },
      allowNull: false
    },
    });
     
  },

  down: async (queryInterface) => {
    
    await queryInterface.dropTable('Contrato');
     
  }
};