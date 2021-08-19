const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageType = {
    local: multer.diskStorage({
        destination: (req, res, cb) => {
            cb(null, path.resolve(__dirname, '..', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (error, hash) => {
                if(error){
                    cb(error)
                }

                file.key =  `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
        }
    }),

    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'controledeacademicos',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: ( req, file, cb) =>{
             crypto.randomBytes(16, (error, hash) => {
                    if(error){
                        cb(error)
                    }
    
                    const fileName =  `${hash.toString('hex')}-${file.originalname}`
    
                    cb(null, fileName)
                })
            
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', 'uploads'),
    storage: storageType['s3'],
    limits:{

        fileSize: 2 * 1024 * 1024,

    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/pjpeg',
        ]

        if( allowedMimes.includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(new Error('Tipo de arquivo inválido'))
        }
    }
}