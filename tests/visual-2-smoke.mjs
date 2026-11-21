// Verificações estruturais sem dependências externas.
// Execução: node tests/visual-2-smoke.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const maps = read('web/js/maps.js');
const world = read('web/js/world.js');
const screens = read('web/js/screens.js');
const html = read('web/index.html');
const expansion = read('web/js/expansion-maps.js');
const detail = read('web/js/arena-detail.js');
const ids = ['arena','galpao','favela','ferro','cidade','apocalipse','porto','floresta','castelo','baseaerea','oeste'];
for (const id of ids) {
  assert.match(maps, new RegExp('\\b' + id + ':\\s*\\{'), 'Mapa ausente: ' + id);
}
for (const id of ids.slice(6)) {
  assert.match(expansion, new RegExp('\\b' + id + ':\\s*\\{'), 'Tema ausente: ' + id);
  assert.ok(existsSync(new URL('../web/assets/maps/' + id + '.svg', import.meta.url)), 'Miniatura ausente: ' + id);
}
assert.match(world, /addArenaDetail\(group, id, quality\)/);
assert.match(world, /def\.build\(\{ group, obstacles, quality/);
assert.match(expansion, /obstacles\.push\(\{ type: 'box'/);
assert.match(expansion, /obstacles\.push\(\{ type: 'cyl'/);
assert.match(screens, /id \+ '\.svg'/);
assert.match(html, /expansion-maps\.js/);
assert.match(html, /arena-detail\.js/);
assert.match(detail, /quality !== 'high'/);
for (const p of ['web/js/expansion-maps.js','web/js/arena-detail.js','web/js/maps.js','web/js/world.js','web/js/screens.js']) {
  execFileSync(process.execPath, ['--check', new URL('../' + p, import.meta.url).pathname], { stdio: 'pipe' });
}
console.log('OK: 11 mapas, 5 miniaturas, integrações, colisões e sintaxe JS.');
