import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Line,
  Bar,
  Doughnut,
} from "react-chartjs-2";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "../styles/graficoVendas.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function GraficoVendas({
  produtosSelecionados = [],
}) {

  const [chartType,
  setChartType] = useState("line");

  const [dados,
  setDados] = useState([]);

  useEffect(() => {

  console.log(
    "Produtos selecionados:",
    produtosSelecionados
  );

  if (
    !produtosSelecionados ||
    produtosSelecionados.length === 0
  ) {

    setDados([]);

    return;
  }

  const mock = [

    {
      mes: "Jan",
      vendas: 120,
    },

    {
      mes: "Fev",
      vendas: 180,
    },

    {
      mes: "Mar",
      vendas: 90,
    },

    {
      mes: "Abr",
      vendas: 240,
    },

    {
      mes: "Mai",
      vendas: 300,
    },

    {
      mes: "Jun",
      vendas: 280,
    },

  ];

  const quantidadeProdutos =
    produtosSelecionados.length;

  const resultado = mock.map(
    (item) => ({

      ...item,

      vendas:
        item.vendas *
        quantidadeProdutos,

    })
  );

  console.log(
    "Resultado gráfico:",
    resultado
  );

  setDados(resultado);

}, [produtosSelecionados]);

 const chartData = {

  labels: dados.map(
    (item) => item.mes
  ),

  datasets: [
    {
      label: "Quantidade de vendas",

      data: dados.map(
        (item) => item.vendas
      ),

      borderColor: "#3b82f6",

      backgroundColor:
        "rgba(59,130,246,0.35)",

      pointBackgroundColor:
        "#ffffff",

      pointBorderColor:
        "#3b82f6",

      pointRadius: 5,

      pointHoverRadius: 7,

      borderWidth: 3,

      tension: 0.4,

      fill: true,
    },
  ],
};

const options = {

  responsive: true,

  maintainAspectRatio: false,

  plugins: {

    legend: {

      labels: {

        color: "#ffffff",

        font: {

          size: 14,

        },

      },

    },

  },

  scales: {

    x: {

      ticks: {

        color: "#d1d5db",

      },

      grid: {

        color:
          "rgba(255,255,255,0.08)",

      },

    },

    y: {

      ticks: {

        color: "#d1d5db",

      },

      grid: {

        color:
          "rgba(255,255,255,0.08)",

      },

    },

  },

};



  function renderChart() {

    switch (chartType) {

      case "bar":
        return (
          <Bar
            data={chartData}
            options={options}
          />
        );

      case "doughnut":
        return (
          <Doughnut
            data={chartData}
            options={options}
          />
        );

      default:
        return (
          <Line
            data={chartData}
            options={options}
          />
        );
    }
  }

  return (

    <section className="grafico-card">

      <div className="grafico-header">

        <div>
          <h2>
            Vendas dos Produtos
          </h2>

          <p>
            Últimos 6 meses
          </p>
        </div>

        <select
          value={chartType}

          onChange={(e) =>
            setChartType(
              e.target.value
            )
          }

          className="chart-select"
        >

          <option value="line">
            Linha
          </option>

          <option value="bar">
            Barra
          </option>

          <option value="doughnut">
            Rosca
          </option>

        </select>

      </div>

      <div className="grafico-container">

        {produtosSelecionados.length === 0 ? (

          <div className="empty-chart">
            Selecione um produto
          </div>

        ) : (

          renderChart()

        )}

      </div>

    </section>
  );
}