const dbConfig = {
    server: 'localhost\\MSSQLSERVER01',
    driver: 'msnodesqlv8',
    database: 'localWebChat',
    options:{
        trustedConnection: true,
    }
}

module.exports = dbConfig;