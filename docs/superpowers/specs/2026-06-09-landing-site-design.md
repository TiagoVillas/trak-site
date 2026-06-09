# trak — site completo (landing + tutorial + SEO) — design

_Data: 2026-06-09 · Evento de lançamento: 16/06/2026_

## Objetivo

Transformar a landing mínima atual em um **site completo e descobrível**: a cara
pública do trak **e** o destino do QR do evento (papel **C** — hot-swap App
Store↔TestFlight sem reimprimir QR). Precisa impressionar na primeira impressão,
ranquear em busca (Google) e ser bem interpretado por buscas de IA.

Domínio: **trakapp.com.br** (Vercel, repo `trak-site`).

## Princípios

- **Estático, rápido, sem framework.** HTML + CSS, JS só se imprescindível (FAQ é
  `<details>` nativo — zero JS). Performance é fator de ranking e de confiança no evento.
- **Fiel ao app.** Copy pt-BR, paleta creme/laranja/serifa que já espelha o app.
- **Conteúdo é o SEO.** Tutorial real + FAQ + structured data > truques.

## Stack & infra

- HTML estático + um `style.css` compartilhado.
- Serif dos títulos: **Newsreader** (self-hosted, woff2, `font-display:swap`) — sem
  Google Fonts externo (privacidade + velocidade). Corpo: system sans.
- `vercel.json`: rewrites pra URLs limpas (`/configurar`, `/privacidade`, `/termos`)
  e headers de cache pros assets estáticos.

## Sistema visual

- Paleta: `--ink:#1a1a22 · --muted:#6b6b76 · --bg:#f6f4ef · --card:#fffdf9 · --accent:#d96a33 · --line:#e6e2d8`.
- Gradiente pêssego (`#fbe7d6`) no topo do hero, ecoando a home do app.
- Telefone = screenshot real em frame escuro arredondado com sombra.
- Ícones: **SVG de linha, sóbrios** (stroke currentColor), nunca emoji.
- Botão App Store: pílula escura `<small>Baixar na</small><b>App Store</b>`.

## Páginas

### `/` (index.html)
1. **Nav** sticky — marca "trak" · links (Como funciona, Configurar, Baixar).
2. **Hero** — overline, h1 "Cada dia deixa uma _marca_.", subtítulo, botão Baixar +
   nota "iPhone · iOS 26+", screenshot do **lockscreen** no frame.
3. **Como funciona** — screenshot da **home** + 3 passos numerados
   (marcar → vira wallpaper → ver o ano ganhar forma).
4. **Destaques** — trio com ícones SVG: hábitos viram wallpaper · streaks · ano ganhando forma.
5. **FAQ** — 4–6 perguntas (`<details>`), também alimenta `FAQPage` JSON-LD.
6. **CTA final** — faixa escura "Comece o seu ano hoje." + botão.
7. **Footer** — links (Como funciona, Configurar, Privacidade, Termos) + contato + © 2026.

### `/configurar` (configurar.html) — tutorial / ímã de SEO
H1: "Como pôr seus hábitos no lock screen do iPhone". Passo a passo **fiel ao app**:

- **Pré-requisitos:** iPhone, iOS 26+, app trak instalado, app Atalhos (nativo).
- **Passo 1 — Crie hábitos e gere o wallpaper** no trak (escolha modo/paleta).
- **Passo 2 — Adicione o atalho:** link iCloud público
  `https://www.icloud.com/shortcuts/7956060ebcc44ce2a4ac5a19052c76bf`
  ("Atualizar Wallpaper trak"). **Aviso: não renomeie o atalho.**
- **Passo 3 — Crie a automação diária** (app Atalhos): aba **Automação** (rodapé) →
  **+** (topo direito) → **Hora do Dia · 00:05 · diariamente** →
  **Executar Atalho · "Atualizar Wallpaper trak"** → **Executar imediatamente** (sem perguntar).
- **Passo 4 — Defina como lock screen e teste:** rode o atalho uma vez, vá pra tela de
  bloqueio e confira. Daí em diante atualiza sozinho toda noite enquanto você dorme.
- Bloco de troubleshooting curto (não atualizou? rode manual; renomeou? reinstale).

### `/privacidade`, `/termos`
Conteúdo atual preservado, re-estilizado com header/footer e tipografia novos.

## Download CTA (pré-lançamento)

Estado **placeholder com TODO**: `href="#"` com comentário claro
`<!-- TODO: trocar por App Store / TestFlight no lançamento -->`. Visual idêntico ao
final. **Um único lugar** no HTML por página (idealmente um só componente/snippet repetido)
pra o swap ser trivial no dia 16.

## SEO + busca por IA (checklist)

- Por página: `<title>` único, `<meta name=description>`, `<link rel=canonical>`, `lang=pt-BR`.
- **OpenGraph + Twitter Card** + **og:image** 1200×630 (componho a partir do lockscreen).
- **JSON-LD**: `MobileApplication`/`SoftwareApplication` (home, com
  `applicationCategory`, `operatingSystem: iOS`, `offers`), `HowTo` (configurar, com os
  4 passos), `FAQPage` (perguntas da FAQ), `Organization` (marca/contato).
- **`sitemap.xml`** (4 URLs), **`robots.txt`** (allow + sitemap), **`llms.txt`**
  (resumo em texto do que é o trak + links pras páginas, pra crawlers de IA).
- HTML5 semântico (`header/nav/main/section/article/footer`), `alt` descritivo em toda imagem.
- **Imagens otimizadas:** redimensionar screenshots pra largura web (~560px @2x) + **webp**
  com fallback; `width/height` explícitos pra evitar layout shift (CLS).

## Assets

- Copiar de `../trak/marketing/screenshots/raw/`: `01-lockscreen`, `02-home`, `05-stats`
  → `img/`, redimensionados + webp.
- Gerar `img/og.png` (1200×630): lockscreen + wordmark "trak" sobre o creme.
- Fontes Newsreader (regular + italic + 600) em `fonts/` (woff2).

## Fora de escopo (agora)

- Backend, captura de email/lista de espera, analytics (pode entrar depois).
- Blog. (A estrutura permite adicionar `/blog` no futuro pra mais SEO.)

## Sequência de build

1. `style.css` compartilhado + fontes + header/footer parciais.
2. `index.html` (todas as seções).
3. `configurar.html` (tutorial + HowTo JSON-LD).
4. Re-estilizar `privacidade.html` / `termos.html`.
5. Otimizar imagens + gerar og.png.
6. SEO infra: sitemap.xml, robots.txt, llms.txt, JSON-LD, meta/OG por página.
7. `vercel.json` (rewrites + cache). Smoke local. Commit.
