import { useState, useEffect } from "react";

import {
  Provider,
  defaultTheme,
  Flex,
  View,
  Heading,
  Content,
  Text,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  ProgressCircle,
} from "@adobe/react-spectrum";

import "./styles/App.css";

import DateComponent from "./components/dateComponent.jsx";
import Modal from "./components/modalTemas.jsx";
import SidebarProdutos from "./components/sidebarProdutos.jsx";
import GraficoVendas from "./components/GraficoVendas";
import ModalFiltros from "./components/modalFiltros";
import { today, getLocalTimeZone } from "@internationalized/date";
import { trocaTema } from "./utils/trocatema";

// ======================================================
// TESTE WINDOW.API
// ======================================================
// console.log("WINDOW API:", window.api);

// ======================================================
// TEMAS
// ======================================================
const availableThemes = {
  light: "dx.light",
  dark: "dx.dark",
  darkViolet: "dx.darkviolet",
};

export default function App() {
  // ======================================================
  // STATES
  // ======================================================
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [theme, setTheme] = useState(availableThemes.light);

  const [brandColor, setBrandColor] = useState("#7c3aed");

  const [produtos, setProdutos] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [dadosTabela, setDadosTabela] = useState([]);

  const [dadosGrafico, setDadosGrafico] = useState([]);

  const [loadingProdutos, setLoadingProdutos] = useState(true);

  const [loadingTabela, setLoadingTabela] = useState(false);

  const [metricaGrafico, setMetricaGrafico] = useState("quantidade");

  const [dataInicial, setDataInicial] = useState(today(getLocalTimeZone()));

  const [dataFinal, setDataFinal] = useState(today(getLocalTimeZone()));

  const [isFiltroOpen, setIsFiltroOpen] = useState(false);

  const [agruparPorPai, setAgruparPorPai] = useState(false);

  const [filtros, setFiltros] = useState({
    fabricantes: [],

    grupos: [],

    subgrupos: [],
  });

  const [selectedIds, setSelectedIds] = useState([]);

  // ======================================================
  // TEMA
  // ======================================================
  useEffect(() => {
    trocaTema(theme);
  }, [theme]);

  // ======================================================
  // CARREGA PRODUTOS
  // ======================================================
  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      if (!window.api) return;

      console.time("buscarProdutosPais");

      const response = await window.api.buscarProdutosPais(filtros);

      console.timeEnd("buscarProdutosPais");

      console.time("setProdutos");

      requestAnimationFrame(() => {
        setProdutos(response);
        setLoadingProdutos(false);

        console.timeEnd("setProdutos");
      });
    } catch (error) {
      console.error(error);
      setLoadingProdutos(false);
    }
  }

  function converterData(dateValue) {
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  }

  // ======================================================
  // CONSULTAR VENDAS
  // ======================================================
  async function consultarVendas() {
    try {
      let produtosIds = [];

      if (selectedProducts.length) {
        produtosIds = selectedProducts.map((produto) => produto.id);
      } else {
        const possuiFiltros =
          filtros.fabricantes.length ||
          filtros.grupos.length ||
          filtros.subgrupos.length;

        if (!possuiFiltros) {
          alert("Selecione ao menos um produto ou filtro");
          return;
        }

        produtosIds = await window.api.buscarProdutosPorFiltro(filtros);
      }

      // console.log(dataInicial);
      // console.log(dataFinal);
      // console.log(typeof dataInicial);

      setLoadingTabela(true);

      // console.log("PRODUTOS SELECIONADOS:");
      // console.log(selectedProducts);

      // ==================================
      // TABELA
      // ==================================
      // const tabela = await window.api.buscarVendas({
      //   produtosIds,

      //   dataInicial,

      //   dataFinal,
      // });

      // setDadosTabela(tabela);

      // ==================================
      // GRÁFICO
      // ==================================

      const formatarData = (d) =>
        `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

      const grafico = await window.api.buscarGraficoVendas({
        produtosIds,

        dataInicial: converterData(dataInicial),

        dataFinal: converterData(dataFinal),

        metrica: metricaGrafico,

        agruparPorPai,
      });

      console.log("DADOS GRAFICO:", grafico);

      setDadosGrafico(grafico);

      const resumo = await window.api.buscarResumoVendas({
        produtosIds,

        dataInicial: converterData(dataInicial),

        dataFinal: converterData(dataFinal),
      });

      setDadosTabela(resumo);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTabela(false);
    }
  }

  // ======================================================
  // MÉTRICAS
  // ======================================================
  const faturamentoTotal = dadosTabela.reduce(
    (acc, item) => acc + Number(item.faturamento || 0),

    0,
  );

  const quantidadeTotal = dadosTabela.reduce(
    (acc, item) => acc + Number(item.qtd || 0),

    0,
  );

  const produtoDestaque =
    dadosTabela.length > 0
      ? [...dadosTabela].sort(
          (a, b) => Number(b.faturamento) - Number(a.faturamento),
        )[0]
      : null;

  const ticketMedio =
    quantidadeTotal > 0 ? faturamentoTotal / quantidadeTotal : 0;

  // ======================================================
  // SPECTRUM
  // ======================================================
  const spectrumColorScheme = theme.includes("dark") ? "dark" : "light";

  async function aplicarFiltros(novosFiltros) {
    setFiltros(novosFiltros);

    setLoadingProdutos(true);

    requestAnimationFrame(async () => {
      try {
        const produtosFiltrados =
          await window.api.buscarProdutosPais(novosFiltros);

        setProdutos(produtosFiltrados);
      } finally {
        setLoadingProdutos(false);
      }
    });
  }

  async function limparFiltros() {
    const filtrosVazios = {
      fabricantes: [],
      grupos: [],
      subgrupos: [],
    };

    setFiltros(filtrosVazios);

    setSelectedIds([]);
    setSelectedProducts([]);

    setDadosGrafico([]);
    setDadosTabela([]);

    setLoadingProdutos(true);

    try {
      const produtos = await window.api.buscarProdutosPais(filtrosVazios);

      setProdutos(produtos);
    } finally {
      setLoadingProdutos(false);
    }
  }

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <Provider theme={defaultTheme} colorScheme={spectrumColorScheme}>
      {/* ================================================= */}
      {/* TOPO */}
      {/* ================================================= */}
      <section id="topo">
        <p>Selecione o Período:</p>
        <DateComponent value={dataInicial} onChange={setDataInicial} />
        até
        <DateComponent value={dataFinal} onChange={setDataFinal} />
        {/* =========================================== */}
        {/* BOTÃO CONSULTAR */}
        {/* =========================================== */}
        <button className="action-button secondary" onClick={consultarVendas}>
          Consultar Vendas
        </button>
        <button
          className="action-button secondary"
          onClick={() => {
            setSelectedIds([]);
            setSelectedProducts([]);
          }}
        >
          Limpar Seleção
        </button>
        {/* <button
          className="theme-button"
          style={{
            backgroundColor: brandColor,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Temas
        </button> */}
        <button
          className="action-button secondary"
          onClick={() => setIsFilterModalOpen(true)}
        >
          Filtros
        </button>
        <button className="action-button secondary" onClick={limparFiltros}>
          Limpar Filtros
        </button>
      </section>

      {/* ================================================= */}
      {/* DASHBOARD */}
      {/* ================================================= */}
      <section id="dashboard-container">
        {/* ============================================= */}
        {/* BLOCO SUPERIOR */}
        {/* ============================================= */}
        <div className="bloco-superior">
          {/* ========================================= */}
          {/* SIDEBAR */}
          {/* ========================================= */}
          {loadingProdutos ? (
            <Flex width="320px" alignItems="center" justifyContent="center">
              <ProgressCircle
                aria-label="Carregando produtos"
                isIndeterminate
              />
            </Flex>
          ) : (
            <SidebarProdutos
              produtos={produtos}
              setProdutos={setProdutos}
              onSelectionChange={setSelectedProducts}
              selected={selectedIds}
              setSelected={setSelectedIds}
            />
          )}

          {/* ========================================= */}
          {/* GRÁFICO */}
          {/* ========================================= */}
          <main className="content-grafico">
            <GraficoVendas
              produtosSelecionados={selectedProducts}
              dados={dadosGrafico}
              metrica={metricaGrafico}
              setMetrica={setMetricaGrafico}
              agruparPorPai={agruparPorPai}
              setAgruparPorPai={setAgruparPorPai}
            />
          </main>
        </div>

        {/* ============================================= */}
        {/* BLOCO INFERIOR */}
        {/* ============================================= */}
        <div className="bloco-inferior">
          {/* ========================================= */}
          {/* MÉTRICAS */}
          {/* ========================================= */}
          <Flex direction="row" gap="size-200" marginBottom="size-250" wrap>
            {/* FATURAMENTO */}

            <View
              backgroundColor="static-gray-100"
              padding="size-200"
              borderRadius="medium"
              flex
            >
              <Heading level={4} margin={0}>
                Produto Destaque
              </Heading>

              <Content>
                <Text size="XL" weight="bold">
                  {produtoDestaque?.nome || "-"}
                </Text>
              </Content>
            </View>

            {/* QUANTIDADE */}
            <View
              backgroundColor="static-gray-100"
              padding="size-200"
              borderRadius="medium"
              flex
            >
              <Heading level={4} margin={0}>
                Qtd. Total Vendida
              </Heading>

              <Content>
                <Text size="XL" weight="bold">
                  {quantidadeTotal} un
                </Text>
              </Content>
            </View>

            {/* DESTAQUE */}

            <View
              backgroundColor="static-gray-100"
              padding="size-200"
              borderRadius="medium"
              flex
            >
              <Heading level={4} margin={0}>
                Faturamento Total
              </Heading>

              <Content>
                <Text size="XL" weight="bold">
                  {faturamentoTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </Content>
            </View>

            <View
              backgroundColor="static-gray-100"
              padding="size-200"
              borderRadius="medium"
              flex
            >
              <Heading level={4} margin={0}>
                Ticket Médio
              </Heading>

              <Content>
                <Text size="XL" weight="bold">
                  {ticketMedio.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </Content>
            </View>
          </Flex>

          {/* ========================================= */}
          {/* TABELA */}
          {/* ========================================= */}
          <div className="tabela-wrapper">
            <TableView aria-label="Tabela de vendas">
              <TableHeader>
                <Column key="nome">Produto</Column>

                <Column key="qtd">Quantidade</Column>

                <Column key="faturamento">Faturamento</Column>

                <Column key="ticket">Ticket Médio</Column>
              </TableHeader>

              <TableBody>
                {loadingTabela ? (
                  <Row>
                    <Cell>Carregando...</Cell>

                    <Cell></Cell>

                    <Cell></Cell>
                    <Cell></Cell>
                  </Row>
                ) : dadosTabela.length > 0 ? (
                  dadosTabela.map((item) => (
                    <Row key={item.id}>
                      <Cell>{item.nome}</Cell>

                      <Cell>{item.qtd} un</Cell>

                      <Cell>
                        {Number(item.faturamento).toLocaleString("pt-BR", {
                          style: "currency",

                          currency: "BRL",
                        })}
                      </Cell>

                      <Cell>
                        {Number(item.ticketMedio).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Cell>
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Cell>Nenhum dado encontrado</Cell>

                    <Cell></Cell>

                    <Cell></Cell>
                    <Cell></Cell>
                  </Row>
                )}
              </TableBody>
            </TableView>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTheme={theme}
        selectedColor={brandColor}
        onChangeTheme={setTheme}
        onChangeColor={setBrandColor}
      />

      <ModalFiltros
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filtros={filtros}
        setFiltros={setFiltros}
        onSalvar={aplicarFiltros}
      />
    </Provider>
  );
}
