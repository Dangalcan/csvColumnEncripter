const fs = require('fs');
const crypto = require('crypto');
const { Transform } = require('stream');
const csv = require('fast-csv');

async function encriptCsv(csvName, columns){
    let columnsToEncrypt = columns; 
    class EncryptTransform extends Transform {
        constructor() {
            super({ objectMode: true });
        }
    
        _transform(row, encoding, callback) {
            columnsToEncrypt.forEach((column) => {
                if (row[column]) {
                    row[column] = encryptValue(row[column]);
                }
            });
            this.push(row);
            callback();
        }
    }

    function encryptValue(value) {
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + encrypted;
    }

    fs.createReadStream(csvName)
    .pipe(csv.parse({ headers: true }))
    .pipe(new EncryptTransform())
    .pipe(csv.format({ headers: true }))
    .pipe(fs.createWriteStream('encrypted_'+csvName))
    .on('finish', () => {
        console.log('CSV excripted successfully');
    });

}

// columnsToEncrypt = ['firstname', 'lastname']; 
//     fs.createReadStream('users.csv')
//     .pipe(csv.parse({ headers: true }))
//     .pipe(new EncryptTransform())
//     .pipe(csv.format({ headers: true }))
//     .pipe(fs.createWriteStream('encrypted_users.csv'))
//     .on('finish', () => {
//         console.log('CSV excripted successfully');
//     });


module.exports = { encriptCsv };