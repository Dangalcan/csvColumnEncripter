const ecsv = require('../csvColumnEncripter/encripter')


function main() {
    ecsv.encriptCsv('users.csv', ['firstname', 'lastname']);
    ecsv.encriptCsv('email_addresses.csv',['address'])    
}

main();