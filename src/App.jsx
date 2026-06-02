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
import { trocaTema } from "./utils/trocatema";

// ======================================================
// TESTE WINDOW.API
// ======================================================
console.log("WINDOW API:", window.api);

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

  const [dataInicial, setDataInicial] = useState(new Date());

  const [dataFinal, setDataFinal] = useState(new Date());

  const [isFiltroOpen, setIsFiltroOpen] = useState(false);

  const [filtros, setFiltros] = useState({
    fabricantes: [],

    grupos: [],

    subgrupos: [],
  });

  // ======================================================
  // TEMA
  // ======================================================
  useEffect(() => {
    trocaTema(theme);
  }, [theme]);

  // ======================================================
  // TESTE IPC
  // ======================================================
  useEffect(() => {
    async function testeIPC() {
      try {
        console.log("Tentando acessar window.api...");

        if (!window.api) {
          console.error("window.api está undefined");
          return;
        }

        console.log("window.api carregou!");

        const teste = await window.api.buscarProdutosPais();

        console.log("Resposta IPC:", teste);
      } catch (error) {
        console.error("Erro IPC:", error);
      }
    }

    testeIPC();
  }, []);

  // ======================================================
  // CARREGA PRODUTOS
  // ======================================================
  useEffect(() => {
    async function carregarProdutos() {
      try {
        console.log("WINDOW API:", window.api);

        setLoadingProdutos(true);

        if (!window.api) {
          console.error("window.api undefined");

          return;
        }

        console.log("Tentando buscar produtos...");

        const response = await window.api.buscarProdutosPais(filtros);

        console.log("RESPOSTA IPC:", response);

        setProdutos(response);
      } catch (error) {
        console.error("ERRO AO CARREGAR PRODUTOS:");

        console.error(error);
      } finally {
        setLoadingProdutos(false);
      }
    }

    carregarProdutos();
  }, []);

  // ======================================================
  // CONSULTAR VENDAS
  // ======================================================
  async function consultarVendas() {
    try {
      if (!selectedProducts.length) {
        alert("Selecione ao menos um produto");

        return;
      }

      setLoadingTabela(true);

      const produtosIds = selectedProducts.map((p) => p.codid);

      // ==================================
      // TABELA
      // ==================================
      const tabela = await window.api.buscarVendas({
        produtosIds,

        dataInicial,

        dataFinal,
      });

      setDadosTabela(tabela);

      // ==================================
      // GRÁFICO
      // ==================================
      const grafico = await window.api.buscarGraficoVendas({
        produtosIds,

        dataInicial,

        dataFinal,
      });

      setDadosGrafico(grafico);
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

  // ======================================================
  // SPECTRUM
  // ======================================================
  const spectrumColorScheme = theme.includes("dark") ? "dark" : "light";

  async function aplicarFiltros(novosFiltros) {
    setFiltros(novosFiltros);

    setLoadingProdutos(true);

    try {
      const produtosFiltrados =
        await window.api.buscarProdutosPais(novosFiltros);

      setProdutos(produtosFiltrados);
    } finally {
      setLoadingProdutos(false);
    }

    console.log("FILTROS ENVIADOS", novosFiltros);
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
        <button className="consultar-button" onClick={consultarVendas}>
          Consultar Vendas
        </button>
        <button
          className="theme-button"
          style={{
            backgroundColor: brandColor,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Temas
        </button>
        <button
          className="filter-button"
          onClick={() => setIsFilterModalOpen(true)}
        >
          Filtros
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
            />
          )}

          {/* ========================================= */}
          {/* GRÁFICO */}
          {/* ========================================= */}
          <main className="content-grafico">
            <GraficoVendas
              produtosSelecionados={selectedProducts}
              dados={dadosGrafico}
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
                Produto Destaque
              </Heading>

              <Content>
                <Text size="XL" weight="bold">
                  {produtoDestaque?.nome || "-"}
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

                <Column key="qtd" align="end">
                  Qtd Vendida
                </Column>

                <Column key="faturamento" align="end">
                  Faturamento
                </Column>
              </TableHeader>

              <TableBody>
                {loadingTabela ? (
                  <Row>
                    <Cell>Carregando...</Cell>

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
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Cell>Nenhum dado encontrado</Cell>

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
