"use strict";

function formatarDocumento(valor, tipo) {
  const digitos = valor.replace(/\D/g, "").slice(0, tipo === "cep" ? 8 : 11);
  if (tipo === "cep") return digitos.replace(/^(\d{5})(\d+)/, "$1-$2");
  if (tipo === "cpf") return digitos.replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/\.(\d{3})(\d)/, ".$1.$2").replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  if (digitos.length <= 2) return digitos ? "(" + digitos : "";
  const numero = digitos.slice(2);
  const corte = numero.length === 9 || (numero.length !== 8 && numero.startsWith("9")) ? 5 : 4;
  return "(" + digitos.slice(0, 2) + ") " + numero.slice(0, corte) + (numero.length > corte ? "-" + numero.slice(corte) : "");
}

for (const campo of document.querySelectorAll("[data-mask]")) {
  campo.addEventListener("input", () => {
    const antes = campo.value.slice(0, campo.selectionStart).replace(/\D/g, "").length;
    campo.value = formatarDocumento(campo.value, campo.dataset.mask);
    let posicao = 0, vistos = 0;
    while (posicao < campo.value.length && vistos < antes) {
      if (/\d/.test(campo.value[posicao])) vistos++;
      posicao++;
    }
    campo.setSelectionRange(posicao, posicao);
    if (campo.name === "cep") {
      campo.dataset.local = "";
      campo.form.querySelector(".cep-status").textContent = "";
    }
  });
}

async function consultarCep(campo) {
  const valor = campo.value;
  if (!/^\d{5}-\d{3}$/.test(valor) || campo.dataset.local) return;
  const status = campo.form.querySelector(".cep-status");
  status.textContent = "Consultando CEP…";
  try {
    const resposta = await fetch("https://viacep.com.br/ws/" + valor.replace("-", "") + "/json/", {
      signal: AbortSignal.timeout(4500), credentials: "omit", referrerPolicy: "no-referrer"
    });
    if (!resposta.ok) throw new Error();
    const dados = await resposta.json();
    if (campo.value !== valor) return;
    campo.dataset.local = dados.localidade && dados.uf ? dados.localidade + ", " + dados.uf : "";
    status.textContent = campo.dataset.local || "CEP não encontrado. Você pode continuar.";
  } catch {
    if (campo.value === valor) status.textContent = "Consulta indisponível. Você pode continuar com este CEP.";
  }
}

document.querySelector("[data-mask=cep]")?.addEventListener("blur", evento => consultarCep(evento.target));

for (const botao of document.querySelectorAll("[data-eye]")) {
  const campo = document.getElementById(botao.dataset.eye);
  botao.addEventListener("click", () => {
    const mostrar = campo.type === "password";
    campo.type = mostrar ? "text" : "password";
    botao.setAttribute("aria-pressed", String(mostrar));
    botao.setAttribute("aria-label", (mostrar ? "Ocultar " : "Mostrar ") + campo.labels[0].textContent.toLowerCase());
    botao.querySelector("use").setAttribute("href", "images/interface.svg#" + (mostrar ? "olho-fechado" : "olho"));
  });
}

function validarSenhas(form) {
  const { senha, confirmacao } = form.elements;
  const longa = senha.value.length >= 6;
  const iguais = Boolean(confirmacao.value) && senha.value === confirmacao.value;
  senha.setAttribute("aria-invalid", String(Boolean(senha.value) && !longa));
  confirmacao.setAttribute("aria-invalid", String(Boolean(confirmacao.value) && !iguais));
  confirmacao.setCustomValidity(confirmacao.value && !iguais ? "As senhas precisam coincidir." : "");
  for (const [regra, preenchida, passa] of [
    ["tamanho", senha.value, longa], ["iguais", confirmacao.value, iguais]
  ]) {
    const dica = form.querySelector('[data-rule="' + regra + '"]');
    const estado = !preenchida ? "" : passa ? "ok" : "erro";
    dica.dataset.estado = estado;
    const textos = regra === "tamanho"
      ? { "": "Mínimo de 6 caracteres", ok: "✓ Mínimo de 6 caracteres", erro: "Use ao menos 6 caracteres" }
      : { "": "As senhas devem coincidir", ok: "✓ As senhas coincidem", erro: "As senhas ainda não coincidem" };
    dica.textContent = textos[estado];
  }
}

for (const form of document.querySelectorAll("form:has([name=confirmacao])")) {
  for (const campo of [form.elements.senha, form.elements.confirmacao]) campo.addEventListener("input", () => validarSenhas(form));
}

function dadosFormulario(form) {
  const { nome, email, cpf, telefone, cep } = form.elements;
  const dados = { nome: nome.value.trim().replace(/\s+/g, " "), email: email.value.trim().toLowerCase(),
    cpf: cpf.value, telefone: telefone.value, cep: cep.value, localidade: cep.dataset.local || "" };
  if (!dados.nome) throw new Error("Informe seu nome completo.");
  return dados;
}
