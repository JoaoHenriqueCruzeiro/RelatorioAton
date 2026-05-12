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

import { useEffect, useMemo, useState } from "react";

import { buscarVendasProdutos } from "../services/vendasService";

import "./graficoVendas.css";

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

export default function GraficoVendas({ produtosSelecionados = [] }) {
  const [loading, setLoading] = useState(false);

  const [chartType, setChartType] = useState("line");

  const [dados, setDados] = useState({
    labels: [],
    valores: [],
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const response = await buscarVendasProdutos(
          produtosSelecionados
        );

        setDados(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [produtosSelecionados]);

  const chartData = useMemo(() => {
    return {
      labels: dados.labels,

      datasets: [
        {
          label: "Quantidade de vendas",

          data: dados.valores,

          borderWidth: 2,

          tension: 0.4,

          fill: true
        }]
    }
})}