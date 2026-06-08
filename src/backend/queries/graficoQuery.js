const { poolPromise, sql } = require("../db");
const { buscarIdsRelacionados } = require("./produtosQuery");


async function buscarGraficoVendas({
  produtosIds = [],
  dataInicial,
  dataFinal,
  metrica = "quantidade",
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

  const result = await request.query(`
    SELECT

      YEAR(p.DATA) AS ano,

      MONTH(p.DATA) AS mesNumero,

      FORMAT(p.DATA, 'MM/yyyy') AS mes,

      i.CODID,

      m.DESCRICAO AS produto,

      ${campoValor} AS valor

    FROM pedido_materiais_itens_cliente i

    INNER JOIN pedido_materiais_cliente p
      ON p.PEDIDO = i.PEDIDO

    INNER JOIN Materiais m
    ON m.CODID = i.CODID

    WHERE

      i.CODID IN (${placeholders})

      AND p.DATA BETWEEN
        @dataInicial
        AND @dataFinal

    GROUP BY

      YEAR(p.DATA),

      MONTH(p.DATA),

      FORMAT(p.DATA, 'MM/yyyy'),

      i.CODID,

      m.DESCRICAO

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
