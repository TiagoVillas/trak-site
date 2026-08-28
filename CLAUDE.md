# trak-site

Site público do trak (trakapp.com.br). HTML/CSS estáticos, sem build.
**Referência de estrutura, assets e SEO: `README.md`.** Este arquivo é só o que
não é óbvio e já quebrou alguma coisa.

## 🔴 Commits NUNCA levam `Co-Authored-By`

A Vercel valida todos os autores e co-autores do commit contra os colaboradores do
projeto. E-mail desconhecido → **deploy bloqueado** ("commit author did not have
contributing access"), sem erro visível no GitHub: o push passa, o site simplesmente
não atualiza.

Já aconteceu três vezes:
- 14/07/2026 (commits `215bf3c`+`037ce6b`) — corrigido com recommit sem trailer;
- depois disso o repo foi tornado **público**, porque só tirar o trailer não bastou;
- 28/08/2026 — repeti o erro na página de acessibilidade: push ok, `/acessibilidade`
  404 por minutos até o `--amend` sem trailer (`d783497`).

**Regra: nenhum trailer de co-autor em commit deste repo.** No repo `trak` (Deno Deploy)
o trailer não causa problema — a regra é específica daqui.

Se o repo voltar a ser privado e o bloqueio voltar, a saída durável é deploy pela CLI
(`npx vercel login` → `vercel link` → `vercel --prod`), que não passa pela checagem de autor.

## Push em `main` = produção

Não há staging. `git push origin main` publica em trakapp.com.br em ~30–60s.
**Nunca pushar sem autorização explícita do Tiago.** Depois de publicar, confirmar com
`curl -o /dev/null -w "%{http_code}" https://trakapp.com.br/<rota>` — o deploy pode
falhar em silêncio (ver regra acima).

## Atribuição por canal — não quebrar

`js/canal.js` lê `?c=<canal>` da URL e reescreve o `ct=` dos botões da App Store
(allowlist fechada). Tem testes: `node --test js/canal.test.mjs` — rodar antes de
qualquer mexida nas páginas com badge.

Ele está só nas páginas com botão de download (`index`, `habitos-na-tela-de-bloqueio`,
`rastreador-de-habitos-iphone`). Páginas legais não precisam.

⚠️ O Pinterest bloqueia `trakapp.com.br/pin` **dentro de um pin** (trata o redirect como
spam). Em post, usar `https://trakapp.com.br/?c=pin`. Os slugs de `vercel.json` seguem
valendo para link de bio.

## Página nova: a lista completa

Esquecer um destes deixa a página órfã. Ver `acessibilidade.html` como modelo recente.

1. `<title>`, meta description, **canonical no apex** (`https://trakapp.com.br/<rota>`)
2. Favicon, `style.css`, script do Vercel Analytics no `<head>`
3. `<header class="nav">` e `<footer class="site">` iguais aos das outras páginas
4. **Link no rodapé de TODAS as páginas** — o bloco `class="links"` é copiado, não incluído
5. Entrada em `sitemap.xml`
6. Conteúdo em `<main class="prose">`: breadcrumb → `<h1>` → `<p class="updated">`
7. Testar local (`python3 -m http.server 8765`) — as URLs limpas só funcionam na Vercel,
   então acesse o `.html` direto; 404 em `/rota` no servidor local é esperado

## Conteúdo

- pt-BR. Paleta do app: creme `#f6f4ef`, laranja `#d96a33`, tinta `#1a1a22`.
- Nunca liderar com "app de hábitos" — liderar com a tela de bloqueio se transformando.
- "Dev solo brasileiro" fica **fora do discurso de venda** (decisão de marca). Em página
  de responsabilidade — acessibilidade, contato — o contexto é permitido e ajuda.
- Estratégia vigente: `../trak/marketing/estrategia-v2-ago2026.html` e
  `../trak/marketing/aso/manual-appstore.html`. Consultar antes de mexer em copy de ASO.
