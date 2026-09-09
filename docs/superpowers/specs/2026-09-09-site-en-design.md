# Site em inglês — `/en/` no trakapp.com.br

Data: 2026-09-09 · Decisões do brainstorm com o Tiago (mesma data). Vale junto com o
`CLAUDE.md` e o `README.md` do trak-site.

## 1. Por quê

A ficha en-US/en-GB da App Store, o Threads em EN e o Indie App Catalog mandam quem fala
inglês pra um site só em português. A URL de "Supplemental Materials" da Featuring
Nomination também é o site. Sem versão em inglês, o site anula o esforço de localização
do app.

## 2. Decisões (o quê e o porquê)

1. **Rota `/en/<slug>` no mesmo domínio.** Por quê: a Vercel já serve `en/set-up.html`
   como `/en/set-up` pelo `cleanUrls`; sem DNS, sem projeto novo; a autoridade de SEO
   fica num domínio só; os slugs de atribuição (`/th`, `/pin`, `/c/:creator`) seguem
   valendo. Subdomínio e `.com` descartados (custo de DNS/autoridade; domínio "não
   mexer agora", decisão de 26/08).
2. **Sem redirecionamento automático por idioma.** Alternador EN/PT na navegação de
   toda página + `hreflang`. Por quê: o Google recomenda contra redirect por
   `Accept-Language` (o rastreador de um idioma nunca vê o outro); brasileiro com iPhone
   em inglês cairia no site errado; e "o link que mando é o link que abre". Zero JS
   novo, respeitando a regra do site (só canal.js e analytics).
3. **Escopo: 6 pares.** Home, configurar, acessibilidade, privacidade, termos, imprensa.
   Os dois artigos de SEO (`habitos-na-tela-de-bloqueio`, `rastreador-de-habitos-iphone`)
   ficam FORA: existem pra buscas em português; em inglês seriam reescritos pra outras
   palavras-chave, não traduzidos. Entram depois, como artigos novos, se houver dado.
4. **Mecânica: cópia por página em `en/*.html`, traduzida à mão, com teste que impede
   deriva.** Por quê: é como o site já funciona (rodapé copiado, não incluído); um
   gerador estático quebraria a regra "sem build" e obrigaria a templatizar as 8
   páginas atuais. O teste em Node é o que segura os 6 pares alinhados.

Slugs: `/en/` · `/en/set-up` · `/en/accessibility` · `/en/privacy` · `/en/terms` ·
`/en/press`.

## 3. Estrutura

```
en/
  index.html          ← index.html
  set-up.html         ← configurar.html
  accessibility.html  ← acessibilidade.html
  privacy.html        ← privacidade.html
  terms.html          ← termos.html
  press.html          ← imprensa.html
js/i18n.test.mjs      teste anti-deriva (node --test js/)
```

Assets, `style.css`, `js/canal.js`, fontes e imagens: referenciados por caminho
absoluto (`/style.css`, `/img/...`), sem cópia. O kit de imprensa (screenshots pt-BR + EN, kit 1.1.0)
fica em `press/` e é compartilhado pelas duas versões da página.

## 4. Cabeçalho de cada página (par pt ↔ en)

Página em inglês:

```html
<html lang="en">
<link rel="canonical" href="https://trakapp.com.br/en/<slug>">
<link rel="alternate" hreflang="pt-BR" href="https://trakapp.com.br/<slug-pt>">
<link rel="alternate" hreflang="en" href="https://trakapp.com.br/en/<slug>">
<link rel="alternate" hreflang="x-default" href="https://trakapp.com.br/<slug-pt>">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="pt_BR">
```

Página em português (só acrescenta):

```html
<link rel="alternate" hreflang="pt-BR" href="https://trakapp.com.br/<slug-pt>">
<link rel="alternate" hreflang="en" href="https://trakapp.com.br/en/<slug>">
<link rel="alternate" hreflang="x-default" href="https://trakapp.com.br/<slug-pt>">
<meta property="og:locale:alternate" content="en_US">
```

`x-default` aponta pro português: é o idioma principal do produto e da marca.
Home em inglês: `<title>`, description, OG/Twitter, JSON-LD `MobileApplication`
(`inLanguage: "en"`, `url` em `/en/`) e `FAQPage` traduzidos. `og:image` reaproveita o
`og.png` (imagem sem texto de idioma). `theme-color`, favicon, preload da fonte,
Vercel Analytics: iguais.

## 5. Navegação e rodapé

- **Alternador:** um `<a class="nav-lang">` no fim de `.nav-links`, texto `EN` nas páginas
  em português e `PT` nas em inglês, `hreflang` e `lang` no próprio link, apontando
  SEMPRE pra página equivalente (nunca pra home do outro idioma). `aria-label`
  "Read in English" / "Ler em português".
- **Mobile:** `.nav-links a:not(.nav-cta)` some abaixo de 640px; o alternador precisa
  ficar visível → regra nova em `style.css`: `.nav-links a.nav-lang{display:inline}`
  dentro do mesmo media query. Única mudança de CSS.
- **Navegação e rodapé em inglês** linkam só páginas em inglês: Home (`/en/`), How it
  works (`/en/#how`), Styles (`/en/#styles`), Set up (`/en/set-up`), Privacy, Terms,
  Accessibility, Press. Os artigos de SEO não aparecem no rodapé em inglês (não
  existem em inglês). Contato igual. Copy: "© 2026 trak · made by Tiago Villas".
- Âncoras da home em inglês em inglês (`#how`, `#styles`, `#download`).

## 6. Conteúdo

- **Tradução fiel, mesmo layout, mesmas imagens.** Sem "app de hábitos" na abertura:
  liderar com a tela de bloqueio se transformando (regra de marca, CLAUDE.md). Nomes
  dos estilos em inglês = os da ficha en-US (fonte: `../trak/marketing/fatos-do-app.md`;
  ex.: Year calendar, Month by month). "Dev solo brasileiro" fica fora do discurso de
  venda; na seção "quem fez" e nas páginas de responsabilidade, o contexto é permitido
  como no pt.
- **Hero animado:** o bloco `.ls-cal` gerado é copiado tal qual (é só `<i>` sem texto).
- **Privacidade e termos:** nota no topo, logo abaixo do `<h1>`, em `<p class="updated">`
  ou parágrafo próprio: *"This is a courtesy translation. If there is any conflict, the
  Portuguese version at trakapp.com.br/privacidade governs."* (idem para `/termos`).
  A URL da política no App Store Connect continua sendo a em português.
- **Imprensa:** kit já é bilíngue nas imagens; texto traduzido; links dos downloads
  iguais.
- **Configurar:** os nomes dos passos do app Atalhos em inglês são os do iOS em
  inglês ("Shortcuts", "Automation", "Time of Day", "Set Wallpaper"); conferir no
  simulador em en-US antes de fechar a página.

## 7. Badge da App Store e atribuição

- Badges da home em inglês: `ct=LP-en` (em vez de `ct=LP`) — mede separado o site em
  inglês. Aparecem só na home em inglês (como no pt: hero + CTA final).
- `js/canal.js` entra em `en/index.html` sem mudança: ele reescreve qualquer valor de
  `ct=` pelo canal de `?c=`, então `?c=th` em `/en/?c=th` dá `ct=threads` como hoje.
  A allowlist não muda. `node --test js/canal.test.mjs` continua verde.
- Imagem do badge: `img/app-store-badge.svg` já é a versão em inglês ("Download on the
  App Store"); a página em português usa a mesma. Nada a fazer.

## 8. SEO e descoberta

- `sitemap.xml`: +6 `<url>` (as em inglês), sem `xhtml:link` (a `hreflang` já está no
  HTML; manter o sitemap simples como está).
- `llms.txt`: uma linha "English version: https://trakapp.com.br/en/" e as 6 rotas.
- `robots.txt`: sem mudança.

## 9. Teste anti-deriva (`js/i18n.test.mjs`)

Roda com `node --test js/` (mesmo runner do canal.test.mjs, sem dependência). Lê os
arquivos como texto e verifica, pra cada par da tabela fixa
`[[ 'index.html','en/index.html','/','/en/' ], ...]`:

1. `en/*.html` existe e tem `<html lang="en">`; o pt tem `lang="pt-BR"`.
2. Canonical de cada um aponta pro próprio slug no apex.
3. `hreflang` recíproco: pt-BR, en e x-default presentes nos DOIS arquivos, com as
   URLs exatas do par.
4. `og:locale` `en_US` no en e `pt_BR` no pt; `og:locale:alternate` cruzado.
5. Alternador `.nav-lang` presente nos dois, apontando pro slug do outro.
6. Nenhum link interno em `en/*.html` aponta pra rota em português do escopo
   (`/configurar`, `/privacidade`, `/termos`, `/acessibilidade`, `/imprensa`) — exceto o
   alternador e a nota de cortesia das legais.
7. `sitemap.xml` contém as 6 URLs em inglês.
8. `en/index.html` carrega `/js/canal.js` e todo `apps.apple.com` nela tem `ct=LP-en`.
9. Páginas pt do escopo continuam com `ct=LP` (garante que ninguém trocou por engano).

## 10. Verificação e entrega

- Local: `python3 -m http.server 8765` e abrir os 6 `.html` em `/en/` (URL limpa só na
  Vercel). Conferir alternador no mobile (largura < 640).
- `node --test js/` verde (canal + i18n).
- Um frame pro Tiago: home em inglês renderizada (regra dele: ver antes de aprovar).
- Branch `site-en`, PR no trak-site, **commits sem trailer de co-autor** (regra do repo:
  a Vercel bloqueia o deploy em silêncio). Merge só com OK explícito; push em `main` =
  produção.
- Depois do merge: `curl -o /dev/null -w "%{http_code}"` em cada uma das 6 rotas + a
  home pt; conferir `/en/set-up` (URL limpa) e `/en` (sem barra).
- Registrar no `README.md` a pasta `en/` e o teste; no board do trak, fechar o card.

## 11. Fora de escopo

- Artigos de SEO em inglês (novos artigos, não tradução).
- Redirecionamento por idioma, detecção, cookie de preferência.
- Gerador estático / templating.
- OG image com texto por idioma.
- Mudar a URL da política de privacidade no App Store Connect.
