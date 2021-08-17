const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('Associacao', { 
     id: {
       type: sequelize.INTEGER,
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
     },
     nome:{
       type: Sequelize.STRING,
       allowNull: false,
     },

     cnpj:{
       type: Sequelize.STRING,
       allowNull: false,
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
    await queryInterface.dropTable('Associacao');
     
  }
};
