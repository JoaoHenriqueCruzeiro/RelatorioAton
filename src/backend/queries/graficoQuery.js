const { poolPromise, sql } = require("../db");
const { buscarIdsRelacionados } = require("./produtosQuery");

async function buscarGraficoVendas({
  produtosIds = [],
  dataInicial,
  dataFinal,
  metrica = "quantidade",
  agruparPorPai = false,
}) {
  if (!produtosIds.length) {
    return [];
  }

  produtosIds = await buscarIdsRelacionados(produtosIds);

  const pool = await poolPromise;

  const request = pool.request();

  request.input("dataInicial", sql.DateTime, new Date(dataInicial));

  request.input("dataFinal", sql.DateTime, new Date(dataFinal));

  produtosIds.forEach((id, index) => {
    request.input(`id${index}`, sql.Int, Number(id));
  });

  const placeholders = produtosIds.map((_, index) => `@id${index}`).join(",");

  const campoValor =
    metrica === "faturamento" ? "SUM(i.VLR_TOTAL)" : "SUM(i.QUANT)";

  const campoProduto = agruparPorPai
    ? `
      pai.CODID AS produtoId,
      pai.DESCRICAO AS produto
    `
    : `
      filho.CODID AS produtoId,
      filho.DESCRICAO AS produto
    `;

  const groupByProduto = agruparPorPai
    ? `
      pai.CODID,
      pai.DESCRICAO
    `
    : `
      filho.CODID,
      filho.DESCRICAO
    `;

  const result = await request.query(`
  SELECT

    YEAR(p.DATA) AS ano,

    MONTH(p.DATA) AS mesNumero,

    FORMAT(p.DATA, 'MM/yyyy') AS mes,

    ${campoProduto},

    ${campoValor} AS valor

  FROM pedido_materiais_itens_cliente i

  INNER JOIN pedido_materiais_cliente p
    ON p.PEDIDO = i.PEDIDO

  INNER JOIN Materiais filho
    ON filho.CODID = i.CODID

  LEFT JOIN Materiais pai
    ON pai.CODID =
      CASE
        WHEN filho.PAI = 0
        THEN filho.CODID
        ELSE filho.PAI
      END

  WHERE

    i.CODID IN (${placeholders})

    AND p.DATA BETWEEN
      @dataInicial
      AND @dataFinal

  GROUP BY

    YEAR(p.DATA),

    MONTH(p.DATA),

    FORMAT(p.DATA, 'MM/yyyy'),

    ${groupByProduto}

  ORDER BY

    YEAR(p.DATA),

    MONTH(p.DATA)
`);

  console.log("Produtos:", produtosIds);
  console.log("Data Inicial:", dataInicial);
  console.log("Data Final:", dataFinal);
  console.log(result.recordset);
  return result.recordset;
}

module.exports = {
  buscarGraficoVendas,
};
