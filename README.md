# trak-site

Site público do app **trak** (habit tracker iOS) — landing, tutorial de
configuração e páginas legais. Serve como cara pública e destino do QR do evento de
lançamento (papel "hub": o link de download é um ponto único de hot-swap App
Store↔TestFlight).

**Produção:** https://trakapp.com.br · **Repo do app:** github.com/TiagoVillas/trak

## Stack

- HTML + CSS **estáticos**, sem build, sem framework, sem JS (a FAQ usa `<details>`).
- Serif dos títulos: **Newsreader** self-hosted (`fonts/*.woff2`, `font-display:swap`).
- Hospedagem: **Vercel via integração GitHub** — push em `main` dispara deploy de
  produção automaticamente (não há Vercel CLI/`.vercel` no repo).
- `vercel.json`: `cleanUrls:true` (→ `/configurar` serve `configurar.html`) e
  `trailingSlash:false`.

## Estrutura

```
index.html         landing (hero, como funciona, trio, FAQ, CTA final)
configurar.html    tutorial de setup do wallpaper no lock screen (HowTo)
privacidade.html   política de privacidade (LGPD)
termos.html        termos de uso (assinatura trak Plus)
style.css          estilos compartilhados (paleta + componentes + responsivo)
favicon.svg        logo/mark do app (recriado em SVG); + favicon-32.png
img/               screenshots (png + webp), og.png, logo-mark.svg, app-store-badge.svg
fonts/             Newsreader woff2 (400, 400 italic, 600)
sitemap.xml robots.txt llms.txt   SEO + descoberta por IA
docs/superpowers/specs/            design doc da reformulação
```

## Rodar local

```sh
python3 -m http.server 8765   # http://localhost:8765/index.html
```

Atenção: as URLs limpas (`/configurar`) só funcionam no Vercel. Local, acesse os
`.html` diretamente — no servidor estático simples elas dão 404 (esperado).

## Identidade / SEO

- Paleta espelha o app: creme `#f6f4ef`, laranja `#d96a33`, tinta `#1a1a22`.
- Por página: `<title>`, meta description, canonical, OpenGraph + Twitter Card.
- JSON-LD: `MobileApplication` + `FAQPage` (home), `HowTo` (configurar).
- `og.png` (1200×630) é gerado por harness HTML + Chrome headless (ver histórico do
  commit); o **logo-mark.svg** e o **favicon** foram recriados a partir do
  `AppIcon.appiconset/trak-icon.png` do app (cores `#141420`/`#e8e8ec`/`#ff6b35`).
- Imagens: screenshots vêm de `../trak/marketing/screenshots/raw/`, redimensionadas
  para 552×1200 + webp. `<img>` usa `height:auto` (sem isso o Safari estica).

## TODO (ações manuais)

- [ ] **Link de download:** os 2 badges em `index.html` apontam para `href="#"`
      (busque `appstore-badge` / o comentário `TODO(lançamento)`). Trocar pela URL da
      App Store (ou TestFlight) no lançamento — é o único ponto de swap.
- [ ] **Domínio primário no Vercel:** deixar `trakapp.com.br` (apex) como primary e
      `www` redirecionando para ele, para casar com os `canonical` (que apontam ao apex).
