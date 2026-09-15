const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const USUARIO = { email: 'analista@ultralims.com.br', senha: 'Ultra@2026' };

let amostras = [];
let seq = 0;

function json(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function serveStatic(res, file, type) {
  fs.readFile(path.join(__dirname, file), (err, data) => {
    if (err) return json(res, 404, { erro: 'nao encontrado' });
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

function readBody(req, cb) {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    try {
      cb(raw ? JSON.parse(raw) : {});
    } catch (e) {
      cb({});
    }
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/index.html')) {
    return serveStatic(res, 'index.html', 'text/html; charset=utf-8');
  }
  if (req.method === 'GET' && url === '/app.js') {
    return serveStatic(res, 'app.js', 'application/javascript; charset=utf-8');
  }

  if (req.method === 'POST' && url === '/api/reset') {
    amostras = [];
    seq = 0;
    return json(res, 200, { ok: true });
  }

  if (req.method === 'POST' && url === '/api/login') {
    return readBody(req, (body) => {
      if (body.email === USUARIO.email && body.senha === USUARIO.senha) {
        return json(res, 200, { token: 'token-de-teste', email: body.email });
      }
      return json(res, 401, { erro: 'Credenciais invalidas' });
    });
  }

  if (req.method === 'GET' && url === '/api/amostras') {
    // A listagem responde com latencia variavel, como no ambiente de homologacao.
    // Ordem: da amostra mais recente para a mais antiga.
    const atraso = 300 + Math.floor(Math.random() * 1500);
    const lista = amostras.slice().reverse();
    return setTimeout(() => json(res, 200, lista), atraso);
  }

  if (req.method === 'POST' && url === '/api/amostras') {
    return readBody(req, (body) => {
      if (!body.cliente || !body.material) {
        return json(res, 400, { erro: 'cliente e material sao obrigatorios' });
      }
      seq += 1;
      const amostra = {
        codigo: 'AM-' + String(seq).padStart(4, '0'),
        cliente: body.cliente,
        material: body.material,
        resultado: null,
        status: 'Em analise'
      };
      amostras.push(amostra);
      return json(res, 201, amostra);
    });
  }

  const mResultado = url.match(/^\/api\/amostras\/([^/]+)\/resultado$/);
  if (req.method === 'POST' && mResultado) {
    return readBody(req, (body) => {
      const a = amostras.find((x) => x.codigo === mResultado[1]);
      if (!a) return json(res, 404, { erro: 'amostra nao encontrada' });
      a.resultado = body.valor;
      a.status = 'Aguardando liberacao';
      return json(res, 200, a);
    });
  }

  const mLaudo = url.match(/^\/api\/amostras\/([^/]+)\/laudo$/);
  if (req.method === 'POST' && mLaudo) {
    const a = amostras.find((x) => x.codigo === mLaudo[1]);
    if (!a) return json(res, 404, { erro: 'amostra nao encontrada' });
    if (a.resultado === null || a.resultado === undefined || a.resultado === '') {
      return json(res, 409, { erro: 'nao e possivel liberar laudo sem resultado' });
    }
    a.status = 'Liberado';
    return json(res, 200, a);
  }

  return json(res, 404, { erro: 'rota nao encontrada' });
});

server.listen(PORT, () => {
  console.log('Ultra LIMS (ambiente de teste) em http://localhost:' + PORT);
});
