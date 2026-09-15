var amostraSelecionada = null;

function el(id) {
  return document.getElementById(id);
}

function mostrar(id) {
  ['tela-login', 'tela-amostras', 'tela-detalhe'].forEach(function (t) {
    el(t).classList.add('hidden');
  });
  el(id).classList.remove('hidden');
}

function carregarAmostras() {
  el('carregando-lista').classList.remove('hidden');
  fetch('/api/amostras')
    .then(function (r) { return r.json(); })
    .then(function (lista) {
      el('carregando-lista').classList.add('hidden');
      var corpo = el('lista-amostras');
      corpo.innerHTML = '';
      lista.forEach(function (a) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-cy', 'linha-amostra');
        tr.innerHTML =
          '<td data-cy="codigo-amostra">' + a.codigo + '</td>' +
          '<td>' + a.cliente + '</td>' +
          '<td>' + a.material + '</td>' +
          '<td>' + (a.resultado === null ? '-' : a.resultado) + '</td>' +
          '<td>' + a.status + '</td>';
        tr.addEventListener('click', function () { abrirDetalhe(a); });
        corpo.appendChild(tr);
      });
    });
}

function abrirDetalhe(a) {
  amostraSelecionada = a;
  document.querySelector('[data-cy=codigo-detalhe]').textContent = a.codigo;
  document.querySelector('[data-cy=status-laudo]').textContent = a.status;
  document.querySelector('[data-cy=erro-laudo]').textContent = '';
  document.querySelector('[data-cy=lancar-resultado]').value = '';
  mostrar('tela-detalhe');
}

document.querySelector('[data-cy=entrar]').addEventListener('click', function () {
  var email = document.querySelector('[data-cy=email]').value;
  var senha = document.querySelector('[data-cy=senha]').value;
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, senha: senha })
  }).then(function (r) {
    if (!r.ok) {
      document.querySelector('[data-cy=erro-login]').textContent = 'E-mail ou senha invalidos.';
      return;
    }
    return r.json().then(function (dados) {
      document.querySelector('[data-cy=usuario-logado]').textContent = dados.email;
      mostrar('tela-amostras');
      carregarAmostras();
    });
  });
});

document.querySelector('[data-cy=nova-amostra]').addEventListener('click', function () {
  el('form-amostra').classList.remove('hidden');
});

document.querySelector('[data-cy=salvar-amostra]').addEventListener('click', function () {
  var cliente = document.querySelector('[data-cy=cliente]').value;
  var material = document.querySelector('[data-cy=material]').value;
  fetch('/api/amostras', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente: cliente, material: material })
  }).then(function () {
    document.querySelector('[data-cy=cliente]').value = '';
    document.querySelector('[data-cy=material]').value = '';
    el('form-amostra').classList.add('hidden');
    carregarAmostras();
  });
});

document.querySelector('[data-cy=salvar-resultado]').addEventListener('click', function () {
  var valor = document.querySelector('[data-cy=lancar-resultado]').value;
  fetch('/api/amostras/' + amostraSelecionada.codigo + '/resultado', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor: valor })
  })
    .then(function (r) { return r.json(); })
    .then(function (a) {
      amostraSelecionada = a;
      document.querySelector('[data-cy=status-laudo]').textContent = a.status;
    });
});

document.querySelector('[data-cy=liberar-laudo]').addEventListener('click', function () {
  fetch('/api/amostras/' + amostraSelecionada.codigo + '/laudo', { method: 'POST' })
    .then(function (r) {
      return r.json().then(function (corpo) { return { ok: r.ok, corpo: corpo }; });
    })
    .then(function (res) {
      if (!res.ok) {
        document.querySelector('[data-cy=erro-laudo]').textContent = res.corpo.erro;
        return;
      }
      amostraSelecionada = res.corpo;
      document.querySelector('[data-cy=status-laudo]').textContent = res.corpo.status;
    });
});

document.querySelector('[data-cy=voltar]').addEventListener('click', function () {
  mostrar('tela-amostras');
  carregarAmostras();
});

document.querySelector('[data-cy=menu-amostras]').addEventListener('click', function () {
  mostrar('tela-amostras');
  carregarAmostras();
});
