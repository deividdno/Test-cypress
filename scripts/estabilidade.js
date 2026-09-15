// Roda a suite 10 vezes seguidas e informa quantas execucoes passaram.
// A aplicacao precisa estar rodando (npm run app) em outro terminal.
const { spawnSync } = require('child_process');

const TOTAL = Number(process.env.RODADAS || 10);
let sucessos = 0;
const falhas = [];

for (let i = 1; i <= TOTAL; i++) {
  process.stdout.write('Execucao ' + i + ' de ' + TOTAL + '... ');
  const r = spawnSync('npx', ['cypress', 'run'], { encoding: 'utf8', shell: true });
  if (r.status === 0) {
    sucessos++;
    console.log('passou');
  } else {
    falhas.push(i);
    console.log('falhou');
  }
}

console.log('\n----------------------------------------');
console.log('Execucoes que passaram: ' + sucessos + ' de ' + TOTAL);
if (falhas.length) console.log('Falharam nas execucoes: ' + falhas.join(', '));
console.log('----------------------------------------');
