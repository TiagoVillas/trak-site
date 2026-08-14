import fs from 'node:fs'
// Rode com: node js/canal.test.mjs
import vm from 'node:vm'

const CODE = fs.readFileSync(new URL('./canal.js', import.meta.url), 'utf8')
const BADGE = 'https://apps.apple.com/app/apple-store/id6771655767?pt=128788891&ct=LP&mt=8'

function run(search, { storage = {}, noStorage = false } = {}) {
  const links = [{ href: BADGE }, { href: BADGE }]
  const ctx = {
    window: { location: { search } },
    URLSearchParams,
    document: {
      readyState: 'complete',
      querySelectorAll: (sel) => (sel.includes('apps.apple.com') ? links : []),
      addEventListener: () => {},
    },
    sessionStorage: noStorage
      ? { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
      : { getItem: (k) => (k in storage ? storage[k] : null), setItem: (k, v) => { storage[k] = v } },
  }
  vm.createContext(ctx)
  vm.runInContext(CODE, ctx)
  return { ct: new URL(links[0].href).searchParams.get('ct'), storage, href: links[0].href }
}

let fails = 0
const check = (nome, real, esperado) => {
  const ok = real === esperado
  if (!ok) fails++
  console.log(`${ok ? 'PASS' : 'FALL'} ${nome} → ${real}${ok ? '' : ` (esperado ${esperado})`}`)
}

check('?c=pin vira pinterest', run('?c=pin').ct, 'pinterest')
check('?c=yt vira youtube', run('?c=yt').ct, 'youtube')
check('?c=x vira twitter', run('?c=x').ct, 'twitter')
check('sem parametro fica LP', run('').ct, 'LP')
check('canal desconhecido fica LP', run('?c=hackerman').ct, 'LP')
check('injecao de & nao vaza', run('?c=pin%26ct%3Devil').ct, 'LP')
check('prototype pollution (constructor) fica LP', run('?c=constructor').ct, 'LP')
check('prototype pollution (toString) fica LP', run('?c=toString').ct, 'LP')
check('outros params preservados', run('?c=pin').href.includes('pt=128788891'), true)
check('mt preservado', run('?c=pin').href.includes('mt=8'), true)

// sessao: canal grava e sobrevive numa segunda pagina sem parametro
const s = {}
run('?c=pin', { storage: s })
check('canal grava na sessao', s.trak_canal, 'pinterest')
check('2a pagina sem param herda da sessao', run('', { storage: s }).ct, 'pinterest')

// storage bloqueado (modo privado) nao pode quebrar a pagina
check('sessionStorage bloqueado ainda aplica', run('?c=pin', { noStorage: true }).ct, 'pinterest')
check('sessionStorage bloqueado sem param fica LP', run('', { noStorage: true }).ct, 'LP')

console.log(fails === 0 ? '\nTODOS PASSARAM' : `\n${fails} FALHA(S)`)
process.exit(fails === 0 ? 0 : 1)
