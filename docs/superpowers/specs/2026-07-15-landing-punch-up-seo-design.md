# Punch-up do trak-site + base SEO (pré-launch)

## Contexto

O trak 1.0 foi submetido à Apple em 15/07; release na semana de 20/07. O site trakapp.com.br (repo `trak-site`, HTML/CSS estático, sem JS, deploy Vercel push-main→prod) está no ar mas com o básico. Tiago quer o site **mais impactante e melhor em conversão orgânica** antes do launch. Alinhado em brainstorm:

- **Tráfego esperado:** todos os canais (Google, social, boca a boca, imprensa) → o site precisa de impacto imediato + demonstração + base SEO.
- **Escopo:** punch-up da landing + base SEO **só em pt-BR** (domínio .com.br, launch BR).
- **Hero:** animação CSS pura (células do calendário acendendo) + vídeo promo em seção própria.
- **Prova social:** só a história do criador (indie/solo dev BR); depoimentos ficam pós-launch com reviews reais.
- **Fonte de voz/keywords:** `trak/marketing/aso/store-listing.md` (travado 15/06) — "O que você vê, você cumpre", "rastreador de hábitos", "tela de bloqueio", "papel de parede", estilos: Brasa/Maré/Musgo, gating grátis = 3 hábitos + 2 estilos.

## Restrições

- **Manter stack:** HTML/CSS estático, zero JS (exceção: nenhuma — animação é CSS; vídeo usa `<video>` nativo). `cleanUrls` do Vercel.
- **Política de release:** branch + PR; merge na main SÓ com autorização explícita do Tiago (push = produção).
- Design system atual do site (creme `#f6f4ef`, laranja `#d96a33`, Newsreader serif) é bom e fica — punch-up, não redesign.
- Safari: `<img>` sempre com `height:auto` (bug conhecido).

## Mudanças

### 1. Hero animado (index.html + style.css) — o momento "uau"

Substituir a imagem estática do lock screen no hero por um **mockup HTML/CSS do lock screen** dentro do frame `.phone` existente:

- Relógio + data (texto estilizado, fonte serif como o wallpaper real do trak).
- Grade do calendário do ano (~26 colunas × 14 linhas ≅ 365 células, `<i>` vazios gerados estaticamente no HTML — sem JS).
- Células "passadas" acendem uma a uma com `animation-delay` escalonado (CSS custom property `--d` por célula), cor `--accent`, terminando num estado ~52% preenchido (meio do ano — honesto com a data).
- `@media (prefers-reduced-motion: reduce)` → estado final direto, sem animação.
- Fallback de manutenção: o HTML das células é gerado por um snippet documentado no README (loop shell/python de 1 linha) pra regenerar se precisar.
- Copy do hero alinhada ao ASO: h1 vira **"O que você vê, você cumpre."** (a tese da marca, hoje só no ASC) com "vê" em `.serif-em`; sub carrega keywords: "O trak é o rastreador de hábitos que vira papel de parede: seu progresso na tela de bloqueio do iPhone, célula por célula, todo amanhecer."
- Manter "Cada dia deixa uma marca" como overline ou mover pra outra seção (decidir na implementação — não perder a frase).

### 2. Seção "Veja em ação" (nova, após "Como funciona")

- `<video>` nativo com `poster` (frame bonito do promo), `controls`, `preload="none"`, `playsinline` — zero custo de carregamento até o play.
- Asset: `marketing-hub/projects/trak/assets/promo/trak-promo.mp4` (7,7 MB) **re-encodado** com ffmpeg para ~2–3 MB (H.264 CRF ~28, 1080p máx) → `img/promo.mp4` + `img/promo-poster.jpg`.
- Título da seção com keyword: "Veja o wallpaper de hábitos em ação".

### 3. Seção "Seu progresso vira arte" (nova) — estilos + paletas

Espelha o bloco mais forte da descrição da App Store:

- Grid de 4–6 thumbs de estilos de wallpaper (Calendário do ano, Vida, Consistência, Mês a mês, Semestre, Pulso/Espiral) — imagens geradas via harness de render existente (`wallpaper-render-dump-harness` no repo trak) ou recortes dos screenshots v3 de marketing; webp ~50 KB cada.
- Linha das paletas: 3 swatches nomeados (Brasa, Maré, Musgo) + "ou crie a sua" (célula por célula).
- Nota Grátis/Pro honesta em uma linha: "Grátis: 3 hábitos e 2 estilos. trak Pro libera tudo, com 7 dias de teste no plano anual." (transparência reduz atrito; dados confirmados no código 15/06).

