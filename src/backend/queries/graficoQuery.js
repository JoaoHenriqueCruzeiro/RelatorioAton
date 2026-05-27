const db = require("../db");

// ======================================
// GRÁFICO VENDAS
// ======================================
async function buscarGraficoVendas(
  produtosIds = [],

  dataInicial,

  dataFinal,
) {
  if (!produtosIds.length) {
    return [];
  }

  const placeholders = produtosIds.map(() => "?").join(",");

  const [rows] = await db.query(
    `
    SELECT

      DATE_FORMAT(
        data_venda,
        '%m/%Y'
      ) AS mes,

      SUM(valor_total) AS vendas

    FROM vendas

    WHERE produto_id
      IN (${placeholders})

    AND data_venda
      BETWEEN ? AND ?

    GROUP BY

      YEAR(data_venda),

      MONTH(data_venda)

    ORDER BY

      YEAR(data_venda),

      MONTH(data_venda)
    `,

    [...produtosIds, dataInicial, dataFinal],
  );

  return rows;
}

module.exports = {
  buscarGraficoVendas,
};
