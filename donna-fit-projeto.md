# Donna Fit Low Carb — App de Precificação

Documento de planejamento do app de precificação para a marca **Donna Fit Low Carb**.
App mobile, uso pessoal e offline, que substitui os cálculos manuais em papel por um assistente passo a passo dentro do celular.

---

## 1. Visão Geral

- **Problema a resolver:** precificação manual, feita no papel, repetida a cada produto.
- **Usuária final:** não usa computador, não usa planilhas, só o celular.
- **Solução:** app com fluxo tipo assistente ("Precificar" → perguntas uma de cada vez → preço final).
- **Distribuição:** arquivo `.apk` instalado diretamente no celular Android (sem loja de aplicativos).

---

## 2. Identidade Visual

### 2.1 Paleta de cores

Cores extraídas diretamente da logo enviada (análise de pixel, não estimativa visual):

| Nome | Hex | Uso no app |
|---|---|---|
| Verde Sálvia | `#8CA496` | Fundo de destaque, cabeçalhos, elementos de marca |
| Verde Sálvia Escuro | `#5C7266` | Texto principal, botões primários |
| Areia / Bege | `#D9CDC3` | Bordas, cards secundários, divisores |
| Creme (fundo de tela) | `#FAF8F5` | Fundo padrão das telas (não branco puro) |
| Branco | `#FFFFFF` | Ícones, texto sobre fundo verde |
| Marrom Terroso | `#A8815F` | Destaque do preço final, call-to-action importante |

### 2.2 Tipografia

- **Display / Títulos:** fonte serifada orgânica e arredondada (ex: *Fraunces*) — usada em títulos e no valor final do preço, remetendo à curvatura das folhas da logo.
- **Corpo / Formulários:** sans-serif humanista limpa (ex: *Inter*), com números tabulares para alinhar preços e quantidades com precisão.

### 2.3 Princípios de layout

- Mobile-first, uma pergunta por tela (estilo assistente/conversacional).
- Botões grandes, fáceis de tocar, sem menus complexos.
- Cantos arredondados suaves, ecoando o círculo da logo.
- Pouca animação decorativa; transições suaves entre perguntas.
- "Reveal" caprichado na tela final do preço — elemento de assinatura visual do app.

---

## 3. Stack Tecnológica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Fácil de estilizar com tokens de cor customizados, leve, performático |
| Persistência de dados | LocalStorage / IndexedDB | Dados salvos direto no celular, sem servidor, sem internet necessária no uso diário |
| Empacotamento mobile | Capacitor | Transforma o projeto web em app Android nativo instalável |
| Build do APK | Android Studio + Node.js | Ferramentas rodadas no computador do desenvolvedor para gerar o `.apk` assinado |

---

## 4. Arquitetura de Dados

**Ingrediente (cadastro reutilizável):**
- Nome
- Preço pago
- Quantidade da embalagem (com unidade: g, kg, ml, L ou "unidade")
- → o app calcula sozinho o preço proporcional por grama/ml/unidade

**Receita (opcional, salva por nome):**
- Nome do produto
- Lista de ingredientes + quantidades usadas
- Rendimento (quantas unidades/porções o lote gera)

**Cálculo final:**
- Custo total = soma proporcional dos ingredientes usados
- Margem de lucro padrão (definida uma vez, ajustável se necessário)
- Preço final = total do lote **e** preço por unidade (rendimento)

---

## 5. Fluxo do Usuário

1. Tela inicial: botões **"Precificar"**, **"Minhas Receitas"**, **"Ingredientes"**
2. "Precificar" → nome do produto (opcional)
3. Loop: escolher ingrediente (ou cadastrar novo na hora) → informar quantidade usada
4. Botão **"Terminar"** encerra o loop
5. Informar rendimento (quantas unidades o lote gera)
6. App calcula custo total automaticamente
7. Aplica margem de lucro padrão (ajustável)
8. Exibe: custo total, preço total sugerido, **preço por unidade**
9. Opção de salvar como receita para reutilizar depois

---

## 6. Etapas do Projeto

### Etapa 1 — Product Designer / UX Writer
Define a árvore de telas, o texto de cada pergunta do assistente, mensagens de erro e estados vazios.
**Entrega:** fluxo completo em texto, sem visual.

### Etapa 2 — UI Designer
Aplica a identidade visual (paleta, tipografia, componentes: botões, cards, inputs) sobre o fluxo da Etapa 1.
**Entrega:** sistema de design (tokens de cor/fonte/espaçamento) pronto para virar código.

### Etapa 3 — Frontend Developer (React)
Constrói as telas reais, o cadastro de ingredientes, o assistente passo a passo, a lógica de cálculo (proporcionalidade, margem, rendimento) e o salvamento local dos dados.
**Entrega:** app funcionando no navegador.

### Etapa 4 — Mobile/Build Engineer (Capacitor)
Integra o projeto React ao Capacitor, configura ícone do app, splash screen, nome e permissões Android.
**Entrega:** projeto pronto para gerar o `.apk`.

### Etapa 5 — QA Tester
Testa cenários reais: ingrediente com preço quebrado, receita sem rendimento informado, margem alterada, app fechado no meio do cálculo.
**Entrega:** lista de ajustes finais.

### Etapa 6 — Deployment / Entrega
Gera o `.apk` assinado, testa instalação em celular Android real, escreve o passo a passo de instalação para a usuária final.
**Entrega:** arquivo `.apk` final + manual de instalação.

---

## 7. Pré-requisitos no computador (para gerar o APK)

- [ ] Node.js instalado
- [ ] Android Studio instalado (inclui Android SDK)
- [ ] Java JDK (geralmente já vem com o Android Studio)
- [ ] Celular Android com "Fontes desconhecidas" habilitado para instalar o `.apk` final
