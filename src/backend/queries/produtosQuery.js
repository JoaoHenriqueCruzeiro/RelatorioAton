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

        (
          SELECT COUNT(*)
          FROM materiais x
          WHERE
            x.pai = A.codid
            AND x.inativo = 'N'
        ) AS childrenCount

      FROM materiais A

      WHERE A.pai = 0
      AND A.inativo = 'N'

      ${fabricanteFiltro}
      ${grupoFiltro}
      ${subgrupoFiltro}
    `;

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

            (
              SELECT COUNT(*)
              FROM materiais x
              WHERE
                x.pai = A.codid
                AND x.inativo = 'N'
            ) AS childrenCount

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

async function buscarIdsRelacionados(ids = []) {
  const pool = await poolPromise;

  const request = pool.request();

  ids.forEach((id, i) => {
    request.input(`id${i}`, sql.Int, id);
  });

  const placeholders = ids.map((_, i) => `@id${i}`).join(",");

  const result = await request.query(`
    WITH arvore AS (

      SELECT
        codid,
        pai

      FROM materiais

      WHERE codid IN (${placeholders})

      UNION ALL

      SELECT
        m.codid,
        m.pai

      FROM materiais m

      INNER JOIN arvore a
        ON m.pai = a.codid

      WHERE m.inativo = 'N'
    )

    SELECT DISTINCT codid
    FROM arvore
  `);

  return result.recordset.map((x) => x.codid);
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
      CODIGO_SUBGRUPO AS id,
      DESCRICAO AS nome
    FROM SUB_GRUPO
    WHERE
      CODIGO_SUBGRUPO IS NOT NULL
      AND CODIGO_SUBGRUPO <> ''
    ORDER BY DESCRICAO
  `);

  return result.recordset;
}

async function buscarProdutosPorFiltro(filtros) {
  const produtos = await buscarProdutosPais(filtros);

  return produtos.map((p) => p.id);
}

async function buscarSubgruposPorGrupo(grupos) {
  const pool = await poolPromise;

  const lista = grupos.join(",");

  const result = await pool.request().query(`
    SELECT
      CODIGO_SUBGRUPO AS id,
      DESCRICAO AS nome,
      CODIGO_GRUPO
    FROM SUB_GRUPO
    WHERE CODIGO_GRUPO IN (${lista})
    ORDER BY DESCRICAO
  `);

  return result.recordset;
}

async function buscarTodosProdutosPesquisa() {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      codid AS id,
      descricao AS nome
    FROM materiais
    WHERE inativo = 'N'
    ORDER BY descricao
  `);

  return result.recordset;
}

module.exports = {
  buscarProdutosPais,
  buscarFilhos,
  buscarIdsRelacionados,
  buscarFabricantes,
  buscarGrupos,
  buscarSubgrupos,
  buscarSubgruposPorGrupo,
  buscarTodosProdutosPesquisa,
  buscarProdutosPorFiltro,
};