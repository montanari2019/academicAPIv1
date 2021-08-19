module.exports = {
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        freezeTableName: true
    },
};