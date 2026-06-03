const db = require("../db");

async function buscarGraficoVendas({
  produtosIds = [],
  dataInicial,
  dataFinal,
  metrica = "quantidade",
}) {
  if (!produtosIds.length) {
    return [];
  }

  const placeholders = produtosIds.map(() => "?").join(",");

  const campoValor =
    metrica === "faturamento" ? "SUM(i.VLR_TOTAL)" : "SUM(i.QUANT)";

  const [rows] = await db.query(
    `
    SELECT
      DATE_FORMAT(
        p.DATA,
        '%m/%Y'
      ) AS mes,

      i.CODID,

      i.DESCRICAOPROD AS produto,

      ${campoValor} AS valor

    FROM pedido_materiais_itens_cliente i

    INNER JOIN pedido_materiais_cliente p
      ON p.PEDIDO = i.PEDIDO

    WHERE
      i.CODID IN (${placeholders})

      AND DATE(p.DATA)
        BETWEEN DATE(?) AND DATE(?)

    GROUP BY
      YEAR(p.DATA),
      MONTH(p.DATA),
      i.CODID,
      i.DESCRICAOPROD

    ORDER BY
      YEAR(p.DATA),
      MONTH(p.DATA),
      i.DESCRICAOPD
    `,
    [...produtosIds, dataInicial, dataFinal],
  );

  return rows;
}

module.exports = {
  buscarGraficoVendas,
};
