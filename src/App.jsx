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

import { trocaTema } from "./utils/trocatema";

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

  const [theme, setTheme] = useState(availableThemes.light);

  const [brandColor, setBrandColor] = useState("#7c3aed");

  // Produtos árvore
  const [produtos, setProdutos] = useState([]);

  // Produtos selecionados
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Dados tabela
  const [dadosTabela, setDadosTabela] = useState([]);

  // Loading
  const [loadingProdutos, setLoadingProdutos] = useState(true);

  const [loadingTabela, setLoadingTabela] = useState(false);

  // Datas
  const [dataInicial, setDataInicial] = useState(new Date());

  const [dataFinal, setDataFinal] = useState(new Date());

  // ======================================================
  // TROCA TEMA
  // ======================================================
  useEffect(() => {
    trocaTema(theme);
  }, [theme]);

  // ======================================================
  // CARREGA PRODUTOS
  // ======================================================
  useEffect(() => {
    async function carregarProdutos() {
      try {
        setLoadingProdutos(true);

        // ==========================================
        // ELECTRON IPC
        // ==========================================
        const response = await BuscarProdutos();

        setProdutos(response);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoadingProdutos(false);
      }
    }

    carregarProdutos();
  }, []);

  // ======================================================
  // CARREGA TABELA
  // ======================================================
  useEffect(() => {
    async function carregarTabela() {
      try {
        // sem seleção
        if (!selectedProducts.length) {
          setDadosTabela([]);
          return;
        }

        setLoadingTabela(true);

        // ids produtos
        const produtosIds = selectedProducts.map((p) => p.id);

        // ==========================================
        // CONSULTA SQL VIA IPC
        // ==========================================
        const response = await window.api.buscarVendas({
          produtosIds,

          dataInicial,

          dataFinal,
        });

        setDadosTabela(response);
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
      } finally {
        setLoadingTabela(false);
      }
    }

    carregarTabela();
  }, [selectedProducts, dataInicial, dataFinal]);

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
  // TEMA SPECTRUM
  // ======================================================
  const spectrumColorScheme = theme.includes("dark") ? "dark" : "light";

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
        <button
          className="theme-button"
          style={{
            backgroundColor: brandColor,
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Temas
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
              onSelectionChange={setSelectedProducts}
            />
          )}

          {/* ========================================= */}
          {/* GRÁFICO */}
          {/* ========================================= */}
          <main className="content-grafico">
            <GraficoVendas
              produtosSelecionados={selectedProducts}
              dados={dadosTabela}
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
                {/* LOADING */}
                {loadingTabela ? (
                  <Row>
                    <Cell>Carregando...</Cell>

                    <Cell></Cell>

                    <Cell></Cell>
                  </Row>
                ) : dadosTabela.length > 0 ? (
                  // ===================================
                  // DADOS
                  // ===================================
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
                  // ===================================
                  // SEM DADOS
                  // ===================================
                  <Row>
                    <Cell>Nenhum produto selecionado</Cell>

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
    </Provider>
  );
}
