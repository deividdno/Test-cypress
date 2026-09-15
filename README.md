# Desafio Técnico — Analista de QA Júnior

Obrigado pelo interesse na vaga. Não cronometramos nada aqui: faça com calma, no seu ritmo. O prazo de entrega é combinado com o RH conforme email. 

Não precisa ficar perfeito: queremos entender como você pensa.

## Contexto

Este repositório contém uma versão reduzida do nosso sistema (ambiente de teste local) e uma suíte de testes em Cypress escrita às pressas por alguém que já saiu do time.

A suíte tem dois problemas: ela **não é confiável** (às vezes passa, às vezes falha, sem que nada tenha mudado no produto) e **não é confiável no outro sentido** (alguns testes passariam mesmo se o sistema estivesse quebrado).

Seu trabalho é deixar essa suíte digna de rodar no pipeline a cada build.

## Como rodar

Você precisa de Node.js 18 ou superior.

```bash
npm install

# terminal 1 — sobe a aplicação em http://localhost:4173
npm run app

# terminal 2 — roda a suíte
npm run cy:run

# terminal 2 — modo interativo, se preferir
npm run cy:open
```

Credenciais do ambiente de teste estão em `cypress/fixtures/usuarios.json`.

## O que esperamos

1. **A suíte precisa passar 10 vezes seguidas.** Use `npm run estabilidade` para verificar. Não vale aumentar tempo de espera até parar de falhar: queremos que a espera seja pelo que importa, não pelo relógio.
2. **Cada teste precisa falhar quando o sistema estiver errado.** Se uma verificação passa independentemente do comportamento do produto, ela não está testando nada.
3. **Cada teste precisa rodar sozinho.** Rodar um spec isolado tem que funcionar igual a rodar a suíte inteira.
4. Preencha o **`RELATORIO.md`** explicando cada alteração.

Documentação interna do time está em `docs/`. Vale a leitura antes de começar.

## Entrega

Envie o repositório com suas alterações (zip ou link de repositório público) contendo:

- o código corrigido;
- o `RELATORIO.md` preenchido.

**Use o template do `RELATORIO.md` como está. Não adicione seções além das previstas nele.**

## Sobre uso de IA

Você pode usar IA neste desafio, como usaria no trabalho. A regra é a mesma que vale aqui dentro: **você responde por tudo que entrega.** Vamos conversar sobre cada decisão do seu relatório na entrevista, então entregue apenas aquilo que você consegue explicar e sustentar.
