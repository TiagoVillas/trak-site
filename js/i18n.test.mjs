// Rode com: node js/i18n.test.mjs
// Garante que cada página em português tem seu par em inglês e que os dois
// apontam um pro outro (hreflang, alternador), sem link "vazando" pro outro
// idioma. Lê os arquivos como texto — sem parser, sem dependência.
import fs from 'node:fs'

const ROOT = new URL('../', import.meta.url)
const APEX = 'https://trakapp.com.br'
const PARES = [
  ['index.html',          'en/index.html',         '/',               '/en'],
  ['configurar.html',     'en/set-up.html',        '/configurar',     '/en/set-up'],
  ['acessibilidade.html', 'en/accessibility.html', '/acessibilidade', '/en/accessibility'],
  ['privacidade.html',    'en/privacy.html',       '/privacidade',    '/en/privacy'],
  ['termos.html',         'en/terms.html',         '/termos',         '/en/terms'],
  ['imprensa.html',       'en/press.html',         '/imprensa',       '/en/press'],
]
const ROTAS_PT = ['/configurar', '/privacidade', '/termos', '/acessibilidade', '/imprensa']

let fails = 0
const check = (nome, ok, detalhe = '') => {
  if (!ok) fails++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${nome}${ok || !detalhe ? '' : ' — ' + detalhe}`)
}
const read = (p) => fs.existsSync(new URL(p, ROOT)) ? fs.readFileSync(new URL(p, ROOT), 'utf8') : null
const has = (html, s) => html.includes(s)

for (const [pt, en, rotaPt, rotaEn] of PARES) {
  const hp = read(pt), he = read(en)
  check(`${en} existe`, he !== null)
  if (!hp || !he) continue

  // 1. lang
  check(`${pt} lang=pt-BR`, has(hp, '<html lang="pt-BR">'))
  check(`${en} lang=en`, has(he, '<html lang="en">'))

  // 2. canonical no apex
  check(`${pt} canonical`, has(hp, `<link rel="canonical" href="${APEX}${rotaPt}">`))
  check(`${en} canonical`, has(he, `<link rel="canonical" href="${APEX}${rotaEn}">`))

  // 3. hreflang recíproco nos dois arquivos
  for (const [arq, html] of [[pt, hp], [en, he]]) {
    check(`${arq} hreflang pt-BR`, has(html, `<link rel="alternate" hreflang="pt-BR" href="${APEX}${rotaPt}">`))
    check(`${arq} hreflang en`, has(html, `<link rel="alternate" hreflang="en" href="${APEX}${rotaEn}">`))
    check(`${arq} hreflang x-default → pt`, has(html, `<link rel="alternate" hreflang="x-default" href="${APEX}${rotaPt}">`))
  }

  // 4. og:locale
  check(`${pt} og:locale pt_BR`, has(hp, '<meta property="og:locale" content="pt_BR">'))
  check(`${pt} og:locale:alternate en_US`, has(hp, '<meta property="og:locale:alternate" content="en_US">'))
  check(`${en} og:locale en_US`, has(he, '<meta property="og:locale" content="en_US">'))
  check(`${en} og:locale:alternate pt_BR`, has(he, '<meta property="og:locale:alternate" content="pt_BR">'))

  // 5. alternador aponta pro par
  check(`${pt} alternador → ${rotaEn}`, has(hp, `class="nav-lang" href="${rotaEn}" hreflang="en" lang="en"`))
  check(`${en} alternador → ${rotaPt}`, has(he, `class="nav-lang" href="${rotaPt}" hreflang="pt-BR" lang="pt-BR"`))

  // 6. nenhum link interno em en/ aponta pra rota pt do escopo (fora alternador e nota de cortesia)
  const corpo = he
    .replace(/<a class="nav-lang"[^>]*>[^<]*<\/a>/g, '')
    .replace(/<p class="courtesy">[\s\S]*?<\/p>/g, '')
  const vazados = ROTAS_PT.filter((r) => new RegExp(`href="${r}(#[^"]*)?"`).test(corpo))
  check(`${en} sem link pra rota pt`, vazados.length === 0, vazados.join(', '))
  check(`${en} sem link pra home pt`, !/href="\/(#[^"]*)?"/.test(corpo), 'href="/" ou href="/#..." fora do alternador')
}

// 7. sitemap
const sitemap = read('sitemap.xml') || ''
for (const [, , , rotaEn] of PARES) check(`sitemap tem ${rotaEn}`, has(sitemap, `<loc>${APEX}${rotaEn}</loc>`))

// 8. badge e canal.js na home en
const badgeHrefs = (html) => [...html.matchAll(/<a class="appstore-badge" href="([^"]*)"/g)].map((m) => m[1])
const homeEn = read('en/index.html') || ''
check('en/index.html carrega canal.js', has(homeEn, '<script defer src="/js/canal.js"></script>'))
const badgesEn = badgeHrefs(homeEn)
check('en/index.html tem 2 badges', badgesEn.length === 2, String(badgesEn.length))
check('badges en com ct=LP-en', badgesEn.every((b) => b.includes('&ct=LP-en&')), badgesEn.join(' | '))

// 9. páginas pt do escopo seguem ct=LP
for (const [pt] of PARES) {
  const badges = badgeHrefs(read(pt) || '')
  check(`${pt} badges ct=LP`, badges.every((b) => b.includes('&ct=LP&')), badges.join(' | '))
  if (pt === 'index.html') check(`${pt} tem 2 badges`, badges.length === 2, String(badges.length))
}

console.log(fails ? `\n${fails} falha(s)` : '\ntudo ok')
process.exitCode = fails ? 1 : 0
