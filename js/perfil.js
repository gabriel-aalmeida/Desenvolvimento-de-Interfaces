"use strict";

const paginaPerfil = document.querySelector(".profile-page");
const formularioPerfil = document.querySelector("#form-perfil");
const formularioSenha = document.querySelector("#form-senha");
const botaoEditar = document.querySelector("#editar-dados");
const listaDados = document.querySelector("#lista-dados");
const idPerfil = contaAtiva()?.id;
let tempoAviso;

function notificar(mensagem) {
  const aviso = document.querySelector("#perfil-toast");
  clearTimeout(tempoAviso);
  aviso.textContent = mensagem;
  tempoAviso = setTimeout(() => { aviso.textContent = ""; }, 5500);
}

function exibirDados(conta) {
  document.querySelector("#perfil-avatar").textContent = iniciaisNome(conta.nome);
  document.querySelector("#perfil-nome").textContent = conta.nome;
  document.querySelector("#perfil-metodo").textContent = "Acesso com " + nomesMetodos[conta.metodo || "email"];
  for (const linha of listaDados.querySelectorAll("[data-personal]")) {
    const campo = linha.dataset.personal;
    linha.textContent = campo === "cep" && conta.localidade && conta.cep
      ? conta.cep + " · " + conta.localidade : conta[campo] || "Não informado";
  }
  const social = conta.metodo && conta.metodo !== "email";
  formularioSenha.hidden = Boolean(social);
  const descricao = document.querySelector("#acesso-social");
  descricao.hidden = !social;
  if (social) descricao.textContent = "Você acessa este perfil de demonstração com " + nomesMetodos[conta.metodo] + ". Esse método dispensa senha no LuxeStay.";
}

function exibirReservas() {
  const lista = document.querySelector("#reservas-perfil");
  const prefixo = "luxestay:" + prefixoReservasConta(idPerfil);
  const reservas = Object.keys(localStorage).filter(chave => chave.startsWith(prefixo))
    .map(chave => ler(chave.slice("luxestay:".length))).filter(reserva => reserva?.contaId === idPerfil)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
  lista.replaceChildren();
  if (!reservas.length) {
    lista.append(document.querySelector("#sem-reservas").content.cloneNode(true));
    return;
  }
  for (const reserva of reservas) {
    const hotel = hospedagens.find(item => item.id === reserva.hotelId);
    if (!hotel) continue;
    const card = document.querySelector("#cartao-reserva").content.cloneNode(true);
    const imagem = card.querySelector(".stay-photo");
    imagem.innerHTML = fotoHotel(hotel);
    const link = card.querySelector("h3 a");
    link.href = urlHotel("detalhes.html", hotel.id);
    link.textContent = hotel.nome;
    card.querySelector(".booking-city").textContent = hotel.cidade + ", " + hotel.uf;
    card.querySelector(".booking-code").textContent = reserva.codigo;
    for (const chave of ["checkin", "checkout"]) {
      const data = card.querySelector('[data-date="' + chave + '"]');
      data.dateTime = reserva[chave];
      data.textContent = dataExibida(reserva[chave]);
    }
    card.querySelector(".booking-guests").textContent = resumoGrupo(reserva);
    card.querySelector(".booking-total").textContent = moeda.format(reserva.totalCentavos / 100);
    lista.append(card);
  }
  observarFotos(lista);
}

function abrirSecao(focar = false) {
  const secao = ["dados", "reservas", "seguranca"].includes(location.hash.slice(1)) ? location.hash.slice(1) : "dados";
  for (const painel of document.querySelectorAll(".profile-panel")) painel.hidden = painel.id !== secao;
  for (const item of document.querySelectorAll(".profile-nav a")) {
    if (item.hash === "#" + secao) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  }
  if (secao === "reservas") exibirReservas();
  if (focar) document.querySelector("#titulo-" + secao).focus({ preventScroll: true });
}

function sincronizarPerfil() {
  const conta = contaAtiva();
  if (!conta) {
    paginaPerfil.hidden = true;
    location.replace("login.html");
    return;
  }
  if (conta.id !== idPerfil) {
    paginaPerfil.hidden = true;
    location.reload();
    return;
  }
  exibirDados(conta);
  abrirSecao();
  paginaPerfil.hidden = false;
}

