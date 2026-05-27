const sql = require("mssql");

const config = {
  user: "cmc@3664",

  password: "272311210087@A",

  server: "200.187.70.48",

  database: "AmbarCMC",

  port: 1433,

  options: {
    trustServerCertificate: true,

    encrypt: false,
  },

  pool: {
    max: 10,

    min: 0,

    idleTimeoutMillis: 30000,
  },
};

const poolPromise = new sql.ConnectionPool(config)

  .connect()

  .then((pool) => {
    console.log("Conectado SQL Server!");

    return pool;
  })

  .catch((err) => {
    console.error("Erro SQL:", err);
  });

module.exports = {
  sql,
  poolPromise,
};
