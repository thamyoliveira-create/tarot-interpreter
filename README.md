# 🎴 Tarot Interpreter — Rider-Waite-Smith

Aplicativo web responsivo, elegante e intuitivo focado **exclusivamente em interpretar cartas de Tarot do sistema clássico Rider-Waite-Smith (RWS)**.

> **Importante:** O aplicativo **NÃO** realiza sorteios, simulações ou embaralhamento de cartas. A tiragem é feita fisicamente pelo usuário com seu próprio baralho, informando manualmente ao app quais cartas saíram, suas orientações e posições.

---

## 🌟 Funcionalidades Principais

1. **Entrada Personalizada e Manual da Tiragem**:
   - Pergunta obrigatória com validações amigáveis.
   - Contexto adicional opcional para enriquecer a leitura.
   - Adição e remoção dinâmica de cartas (inicia com 1 carta).
   - Seletor pesquisável contendo todas as **78 cartas do Rider-Waite-Smith em português** divididas em:
     - 22 Arcanos Maiores (0 - O Louco ao XXI - O Mundo)
     - 14 Paus (Fogo)
     - 14 Copas (Água)
     - 14 Espadas (Ar)
     - 14 Ouros (Terra)
   - Orientação individual de cada carta: **Normal** ou **Invertida** (com nuances de bloqueio, internalização, excesso, falta ou atraso).
   - Posição opcional na tiragem (ex.: *situação atual, desafio, conselho, tendência...*).

2. **Estilos de Interpretação**:
   - 📖 **Detalhada** (Padrão): Explica cada carta individualmente e analisa detalhadamente as combinações.
   - 🎯 **Objetiva**: Resposta concisa e direta ao cerne da questão.
   - 🏛️ **Tradicional**: Prioriza os significados históricos clássicos de Arthur E. Waite e Pamela Colman Smith.
   - 🪞 **Reflexiva**: Apresenta a interpretação acrescida de perguntas profundas para autoanálise.

3. **Interpretação Estruturada em 5 Seções**:
   1. **Visão geral**: Mensagem central e tom da tiragem.
   2. **Carta por carta**: Análise de cada arcano contextualizado na pergunta, orientação e posição.
   3. **Relação entre as cartas**: Equilíbrio dos elementos (Fogo, Água, Ar, Terra), proporção de Arcanos Maiores, sinergias, contrastes e fluxo narrativo.
   4. **Síntese da leitura**: Resposta unificada e direta à dúvida do consulente.
   5. **Pontos de atenção**: Aspectos favoráveis, desafios/cuidados, pontos em aberto e atitudes recomendadas.

4. **Histórico Local (LocalStorage)**:
   - Armazena todas as leituras realizadas localmente no navegador.
   - Busca rápida por pergunta ou contexto.
   - Botão para revisitar a leitura completa ou excluí-la.

5. **Pronto para Integração com Inteligência Artificial**:
   - Gerador de prompt estruturado em conformidade com as regras éticas do RWS (`generateInterpretationPrompt`).
   - Modal para visualizar o prompt completo da IA.
   - Conector opcional para a API do Google Gemini (`gemini-1.5-flash` / `gemini-pro`).
   - Motor simbólico nativo embutido em TypeScript para execução offline e instantânea sem falhas.

---

## 📁 Estrutura do Projeto

```
tarot-interpreter/
├── index.html                 # Aplicação SPA pronta para execução universal no navegador
├── package.json               # Configuração de dependências React, TypeScript, Tailwind e Vite
├── tsconfig.json              # Configurações do compilador TypeScript
├── vite.config.ts             # Configuração do bundler Vite
├── tailwind.config.js         # Tema customizado (paleta mística de dourados e escuros)
├── server.py                  # Servidor local leve em Python 3
├── src/
│   ├── types/
│   │   └── tarot.ts           # Modelos e interfaces TypeScript (TarotCard, ReadingCard, TarotReading...)
│   ├── data/
│   │   └── tarotCards.ts      # Base de dados completa com as 78 cartas RWS em português e palavras-chave
│   ├── services/
│   │   ├── tarotInterpreter.ts# Prompt generator de IA + Interpretador simbólico RWS + Conexão Gemini API
│   │   └── storage.ts         # Gerenciamento de histórico em localStorage
│   ├── components/
│   │   ├── Header.tsx         # Cabeçalho e navegação
│   │   ├── TarotCardSelector.tsx # Seletor pesquisável com filtros por naipe
│   │   ├── ReadingCardItem.tsx# Card individual da carta na tiragem
│   │   ├── ReadingForm.tsx    # Formulário da tiragem
│   │   ├── ReadingSummary.tsx # Resumo visual das cartas da leitura
│   │   ├── InterpretationResultView.tsx # Renderização rica das 5 seções
│   │   └── ApiKeyModal.tsx    # Configuração opcional de API Key de IA
│   ├── pages/
│   │   ├── NewReading.tsx     # Página de criação de leitura
│   │   ├── ReadingResult.tsx  # Página com o resultado da leitura
│   │   └── History.tsx        # Histórico de leituras salvas
│   ├── App.tsx                # Componente raiz da aplicação
│   ├── main.tsx               # Ponto de entrada React
│   └── index.css              # Estilos e fontes clássicas (Cinzel)
```

---

## 🚀 Como Executar

### Opção 1: Servidor Local Python (Instantâneo)
```bash
cd /Users/tamirisoul/.gemini/antigravity/scratch/tarot-interpreter
python3 server.py
```
Abra no navegador em: `http://localhost:3000`

### Opção 2: Abertura Direta no Navegador
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Safari, Edge, Firefox).

---

## 📜 Regras Éticas e Simbólicas Implementadas

- **Linguagem Proporcional e Não-Determinista**: Sem previsões absolutas ou fatalistas (ex: "isso definitivamente acontecerá"). O app utiliza "As cartas favorecem...", "A combinação sugere...".
- **Nuances de Cartas Invertidas**: Não trata a inversão como mero oposto, mas sim como bloqueio, excesso, internalização, lentidão ou necessidade de trabalho interior.
- **Diferenciação Afetiva**: Em questões de relacionamento, distingue atração, sentimentos, disponibilidade emocional, comunicação e compromisso formal.