function editarPerfil(abrir) {
  const conta = contaAtiva();
  if (!conta || conta.id !== idPerfil) return sincronizarPerfil();
  botaoEditar.setAttribute("aria-expanded", String(abrir));
  listaDados.hidden = abrir;
  formularioPerfil.hidden = !abrir;
  if (abrir) {
    for (const campo of ["nome", "email", "cpf", "telefone", "cep"]) formularioPerfil.elements[campo].value = conta[campo] || "";
    formularioPerfil.elements.cep.dataset.local = conta.localidade || "";
    formularioPerfil.querySelector(".cep-status").textContent = conta.localidade || "";
    formularioPerfil.querySelector(".account-error").textContent = "";
    formularioPerfil.elements.nome.focus();
  } else botaoEditar.focus();
}

botaoEditar.addEventListener("click", () => editarPerfil(formularioPerfil.hidden));
document.querySelector("#cancelar-edicao").addEventListener("click", () => editarPerfil(false));

async function salvarAlteracao(form, alterar, sucesso) {
  const botao = form.querySelector("[type=submit]");
  if (botao.disabled) return;
  botao.disabled = true;
  const erro = form.querySelector(".account-error");
  erro.textContent = "";
  try {
    await alterar();
    if (contaAtiva()?.id !== idPerfil) return sincronizarPerfil();
    atualizarConta();
    exibirDados(contaAtiva());
    sucesso();
  } catch (problema) {
    erro.textContent = problema.message || "Não foi possível salvar. Tente novamente.";
  } finally { botao.disabled = false; }
}

function contaParaEditar(contas) {
  const conta = contas.find(item => item.id === idPerfil);
  if (!conta || ler("sessao")?.id !== idPerfil) throw new Error("A sessão mudou. Entre novamente.");
  return conta;
}

formularioPerfil.addEventListener("submit", evento => {
  evento.preventDefault();
  salvarAlteracao(formularioPerfil, () => {
    const dados = dadosFormulario(formularioPerfil);
    return atualizarContas(contas => {
      const conta = contaParaEditar(contas);
      const outra = contaPorEmail(contas, dados.email);
      if (outra && outra.id !== conta.id) throw new Error("Este e-mail já está cadastrado.");
      Object.assign(conta, dados);
      return conta;
    });
  }, () => {
    editarPerfil(false);
    notificar("✓ Dados atualizados com sucesso!");
  });
});

formularioSenha.addEventListener("submit", evento => {
  evento.preventDefault();
  validarSenhas(formularioSenha);
  if (!formularioSenha.reportValidity()) return;
  salvarAlteracao(formularioSenha, async () => {
    const conta = contaAtiva();
    if (!conta?.hash || conta.id !== idPerfil) throw new Error("Entre novamente para alterar a senha.");
    const { atual, senha } = formularioSenha.elements;
    const novaSenha = senha.value;
    if (await assinatura(atual.value, conta.sal) !== conta.hash) throw new Error("A senha atual está incorreta.");
    const sal = crypto.randomUUID();
    const hash = await assinatura(novaSenha, sal);
    return atualizarContas(contas => {
      const registro = contaParaEditar(contas);
      if (registro.hash !== conta.hash) throw new Error("A senha foi alterada em outra aba. Tente novamente.");
      Object.assign(registro, { sal, hash });
      return registro;
    });
  }, () => {
    formularioSenha.reset();
    validarSenhas(formularioSenha);
    notificar("✓ Senha atualizada com sucesso!");
  });
});

document.querySelector("#sair-conta").addEventListener("click", () => {
  localStorage.removeItem("luxestay:sessao");
  paginaPerfil.hidden = true;
  location.replace("index.html");
});

const retornoPagamento = destinoCheckout();
if (retornoPagamento) {
  document.querySelector("#retomar-pagamento").href = retornoPagamento;
  document.querySelector(".checkout-return").hidden = false;
}

sincronizarPerfil();
window.addEventListener("hashchange", () => abrirSecao(true));
window.addEventListener("pageshow", sincronizarPerfil);
window.addEventListener("storage", sincronizarPerfil);
