"use strict";

const nomesMetodos = { email: "E-mail", google: "Google", apple: "Apple", facebook: "Facebook" };

function contaAtiva() {
  const sessao = ler("sessao");
  return sessao?.id ? ler("contas", []).find(conta => conta.id === sessao.id) : null;
}

function iniciaisNome(nome) {
  const partes = nome.trim().split(/\s+/);
  return (Array.from(partes[0])[0] + (partes.length > 1 ? Array.from(partes.at(-1))[0] : "")).toLocaleUpperCase("pt-BR");
}

function atualizarConta() {
  const conta = contaAtiva();
  const link = document.querySelector("[data-account]");
  link.href = conta ? "perfil.html" : "login.html";
  link.querySelector("svg").toggleAttribute("hidden", Boolean(conta));
  const avatar = link.querySelector(".account-avatar");
  avatar.hidden = !conta;
  avatar.textContent = conta ? iniciaisNome(conta.nome) : "";
  link.querySelector(".account-name").textContent = conta ? conta.nome.split(/\s+/)[0] : "Minha conta";
  link.setAttribute("aria-label", conta ? "Meu perfil, " + conta.nome : "Minha conta");
  document.querySelector(".site-footer a[data-account-footer]").href = link.href;
}

function atualizarContas(alteracao) {
  function gravar() {
    const contas = ler("contas", []);
    const atualizada = alteracao(contas);
    if (!salvar("contas", contas)) throw new Error("Não foi possível salvar os dados neste navegador.");
    return atualizada;
  }
  return navigator.locks ? navigator.locks.request("luxestay-contas", gravar) : Promise.resolve().then(gravar);
}

function iniciarSessao(conta) {
  if (!salvar("sessao", { id: conta.id })) throw new Error("Não foi possível iniciar a sessão neste navegador.");
}

function contaPorEmail(contas, email) {
  return contas.find(conta => conta.email.toLowerCase() === email.trim().toLowerCase());
}

async function assinatura(senha, sal) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits({
    name: "PBKDF2", salt: new TextEncoder().encode(sal), iterations: 600000, hash: "SHA-256"
  }, material, 256);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function senhaInvalida() {
  return new Error("E-mail ou senha inválidos.");
}

async function entrarComEmail(email, senha) {
  const conta = contaPorEmail(ler("contas", []), email);
  if (!conta?.hash || conta.hash !== await assinatura(senha, conta.sal)) throw senhaInvalida();
  const atual = await atualizarContas(contas => {
    const registro = contaPorEmail(contas, email);
    if (!registro || registro.hash !== conta.hash) throw senhaInvalida();
    // Cadastros da primeira versão passam a ter um identificador no primeiro acesso.
    registro.id ||= crypto.randomUUID();
    registro.metodo ||= "email";
    return registro;
  });
  iniciarSessao(atual);
}

async function criarConta(dados, senha) {
  const sal = crypto.randomUUID();
  const nova = { ...dados, id: crypto.randomUUID(), metodo: "email", sal, hash: await assinatura(senha, sal) };
  await atualizarContas(contas => {
    if (contaPorEmail(contas, nova.email)) throw new Error("Este e-mail já está cadastrado.");
    contas.push(nova);
    return nova;
  });
  iniciarSessao(nova);
}

async function entrarComProvedor(metodo) {
  const conta = await atualizarContas(contas => {
    // Cada provedor tem um perfil fictício próprio neste navegador.
    const existente = contas.find(item => item.metodo === metodo);
    if (existente) return existente;
    const id = crypto.randomUUID();
    const nova = { id, metodo, nome: "Visitante " + nomesMetodos[metodo],
      email: metodo + "." + id.slice(0, 8) + "@example.test" };
    contas.push(nova);
    return nova;
  });
  iniciarSessao(conta);
}

function prefixoReservasConta(id) {
  return "reserva-conta:" + id + ":";
}

function destinoCheckout() {
  const retorno = parametros.get("continuar");
  if (!retorno) return null;
  try {
    const url = new URL(retorno, location.href);
    const pagamento = new URL("pagamento.html", location.href);
    if (url.origin === pagamento.origin && url.pathname === pagamento.pathname && url.searchParams.get("id")) {
      return "pagamento.html" + url.search;
    }
  } catch { /* Um endereço de retorno inválido leva ao perfil padrão. */ }
  return null;
}

function enderecoPerfil() {
  const retorno = destinoCheckout();
  return retorno ? "perfil.html?" + new URLSearchParams({ continuar: retorno }) : "perfil.html";
}

atualizarConta();
window.addEventListener("pageshow", atualizarConta);
window.addEventListener("storage", evento => {
  if ([null, "luxestay:sessao", "luxestay:contas"].includes(evento.key)) atualizarConta();
});
