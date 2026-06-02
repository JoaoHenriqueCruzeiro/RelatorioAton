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

import { Line, Bar, Doughnut } from "react-chartjs-2";

import { useState } from "react";

import "../styles/graficoVendas.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

export default function GraficoVendas({
  produtosSelecionados = [],

  dados = [],
}) {
  const [chartType, setChartType] = useState("line");

  const [metrica, setMetrica] = useState("quantidade");

  // ====================================================
  // CHART DATA
  // ====================================================
  const chartData = {
    labels: dados.map((item) => item.mes),

    datasets: [
      {
        label: "Quantidade de vendas",

        data: dados.map((item) => item.vendas),

        borderColor: "#3b82f6",

        backgroundColor: "rgba(59,130,246,0.35)",

        pointBackgroundColor: "#ffffff",

        pointBorderColor: "#3b82f6",

        pointRadius: 5,

        pointHoverRadius: 7,

        borderWidth: 3,

        tension: 0.4,

        fill: true,
      },
    ],
  };

  // ====================================================
  // OPTIONS
  // ====================================================
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
          color: "rgba(255,255,255,0.08)",
        },
      },

      y: {
        ticks: {
          color: "#d1d5db",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
    },
  };

  // ====================================================
  // RENDER CHART
  // ====================================================
  function renderChart() {
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={options} />;

      case "doughnut":
        return <Doughnut data={chartData} options={options} />;

      default:
        return <Line data={chartData} options={options} />;
    }
  }

  return (
    <section className="grafico-card">
      <div className="grafico-header">
          <div className="grafico-actions">
            <select
              value={metrica}
              onChange={(e) => setMetrica(e.target.value)}
              className="chart-select"
            >
              <option value="quantidade">
                Quantidade Vendida
              </option>

              <option value="faturamento">
                Faturamento
              </option>
            </select>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="chart-select"
            >
              <option value="line">Linha</option>
              <option value="bar">Barra</option>
              <option value="doughnut">Rosca</option>
            </select>
        </div>
      </div>

      <div className="grafico-container">
        {produtosSelecionados.length === 0 ? (
          <div className="empty-chart">Selecione um produto</div>
        ) : dados.length === 0 ? (
          <div className="empty-chart">Clique em "Consultar Vendas"</div>
        ) : (
          renderChart()
        )}
      </div>
    </section>
  );
}
