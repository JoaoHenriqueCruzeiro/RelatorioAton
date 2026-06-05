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

import { Line, Bar } from "react-chartjs-2";
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

  console.log("GRAFICO RECEBEU:", dados);

  // ==========================================
  // MESES
  // ==========================================
  const meses = [...new Set(dados.map((item) => item.mes))];

  // ==========================================
  // PRODUTOS
  // ==========================================
  const produtos = [...new Set(dados.map((item) => item.produto))];

  const cores = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
  ];

  // ==========================================
  // DATASETS
  // ==========================================
  const datasets = produtos.map((produto, index) => ({
    label: produto,

    data: meses.map((mes) => {
      const registro = dados.find(
        (item) => item.mes === mes && item.produto === produto,
      );

      return Number(registro?.valor || 0);
    }),

    borderColor: cores[index % cores.length],

    backgroundColor: cores[index % cores.length],

    borderWidth: 3,

    tension: 0.4,

    fill: true,
  }));

  const chartData = {
    labels: meses,
    datasets,
  };

  // ==========================================
  // ROSCA
  // ==========================================
  const doughnutData = {
    labels: produtos,

    datasets: [
      {
        data: produtos.map((produto) => {
          return dados
            .filter((item) => item.produto === produto)
            .reduce((acc, item) => acc + Number(item.valor || 0), 0);
        }),

        backgroundColor: produtos.map(
          (_, index) => cores[index % cores.length],
        ),
      },
    ],
  };

  // ==========================================
  // OPTIONS
  // ==========================================
  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#ffffff",

          font: {
            size: 12,
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

  const stackedOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#ffffff",
        },
      },
    },

    scales: {
      x: {
        stacked: true,

        ticks: {
          color: "#d1d5db",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },

      y: {
        stacked: true,

        ticks: {
          color: "#d1d5db",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
    },
  };

  // ==========================================
  // RENDER
  // ==========================================
  function renderChart() {
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={options} />;

      case "stacked":
        return <Line data={chartData} options={stackedOptions} />;

      default:
        return <Line data={chartData} options={options} />;
    }
  }

  return (
    <section className="grafico-card">
      <div className="grafico-header">
        <div>
          <h2>Vendas dos Produtos</h2>

          <p>
            {metrica === "quantidade" ? "Quantidade Vendida" : "Faturamento"}
          </p>
        </div>

        <div className="grafico-actions">
          <select
            value={metrica}
            onChange={(e) => setMetrica(e.target.value)}
            className="chart-select"
          >
            <option value="quantidade">Quantidade Vendida</option>

            <option value="faturamento">Faturamento</option>
          </select>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="chart-select"
          >
            <option value="line">Linha</option>
            <option value="bar">Barra</option>
            <option value="stacked">Área Empilhada</option>
          </select>
        </div>
      </div>

      <div className="grafico-container">
        {produtosSelecionados.length === 0 ? (
          <div className="empty-chart">Selecione um produto</div>
        ) : dados.length === 0 ? (
          <div className="empty-chart">Nenhum dado encontrado</div>
        ) : (
          renderChart()
        )}
      </div>
    </section>
  );
}
