const { poolPromise, sql } = require("../db");

// ======================================
// BUSCAR PAIS
// ======================================
async function buscarProdutosPais(filtros = {}) {
  try {
    const pool = await poolPromise;

    const fabricanteFiltro = filtros.fabricantes?.length
      ? `AND A.fabricante IN (${filtros.fabricantes.join(",")})`
      : "";

    const grupoFiltro = filtros.grupos?.length
      ? `AND A.grupo IN (${filtros.grupos.join(",")})`
      : "";

    const subgrupoFiltro = filtros.subgrupos?.length
      ? `AND A.subgrupo IN (${filtros.subgrupos.join(",")})`
      : "";

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

      WHERE A.pai = 0
      AND A.inativo = 'N'

      ${fabricanteFiltro}
      ${grupoFiltro}
      ${subgrupoFiltro}
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
    SELECT 
      COD_FABRICANTE as 'id', 
      FABRICANTE_DESCR AS 'nome' 
    FROM FABRICANTE_MATERIAIS
    order by nome
  `);

  return result.recordset;
}

async function buscarGrupos() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      CODIGO AS id,
      descricao AS nome
    FROM grupo
    ORDER BY descricao
  `);

  return result.recordset;
}

async function buscarSubgrupos() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT DISTINCT
      SUBGRUPO
    FROM materiais
    WHERE
      SUBGRUPO IS NOT NULL
      AND SUBGRUPO <> ''
    ORDER BY SUBGRUPO
  `);

  return result.recordset;
}

async function buscarSubgruposPorGrupo(grupos) {
  const pool = await poolPromise;

  const lista = grupos.join(",");

  const result = await pool.request().query(`
    SELECT
      codsubgrupo AS id,
      descricao AS nome,
      codgrupo
    FROM subgrupos
    WHERE codgrupo IN (${lista})
    ORDER BY descricao
  `);

  return result.recordset;
}

module.exports = {
  buscarProdutosPais,
  buscarFilhos,
  buscarFabricantes,
  buscarGrupos,
  buscarSubgrupos,
};
