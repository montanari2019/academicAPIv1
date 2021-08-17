const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('DadoBancario', { 
     id: {
       type: sequelize.INTEGER,
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
     },

     banco:{
       type: Sequelize.STRING,
       allowNull: false,
     },
     agencia:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    conta:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    cod_cedente:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    cod_convenio:{
      type: Sequelize.STRING,
      allowNull: true,
    },
    id_associacao:{
      type: sequelize.INTEGER,
      references: { model: 'Associacao', key: 'id' },
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
    
    });
     
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('DadoBancario');
     
  }
};
