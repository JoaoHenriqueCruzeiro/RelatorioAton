export async function buscarVendasProdutos(produtosSelecionados) {
  // EXEMPLO MOCKADO
  // depois você troca pela API real

  console.log("Produtos selecionados:", produtosSelecionados);

  // simulação de delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    labels: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
    ],

    valores: [120, 180, 90, 240, 300, 280],
  };
}