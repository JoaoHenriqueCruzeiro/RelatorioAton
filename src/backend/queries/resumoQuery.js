const { sql, poolPromise } = require("../db");
const { buscarIdsRelacionados } = require("./produtosQuery");


async function buscarResumoVendas({
  produtosIds = [],
  dataInicial,
  dataFinal,
}) {
  if (!produtosIds.length) {
    return [];
  }

  produtosIds = await buscarIdsRelacionados(produtosIds);

  const pool = await poolPromise;

  const request = pool.request();

  produtosIds.forEach((id, index) => {
    request.input(`produto${index}`, sql.Int, id);
  });

  request.input("dataInicial", sql.DateTime, new Date(dataInicial));

  request.input("dataFinal", sql.DateTime, new Date(dataFinal));

  const placeholders = produtosIds
    .map((_, index) => `@produto${index}`)
    .join(",");

  const result = await request.query(`
    SELECT

      i.CODID,

      MAX(i.DESCRICAOPROD) AS nome,

      SUM(i.QUANT) AS qtd,

      SUM(i.VLR_TOTAL) AS faturamento,

      CASE
        WHEN SUM(i.QUANT) > 0
        THEN SUM(i.VLR_TOTAL) / SUM(i.QUANT)
        ELSE 0
      END AS ticketMedio

    FROM pedido_materiais_itens_cliente i

    INNER JOIN pedido_materiais_cliente p
      ON p.PEDIDO = i.PEDIDO

    WHERE

      i.CODID IN (${placeholders})

      AND p.DATA BETWEEN @dataInicial
                     AND @dataFinal

    GROUP BY

      i.CODID

    ORDER BY

      faturamento DESC
  `);

  return result.recordset;
}

module.exports = {
  buscarResumoVendas,
};
