const  { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')
const aws = require('aws-sdk');

const s3 = new aws.S3

class User extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
            admin: DataTypes.BOOLEAN,
            foto: DataTypes.STRING,
            foto_url: DataTypes.STRING,
            r_g: DataTypes.STRING,
            c_p_f: DataTypes.STRING,
            telefone: DataTypes.STRING,
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
     // Criptografando a senha do usuário
        this.addHook('beforeSave', async user =>{
            if(user.password){
                user.password_hash = await bcrypt.hash(user.password, 10)
            }
        } )

    }

     // Fazendo a associação do campo Associação ID
     static associate(models){
        this.belongsTo(models.Associacao, {foreignKey: 'id_associacao', as: 'associacao'})
    }

    checkPassword(password){
        return bcrypt.compare(password, this.password_hash)
    }

    s3Delete(key){       
        return s3.deleteObject({Bucket: 'controledeacademicos',Key: key
        }).promise()
        
    }

}

module.exports = User
