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
  Cell
} from "@adobe/react-spectrum"; 

import DateComponent from "./components/dateComponent.jsx";
import "./app.css";
import Modal from "./components/modalTemas.jsx";
import { trocaTema } from "./utils/trocatema";
import SidebarProdutos from "./components/sidebarProdutos.jsx";
import GraficoVendas from "./components/GraficoVendas";

const availableThemes = {
  light: "dx.light",
  dark: "dx.dark",
  darkViolet: "dx.darkviolet",
};

const produtos = [
  { id: 1, nome: "Tênis Nike Delta", isPai: true },
  { id: 2, parentId: 1, nome: "Nike Delta Azul" },
  { id: 3, parentId: 1, nome: "Nike Delta Preto" },
  { id: 4, nome: "Tênis Adidas Forum", isPai: true },
  { id: 5, parentId: 4, nome: "Adidas Forum Branco" },
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(availableThemes.light);
  const [brandColor, setBrandColor] = useState("#7c3aed");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    trocaTema(theme);
  }, [theme]);

  const spectrumColorScheme = theme.includes("dark") ? "dark" : "light";

  return (
    <Provider theme={defaultTheme} colorScheme={spectrumColorScheme}>
      {/* SEÇÃO TOPO */}
      <section id="topo">
        <p>Selecione o Período:</p>
        <DateComponent />
        até
        <DateComponent />
        <button
          className="theme-button"
          style={{ backgroundColor: brandColor }}
          onClick={() => setIsModalOpen(true)}
        >
          Temas
        </button>
      </section>

      {/* SEÇÃO CONTEÚDO PRINCIPAL (DASHBOARD) */}
      <section id="dashboard-container">
        
        {/* BLOCO SUPERIOR: Sidebar + Gráfico lado a lado */}
        <div className="bloco-superior">
          <SidebarProdutos
            produtos={produtos}
            onSelectionChange={setSelectedProducts}
          />
          <main className="content-grafico">
            <GraficoVendas produtosSelecionados={selectedProducts} />
          </main>
        </div>

        {/* BLOCO INFERIOR: Se estende de ponta a ponta (Métricas + DataGrid) */}
        <div className="bloco-inferior">
          
          {/* 1. PAINEL DE MÉTRICAS RÁPIDAS (Usando utilitários do Spectrum) */}
          <Flex direction="row" gap="size-200" marginBottom="size-250" wrap>
            <View backgroundColor="static-gray-100" padding="size-200" borderRadius="medium" flex>
              <Heading level={4} margin={0}>Faturamento Total</Heading>
              <Content><Text size="XL" weight="bold">R$ 15.000,00</Text></Content>
            </View>
            <View backgroundColor="static-gray-100" padding="size-200" borderRadius="medium" flex>
              <Heading level={4} margin={0}>Qtd. Total Vendida</Heading>
              <Content><Text size="XL" weight="bold">75 un</Text></Content>
            </View>
            <View backgroundColor="static-gray-100" padding="size-200" borderRadius="medium" flex>
              <Heading level={4} margin={0}>Produto Destaque</Heading>
              <Content><Text size="XL" weight="bold">Nike Delta Azul</Text></Content>
            </View>
          </Flex>

          {/* 2. DATAGRID COMPLETO (TableView do React Spectrum) */}
          <div className="tabela-wrapper">
            <TableView 
              aria-label="Tabela de Detalhamento de Vendas"
              selectionMode="multiple" /* Habilita checkbox de seleção em lote */
            >
              <TableHeader>
                <Column key="nome">Produto</Column>
                <Column key="qtd" align="end">Qtd Vendida</Column>
                <Column key="faturamento" align="end">Faturamento ($)</Column>
              </TableHeader>
              <TableBody>
                {/* Aqui você mapeará os dados da sua futura API baseados no selectedProducts */}
                <Row key="1">
                  <Cell>Nike Delta Azul</Cell>
                  <Cell>45 un</Cell>
                  <Cell>R$ 9.000,00</Cell>
                </Row>
                <Row key="2">
                  <Cell>Nike Delta Preto</Cell>
                  <Cell>30 un</Cell>
                  <Cell>R$ 6.000,00</Cell>
                </Row>
              </TableBody>
            </TableView>
          </div>

        </div>
      </section>

      {/* MODAL */}
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