module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'admin',
    database: 'academic',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
    },
};