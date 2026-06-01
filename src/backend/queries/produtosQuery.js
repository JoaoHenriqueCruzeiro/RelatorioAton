const { poolPromise, sql } = require("../db");

// ======================================
// BUSCAR PAIS
// ======================================
async function buscarProdutosPais(filtros = {}) {
  try {
    const pool = await poolPromise;

    let query = `
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

      WHERE
        A.pai = 0
        AND A.inativo = 'N'
    `;

    if (filtros.fabricantes?.length) {
      query += `
        AND A.FABRICANTE IN (
          ${filtros.fabricantes.map((f) => `'${f}'`).join(",")}
        )
      `;
    }

    if (filtros.grupos?.length) {
      query += `
        AND A.GRUPO IN (
          ${filtros.grupos.map((g) => `'${g}'`).join(",")}
        )
      `;
    }

    if (filtros.subgrupos?.length) {
      query += `
        AND A.SUBGRUPO IN (
          ${filtros.subgrupos.map((s) => `'${s}'`).join(",")}
        )
      `;
    }

    query += `
      ORDER BY A.descricao
    `;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    console.error(error);

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

async function buscarFabricantes() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT
      FABRICANTE
    FROM materiais
    WHERE
      FABRICANTE IS NOT NULL
      AND FABRICANTE <> ''
    ORDER BY FABRICANTE
  `);

  return result.recordset;
}

async function buscarGrupos() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT
      GRUPO
    FROM materiais
    WHERE
      GRUPO IS NOT NULL
      AND GRUPO <> ''
    ORDER BY GRUPO
  `);

  return result.recordset;
}

module.exports = {
  buscarProdutosPais,

  buscarFilhos,
};
