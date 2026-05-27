const { poolPromise, sql } = require("../db");

// ======================================
// BUSCAR PAIS
// ======================================
async function buscarProdutosPais() {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`

          SELECT

            A.codid AS id,

            NULL AS parentId,

            A.descricao AS nome,

            CAST(
              CASE
                WHEN EXISTS (
                  SELECT 1
                  FROM materiais x
                  WHERE x.pai = A.codid
                )
                THEN 1
                ELSE 0
              END
            AS BIT) AS hasChildren

          FROM materiais A

          WHERE A.pai = 0
          AND A.inativo = 'N'

          ORDER BY
            A.descricao

        `);

    return result.recordset;
  } catch (error) {
    console.error("Erro buscarProdutosPais:", error);

    return [];
  }
}

// ======================================
// BUSCAR FILHOS
// ======================================
async function buscarFilhos(paiId) {
  try {
    const pool = await poolPromise;

    const result = await pool

      .request()

      .input("pai", sql.Int, paiId).query(`

          SELECT

            A.codid AS id,

            A.pai AS parentId,

            A.descricao AS nome,

            CAST(
              CASE
                WHEN EXISTS (
                  SELECT 1
                  FROM materiais x
                  WHERE x.pai = A.codid
                )
                THEN 1
                ELSE 0
              END
            AS BIT) AS hasChildren

          FROM materiais A

          WHERE A.pai = @pai
          AND A.inativo = 'N'

          ORDER BY
            A.descricao

        `);

    return result.recordset;
  } catch (error) {
    console.error("Erro buscarFilhos:", error);

    return [];
  }
}

module.exports = {
  buscarProdutosPais,

  buscarFilhos,
};
