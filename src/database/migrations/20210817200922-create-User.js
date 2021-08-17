const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.createTable('User', { 
       
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
 
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      foto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      foto_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      r_g: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      c_p_f: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     cep: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     endereco: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     bairro: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     numero: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     cidade: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     estado: {
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
     id_associacao:{
       type: sequelize.INTEGER,
       references: { model: 'Associacao', key: 'id' },
       allowNull: false
     },
     
    });
     
  },

  down: async (queryInterface) => {
    
    await queryInterface.dropTable('User');
     
  }
};
