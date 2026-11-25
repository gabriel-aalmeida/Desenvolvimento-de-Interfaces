"use strict";

const abasConta = Array.from(document.querySelectorAll(".auth-tabs [role=tab]"));
const erroAcesso = document.getElementById("acesso-status");
const cardAcesso = document.querySelector(".auth-card");

function selecionarAba(ativa) {
  for (const aba of abasConta) {
    const selecionada = aba === ativa;
    aba.setAttribute("aria-selected", String(selecionada));
    aba.tabIndex = selecionada ? 0 : -1;
    document.getElementById(aba.getAttribute("aria-controls")).hidden = !selecionada;
  }
  erroAcesso.textContent = "";
}

for (const [indice, aba] of abasConta.entries()) {
  aba.addEventListener("click", () => selecionarAba(aba));
  aba.addEventListener("keydown", evento => {
    const indices = { ArrowLeft: 1 - indice, ArrowRight: 1 - indice, Home: 0, End: 1 };
    if (!(evento.key in indices)) return;
    evento.preventDefault();
    const proxima = abasConta[indices[evento.key]];
    selecionarAba(proxima);
    proxima.focus();
  });
}

async function acessar(operacao) {
  if (cardAcesso.getAttribute("aria-busy") === "true") return;
  const botoes = cardAcesso.querySelectorAll("button");
  for (const botao of botoes) botao.disabled = true;
  cardAcesso.setAttribute("aria-busy", "true");
  erroAcesso.textContent = "";
  try {
    await operacao();
    location.replace(enderecoPerfil());
  } catch (erro) {
    erroAcesso.textContent = erro.message || "Não foi possível acessar a conta. Tente novamente.";
  } finally {
    cardAcesso.removeAttribute("aria-busy");
    for (const botao of botoes) botao.disabled = false;
  }
}

document.querySelector("#form-login").addEventListener("submit", evento => {
  evento.preventDefault();
  const { email, senha } = evento.currentTarget.elements;
  acessar(() => entrarComEmail(email.value, senha.value));
});

document.querySelector("#form-cadastro").addEventListener("submit", evento => {
  evento.preventDefault();
  const form = evento.currentTarget;
  validarSenhas(form);
  if (form.reportValidity()) acessar(() => criarConta(dadosFormulario(form), form.elements.senha.value));
});

for (const botao of document.querySelectorAll("[data-provider]")) {
  botao.addEventListener("click", () => acessar(() => entrarComProvedor(botao.dataset.provider)));
}

function verificarAcesso() {
  if (contaAtiva()) location.replace(enderecoPerfil());
}
verificarAcesso();
window.addEventListener("pageshow", verificarAcesso);
window.addEventListener("storage", verificarAcesso);