### 4. Seção "Quem fez" (nova, curta, antes do FAQ)

- 2–3 frases em primeira pessoa do Tiago: dev solo brasileiro, fez o app que queria usar, e-mail direto no rodapé responde o criador. Sem foto por padrão (Tiago decide depois).
- Elemento de confiança pra boca a boca/imprensa; texto final validado pelo Tiago no PR.

### 5. Refinos de conversão na landing

- Title tag: `trak — rastreador de hábitos que vira wallpaper do iPhone` (keywords categoria + diferencial; meta description idem com "tela de bloqueio"/"papel de parede").
- FAQ: atualizar resposta de preço com gating real (3 hábitos/2 estilos grátis; Pro mensal/anual, trial 7 dias no anual) + nova pergunta "O que tem de graça?"; sincronizar JSON-LD FAQPage.
- Nav ganha "Estilos" (âncora da seção 3). Final CTA mantém.
- Badges: trocar `href="#"` pela URL da App Store `https://apps.apple.com/br/app/trak/id<APPLE_ID>` — **pendente: Tiago fornecer o Apple ID (ASC → Informações do app)**. Se não vier até o PR, fica um commit separado pronto.

### 6. Base SEO pt-BR — 2 páginas novas

Ambas no padrão `.prose` existente (mesmo layout de `configurar.html`), com breadcrumb, CTA de download no fim, `Article` schema, entrada no `sitemap.xml` e link no footer:

- **`habitos-na-tela-de-bloqueio.html`** → "Hábitos na tela de bloqueio: por que ver funciona" — a tese do produto em formato artigo (~700–900 palavras): fricção de apps esquecidos, gatilhos visuais, o mecanismo do trak (atalho + wallpaper diário), CTA. Mira "hábitos tela de bloqueio", "papel de parede de hábitos", "wallpaper de hábitos".
- **`rastreador-de-habitos-iphone.html`** → "Rastreador de hábitos para iPhone: o que importa na escolha" — guia honesto de categoria (~800–1000 palavras): critérios (fricção de marcar, visibilidade do progresso, privacidade, português), onde o trak se encaixa (sem fingir neutralidade — assumidamente do criador), CTA. Mira "rastreador de hábitos", "app de hábitos iphone".
- Interlinks: landing ↔ artigos ↔ /configurar.

### 7. Housekeeping

- `sitemap.xml` + `llms.txt` atualizados com as novas páginas e seções.
- `og.png`: manter por ora (refazer só se sobrar tempo — o atual já é composto e decente).
- **Fora do código (Tiago, manual):** Vercel → Settings → Domains → tornar apex `trakapp.com.br` primário com `www` → redirect 308 (hoje invertido).

## Arquivos tocados

- `trak-site/index.html` — hero animado, seções novas (vídeo, estilos, quem fez), FAQ, title/meta, nav, badges.
- `trak-site/style.css` — mockup do lock screen + animação das células, seções novas, responsivo.
- `trak-site/habitos-na-tela-de-bloqueio.html`, `trak-site/rastreador-de-habitos-iphone.html` — novos.
- `trak-site/img/` — promo.mp4 + poster, thumbs de estilos (webp), swatches se necessário.
- `trak-site/sitemap.xml`, `llms.txt`, `README.md` (snippet de regeneração das células).

## Verificação

1. Servir local (`python3 -m http.server` — acessar `.html` direto, cleanUrls é só no Vercel) e conferir no navegador via Chrome: hero anima, vídeo dá play, seções responsivas em 375px e 1280px, `prefers-reduced-motion` (emular no DevTools).
2. Validar HTML (sem JS introduzido), pesos: página inicial sem vídeo baixado < ~500 KB; vídeo só sob demanda.
3. Rich results test manual dos JSON-LD (FAQ + Article) — colar no validador.
4. Safari: conferir imagens novas com `height:auto`.
5. PR aberto pra review do Tiago **com screenshots/GIF do resultado** (preferência dele: ver renderizado antes do OK). Merge na main só com autorização explícita.

## Fora de escopo (registrado)

- Versão EN, depoimentos (pós-launch com reviews reais), redesign do og.png, blog contínuo.
