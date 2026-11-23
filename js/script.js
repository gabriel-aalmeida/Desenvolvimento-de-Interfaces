"use strict";

// Categorias, moeda e parâmetros da busca
const tipos = { hotel: "Hotel", pousada: "Pousada", resort: "Resort" };
const estados = {
  AL: "Alagoas",
  DF: "Distrito Federal",
  PE: "Pernambuco",
  RJ: "Rio de Janeiro",
  SC: "Santa Catarina"
};
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const parametros = new URLSearchParams(location.search);
const camposBusca = ["destino", "tipo", "checkin", "checkout", "hospedes"];
const chavesBusca = [...camposBusca, "oferta", "ordem"];

// Armazenamento local
function ler(chave, padrao = null) {
  try {
    return JSON.parse(localStorage.getItem("luxestay:" + chave)) ?? padrao;
  } catch {
    return padrao;
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem("luxestay:" + chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// Formatação, preços e links
function dataLocal(data) {
  return [data.getFullYear(), data.getMonth() + 1, data.getDate()]
    .map((parte) => String(parte).padStart(2, "0")).join("-");
}

function diaria(hotel) {
  return Math.round(hotel.preco * (100 - hotel.desconto)) / 100;
}

function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function urlHotel(pagina, id) {
  const consulta = new URLSearchParams({ id });
  for (const chave of chavesBusca) {
    if (parametros.get(chave)) consulta.set(chave, parametros.get(chave));
  }
  return pagina + "?" + consulta;
}

function urlResultados() {
  const consulta = new URLSearchParams();
  for (const chave of chavesBusca) {
    if (parametros.get(chave)) consulta.set(chave, parametros.get(chave));
  }
  return consulta.size ? "hospedagens.html?" + consulta : "hospedagens.html";
}

// Fotos e cartões do catálogo
function fotoHotel(hotel, carregamento = "lazy") {
  return `<img src="${hotel.imagem}" alt="${hotel.legenda}" loading="${carregamento}">
    <span class="photo-fallback" hidden>Foto indisponível</span>`;
}

function observarFotos(area) {
  for (const imagem of area.querySelectorAll(".stay-photo img")) {
    const falha = () => {
      imagem.hidden = true;
      imagem.nextElementSibling.hidden = false;
    };
    imagem.addEventListener("error", falha, { once: true });
    if (imagem.complete && !imagem.naturalWidth) falha();
  }
}

function mostrarCards(area, hoteis, somenteOfertas = false) {
  area.classList.toggle("offer-grid", somenteOfertas);
  area.innerHTML = hoteis.map((hotel) => {
    const local = somenteOfertas
      ? `${hotel.cidade} · ${estados[hotel.uf] || hotel.uf}`
      : `${hotel.cidade}, ${hotel.uf} · ${tipos[hotel.tipo]}`;
    return `
      <article class="col-md-4"><div class="card stay-card">
        <div class="stay-photo">
          ${fotoHotel(hotel)}
          <span class="card-badge${hotel.desconto ? " sale" : ""}">${hotel.desconto ? "−" + hotel.desconto + "% Black Friday" : tipos[hotel.tipo]}</span>
        </div>
        <div class="stay-content card-body">
          <p class="subtle">${local}</p>
          <h3><a href="${urlHotel("detalhes.html", hotel.id)}">${hotel.nome}</a></h3>
          <div class="stay-rates">
            <p class="price-label">${hotel.referencia ? "Diária" : "Diária simulada"}</p>
            <p class="stay-price">${moeda.format(hotel.preco)} <small>/ noite</small></p>
            ${hotel.desconto ? `<p class="price-label sale-price">Black Friday simulada: <strong>${moeda.format(diaria(hotel))}</strong> / noite</p>` : ""}
          </div>
        </div>
      </div></article>
    `;
  }).join("");
  observarFotos(area);
}

// Campos de data e validação
function mascararData(campo) {
  const original = campo.value;
  const cursor = campo.selectionStart ?? original.length;
  const antes = original.slice(0, cursor).replace(/\D/g, "").length;
  const digitos = original.replace(/\D/g, "").slice(0, 8);
  let formatada = digitos.slice(0, 2);
  if (digitos.length >= 2) formatada += "/" + digitos.slice(2, 4);
  if (digitos.length >= 4) formatada += "/" + digitos.slice(4);
  if (original === formatada) return;

  campo.value = formatada;
  let posicao = 0;
  let restantes = Math.min(antes, digitos.length);
  while (restantes > 0 && posicao < formatada.length) {
    if (formatada[posicao] !== "/") restantes--;
    posicao++;
  }
  if (formatada[posicao] === "/") posicao++;
  campo.setSelectionRange(posicao, posicao);
}

function dataDigitada(valor) {
  const texto = valor.trim().replace(/^(\d{2})(\d{2})(\d{4})$/, "$1/$2/$3");
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return "";
  const [, dia, mes, ano] = partes;
  const iso = ano + "-" + mes + "-" + dia;
  const data = new Date(iso + "T00:00:00Z");
  return Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) === iso ? iso : "";
}

function dataExibida(iso) {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join("/") : "";
}

function noitesEstadia(entrada, saida) {
  return (Date.parse(saida) - Date.parse(entrada)) / 86400000;
}

function campoData(nome, rotulo, id, ajuda) {
  return `<div class="reservation-date">
    <label for="${id}">${rotulo}</label>
    <div class="reservation-date-controls">
      <input id="${id}" name="${nome}" type="text" inputmode="numeric"
        placeholder="dd/mm/aaaa" autocomplete="off" aria-describedby="${ajuda}">
      <button class="action secondary" type="button" aria-label="Abrir calendário de ${rotulo}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>
        </svg>
        <span>Calendário</span>
      </button>
      <input class="reservation-picker" type="date" tabindex="-1" aria-hidden="true" aria-label="Calendário de ${rotulo}">
    </div>
  </div>`;
}

function conectarCalendario(campo, atualizar) {
  const grupo = campo.closest(".reservation-date-controls");
  const botao = grupo.querySelector("button");
  const calendario = grupo.querySelector(".reservation-picker");
  function mostrarCampoNativo() {
    botao.hidden = true;
    calendario.classList.remove("reservation-picker");
    calendario.removeAttribute("tabindex");
    calendario.removeAttribute("aria-hidden");
  }
  if (typeof calendario.showPicker !== "function") mostrarCampoNativo();
  botao.addEventListener("click", () => {
    try {
      calendario.showPicker();
    } catch {
      mostrarCampoNativo();
      calendario.focus();
    }
  });
  calendario.addEventListener("change", () => {
    campo.value = dataExibida(calendario.value);
    atualizar();
    if (calendario.classList.contains("reservation-picker")) botao.focus();
  });
  campo.addEventListener("beforeinput", (evento) => {
    const { selectionStart: inicio, selectionEnd: fim, value } = campo;
    if (inicio !== fim || inicio === null || !evento.cancelable) return;
    const voltar = evento.inputType === "deleteContentBackward" && value[inicio - 1] === "/";
    const avancar = evento.inputType === "deleteContentForward" && value[inicio] === "/" && inicio + 1 < value.length;
    if (!voltar && !avancar) return;
    evento.preventDefault();
    campo.setRangeText("", voltar ? inicio - 2 : inicio, voltar ? inicio : inicio + 2, "start");
    mascararData(campo);
    atualizar();
  });
  campo.addEventListener("input", () => {
    mascararData(campo);
    atualizar();
  });
  return calendario;
}

function configurarCamposData(formulario, obrigatorias, aoAlterar) {
  const { checkin, checkout } = formulario.elements;
  checkin.value = dataExibida(parametros.get("checkin") || "");
  checkout.value = dataExibida(parametros.get("checkout") || "");
  const calendarioEntrada = conectarCalendario(checkin, validar);
  const calendarioSaida = conectarCalendario(checkout, validar);

  function validar() {
    const entrada = dataDigitada(checkin.value);
    const saida = dataDigitada(checkout.value);
    const hoje = dataLocal(new Date());
    const entradaValida = entrada && entrada >= hoje;
    const formatoInvalido = "Digite uma data válida no formato dd/mm/aaaa.";
    checkin.required = obrigatorias || Boolean(checkout.value);
    checkout.required = obrigatorias || Boolean(checkin.value);
    checkin.setCustomValidity(checkin.value && !entrada ? formatoInvalido :
      entrada && !entradaValida ? "O check-in deve ser hoje ou depois." : "");
    checkout.setCustomValidity(checkout.value && !saida ? formatoInvalido :
      saida && entradaValida && saida <= entrada ? "O check-out deve ser posterior ao check-in." :
        saida && saida <= hoje ? "O check-out deve ser depois de hoje." : "");

    const proximo = new Date((entradaValida ? entrada : hoje) + "T12:00:00");
    proximo.setDate(proximo.getDate() + 1);
    calendarioEntrada.min = hoje;
    calendarioSaida.min = dataLocal(proximo);
    calendarioEntrada.value = entrada;
    calendarioSaida.value = saida;

    const datas = checkin.validity.valid && checkout.validity.valid ? { entrada, saida } : null;
    aoAlterar?.(datas);
    return datas;
  }
  validar();
  return validar;
}

// Preferências de acessibilidade
const tema = document.querySelector("#tema");
const tamanho = document.querySelector("#tamanho");
for (const [controle, chave, padrao] of [[tema, "theme", "light"], [tamanho, "size", "normal"]]) {
  controle.value = ler(chave, padrao);
  document.documentElement.dataset[chave] = controle.value || padrao;
  controle.addEventListener("change", () => {
    document.documentElement.dataset[chave] = controle.value;
    salvar(chave, controle.value);
  });
}
const acesso = document.querySelector(".access");
acesso.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && acesso.open) {
    acesso.open = false;
    acesso.querySelector("summary").focus();
  }
});

// Formulário de busca
const busca = document.querySelector(".formulario-busca");
if (busca) {
  const locais = [...new Set(hospedagens.map((hotel) => hotel.cidade))];
  const datalist = document.querySelector("#destinos");
  for (const nome of [...locais, ...hospedagens.map((hotel) => hotel.nome)]) {
    const opcao = document.createElement("option");
    opcao.value = nome;
    datalist.append(opcao);
  }
  for (const chave of camposBusca) {
    if (parametros.has(chave)) busca.elements[chave].value = parametros.get(chave);
  }
  if (!busca.elements.hospedes.value) busca.elements.hospedes.value = "2";
  if (!busca.elements.tipo.value) busca.querySelector('[name="tipo"][value=""]').checked = true;
  if (parametros.get("oferta") === "1") {
    const oferta = document.createElement("input");
    oferta.type = "hidden";
    oferta.name = "oferta";
    oferta.value = "1";
    busca.append(oferta);
  }
  const datasBusca = [["checkin", "Check-in"], ["checkout", "Check-out"]];
  for (const [nome, rotulo] of datasBusca) {
    busca.elements[nome].closest("label").outerHTML = campoData(nome, rotulo, nome, "ajuda-datas");
  }
  busca.querySelector("#ajuda-datas").textContent = "Digite dia, mês e ano ou use o calendário. Preencha as duas datas ou deixe ambas em branco.";
  configurarCamposData(busca, false);
  busca.addEventListener("formdata", ({ formData }) => {
    for (const [nome] of datasBusca) formData.set(nome, dataDigitada(busca.elements[nome].value));
  });
}

// Destaques e resultados do catálogo
const destaques = document.querySelector("#destaques");
if (destaques) {
  const ids = [12, 1, 25, 34, 4, 41, 2, 9];
  mostrarCards(destaques, ids.map((id) => hospedagens.find((hotel) => hotel.id === id)));
}

const lista = document.querySelector("#lista-hospedagens");
if (lista) {
  const somenteOfertas = document.querySelector("#somente-ofertas");
  const ordenacao = document.querySelector("#ordenacao");
  somenteOfertas.checked = parametros.get("oferta") === "1";
  const ordemInicial = parametros.get("ordem");
  ordenacao.value = ["price", "name"].includes(ordemInicial) ? ordemInicial : "recommended";
  function atualizarEndereco() {
    history.replaceState(null, "", location.pathname + (parametros.size ? "?" + parametros : "") + location.hash);
  }
  function atualizarResultados() {
    const consulta = normalizar(parametros.get("destino") || "").match(/[a-z0-9]+/g) || [];
    const quantidadeHospedes = Number(parametros.get("hospedes")) || 1;
    const tipo = parametros.get("tipo");
    const selecionados = hospedagens.filter((hotel) => {
      const local = normalizar([hotel.nome, hotel.cidade, hotel.uf, hotel.bairro].join(" "));
      return consulta.every((termo) => local.includes(termo)) &&
        (!Object.hasOwn(tipos, tipo) || hotel.tipo === tipo) && hotel.capacidade >= quantidadeHospedes &&
        (!somenteOfertas.checked || hotel.desconto > 0);
    });
    if (ordenacao.value === "price") selecionados.sort((a, b) => (somenteOfertas.checked ? diaria(a) - diaria(b) : a.preco - b.preco));
    if (ordenacao.value === "name") selecionados.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    document.querySelector("#quantidade-resultados").textContent = selecionados.length === 1 ?
      "1 hospedagem encontrada" : selecionados.length + " hospedagens encontradas";
    const emOferta = somenteOfertas.checked;
    document.querySelector("#titulo-resultados").textContent = emOferta ? "Ofertas de Black Friday" : "Resultados";
    document.querySelector("#aviso-ofertas").hidden = !emOferta;
    mostrarCards(lista, selecionados, emOferta);
    if (!selecionados.length) lista.innerHTML = '<p class="notice">Nenhum resultado. Ajuste o destino, o tipo ou o número de hóspedes.</p>';
  }
  somenteOfertas.addEventListener("change", () => {
    const campo = busca.querySelector('[name="oferta"]');
    if (somenteOfertas.checked) {
      parametros.set("oferta", "1");
      if (!campo) {
        const oferta = document.createElement("input");
        Object.assign(oferta, { type: "hidden", name: "oferta", value: "1" });
        busca.append(oferta);
      }
    } else {
      parametros.delete("oferta");
      campo?.remove();
    }
    atualizarEndereco();
    atualizarResultados();
  });
  ordenacao.addEventListener("change", () => {
    if (ordenacao.value === "recommended") parametros.delete("ordem");
    else parametros.set("ordem", ordenacao.value);
    atualizarEndereco();
    atualizarResultados();
  });
  atualizarResultados();
}

// Carrossel Black Friday
const carrossel = document.querySelector("#ofertas-luxe");
if (carrossel) {
  for (const selo of carrossel.querySelectorAll("[data-deal-badge]")) {
    const hotel = hospedagens.find(({ id }) => id === Number(selo.dataset.dealBadge));
    selo.textContent = "Black Friday · " + hotel.desconto + "% OFF simulado";
    selo.closest(".deal-copy").querySelector(".deal-price").textContent = moeda.format(diaria(hotel)) + " / noite";
  }
  const slides = Array.from(carrossel.querySelectorAll(".carousel-item"));
  function anunciar(indice) {
    slides.forEach((slide, posicao) => { slide.inert = posicao !== indice; });
    carrossel.querySelector("#slide-atual").textContent = (indice + 1) + " / " + slides.length;
  }
  if (window.bootstrap?.Carousel) {
    new window.bootstrap.Carousel(carrossel, { interval: false, ride: false, keyboard: false });
    carrossel.addEventListener("slid.bs.carousel", (evento) => anunciar(evento.to));
  } else {
    let indice = 0;
    for (const botao of carrossel.querySelectorAll("[data-bs-slide]")) {
      botao.addEventListener("click", () => {
        slides[indice].classList.remove("active");
        const passo = botao.dataset.bsSlide === "next" ? 1 : -1;
        indice = (indice + passo + slides.length) % slides.length;
        slides[indice].classList.add("active");
        anunciar(indice);
      });
    }
  }
}

// Detalhes e estimativa da estadia
const detalhes = document.querySelector("#detalhes-hotel");
const reserva = document.querySelector("#reserva-hotel");
if (detalhes || reserva) {
  const hotel = hospedagens.find(({ id }) => id === Number(parametros.get("id")));
  if (!hotel) {
    (detalhes || reserva).innerHTML = '<h1>Hospedagem não encontrada</h1><p><a href="hospedagens.html">Voltar ao catálogo</a></p>';
  } else if (detalhes) {
    document.title = hotel.nome + " | LuxeStay";
    detalhes.innerHTML = `
      <a class="text-link back-link" href="${urlResultados()}">← Voltar às hospedagens</a>
      <p class="eyebrow">${tipos[hotel.tipo]} · ${hotel.cidade}, ${hotel.uf}</p>
      <h1>${hotel.nome}</h1>
      <p class="subtle">${hotel.bairro}</p>
      <div class="detail-layout">
        <div>
          <div class="stay-photo">${fotoHotel(hotel, "eager")}</div>
          ${hotel.fonteFoto ? `<p class="detail-caption"><a href="${hotel.fonteFoto}" rel="noopener noreferrer">Crédito da foto</a></p>` : ""}
          ${hotel.fonte ? `<p class="detail-caption"><a href="${hotel.fonte}" rel="noopener noreferrer">${hotel.referencia ? "Ver anúncio na Trivago" : "Fonte da foto"}</a></p>` : ""}
          <div class="detail-about"><h2>Sobre a hospedagem</h2><p>${hotel.descricao}</p></div>
        </div>
        <aside class="surface stack" aria-label="Preço e reserva">
          ${hotel.desconto ? `<p class="eyebrow">Black Friday · ${hotel.desconto}% de desconto simulado</p>` : ""}
          <p class="stay-price">${moeda.format(diaria(hotel))} <small>/ noite</small></p>
          <p class="subtle">${hotel.referencia ? "Preço e disponibilidade podem variar." : "Diária ilustrativa."}</p>
          <p class="subtle">A simulação deste projeto aceita até ${hotel.capacidade} hóspedes.</p>
          <a class="action" href="${urlHotel("reserva.html", hotel.id)}">Ver preço e reservar →</a>
        </aside>
      </div>`;
    observarFotos(detalhes);
  } else {
    reserva.innerHTML = `
      <a class="text-link back-link" href="${urlHotel("detalhes.html", hotel.id)}">← Voltar aos detalhes</a>
      <h1>Estimativa da estadia</h1><p class="subtle">${hotel.nome}</p>
      <form class="surface stack contact-form quote-form">
        <p id="reserva-data-ajuda" class="sr-only">Digite dia, mês e ano ou use o calendário.</p>
        <div class="quote-dates">
          ${campoData("checkin", "Check-in", "reserva-checkin", "reserva-data-ajuda")}
          ${campoData("checkout", "Check-out", "reserva-checkout", "reserva-data-ajuda")}
        </div>
        <p id="total-reserva" class="notice" aria-live="polite"></p>
        <button class="action" type="submit" disabled>Ir para pagamento →</button>
      </form>`;
    const form = reserva.querySelector("form");
    const total = form.querySelector("#total-reserva");
    const continuar = form.querySelector("button[type=submit]");

    function atualizarTotal(datas) {
      const noites = datas ? noitesEstadia(datas.entrada, datas.saida) : 0;
      total.textContent = noites ?
        (noites === 1 ? "1 noite" : noites + " noites") + " · Total estimado de " + moeda.format(noites * diaria(hotel)) :
        "Escolha as datas para ver o valor.";
      continuar.disabled = !datas;
    }

    const validarDatas = configurarCamposData(form, true, atualizarTotal);
    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const datas = validarDatas();
      if (!datas) {
        form.reportValidity();
        return;
      }
      const destino = new URL(urlHotel("pagamento.html", hotel.id), location.href);
      destino.searchParams.set("checkin", datas.entrada);
      destino.searchParams.set("checkout", datas.saida);
      location.assign(destino.href);
    });
  }
}

// Checkout e confirmação de teste
const pagamento = document.querySelector("#pagamento-hotel");
if (pagamento) {
  const hotel = hospedagens.find(({ id }) => id === Number(parametros.get("id")));
  const entrada = dataDigitada(dataExibida(parametros.get("checkin") || ""));
  const saida = dataDigitada(dataExibida(parametros.get("checkout") || ""));
  const hospedesBusca = Number(parametros.get("hospedes"));
  const diasValidos = entrada && saida && entrada >= dataLocal(new Date()) && saida > entrada;
  const reservaValida = hotel && diasValidos;

  if (!reservaValida) {
    const voltar = hotel ? urlHotel("reserva.html", hotel.id) : "hospedagens.html";
    pagamento.innerHTML = `<h1>Pagamento</h1>
      <p class="notice">Revise a hospedagem e as datas para continuar.</p>
      <a class="action" href="${voltar}">${hotel ? "Revisar estadia" : "Ver hospedagens"}</a>`;
  } else {
    const noites = noitesEstadia(entrada, saida);
    const total = moeda.format(noites * diaria(hotel));
    const hospedesInicial = Number.isInteger(hospedesBusca) && hospedesBusca >= 1 && hospedesBusca <= hotel.capacidade ? hospedesBusca : 1;
    pagamento.innerHTML = `
      <a class="text-link back-link" id="checkout-editar" href="${urlHotel("reserva.html", hotel.id)}">← Editar estadia</a>
      <h1>Pagamento</h1>
      <div class="detail-layout checkout-layout">
        <section class="surface stack" aria-labelledby="checkout-titulo">
          <h2 id="checkout-titulo">Resumo da reserva</h2>
          <h3>${hotel.nome}</h3>
          <dl class="checkout-summary">
            <dt>Check-in</dt><dd>${dataExibida(entrada)}</dd>
            <dt>Check-out</dt><dd>${dataExibida(saida)}</dd>
            <dt>Noites</dt><dd>${noites}</dd>
          </dl>
          <p class="stay-price">Total estimado ${total}</p>
        </section>
        <section class="surface stack" aria-labelledby="checkout-pagamento">
          <h2 id="checkout-pagamento">Confirmar reserva</h2>
          <label for="checkout-hospedes">Hóspedes</label>
          <select id="checkout-hospedes">
            ${Array.from({ length: hotel.capacidade }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
          </select>
          <p class="notice">Modo de teste. O LuxeStay ainda não recebe pagamentos nem confirma disponibilidade com o hotel.</p>
          <button class="action" type="button" id="checkout-confirmar">Confirmar reserva</button>
          <p class="form-status" id="checkout-status" role="status"></p>
        </section>
      </div>`;

    const botao = pagamento.querySelector("#checkout-confirmar");
    const status = pagamento.querySelector("#checkout-status");
    const hospedes = pagamento.querySelector("#checkout-hospedes");
    const editar = pagamento.querySelector("#checkout-editar");
    hospedes.value = String(hospedesInicial);
    const chaveReserva = () => ["reserva-teste", hotel.id, entrada, saida, hospedes.value].join(":");
    function mostrarConfirmacao(codigo) {
      status.textContent = "Reserva de teste registrada neste navegador. Código: " + codigo;
      botao.disabled = true;
    }
    function atualizarConfirmacao() {
      const existente = ler(chaveReserva());
      status.textContent = "";
      botao.disabled = false;
      if (typeof existente === "string") mostrarConfirmacao(existente);
    }
    hospedes.addEventListener("change", () => {
      parametros.set("hospedes", hospedes.value);
      const url = new URL(location.href);
      url.searchParams.set("hospedes", hospedes.value);
      history.replaceState(null, "", url);
      editar.href = urlHotel("reserva.html", hotel.id);
      atualizarConfirmacao();
    });
    atualizarConfirmacao();

    botao.addEventListener("click", () => {
      const chave = chaveReserva();
      const codigo = ler(chave) || "LS-TESTE-" + crypto.randomUUID().slice(0, 8).toUpperCase();
      if (!salvar(chave, codigo)) {
        status.textContent = "O navegador não conseguiu salvar a reserva de teste.";
        return;
      }
      mostrarConfirmacao(codigo);
    });
  }
}

// Formulário de contato
const contato = document.querySelector("#form-contato");
contato?.addEventListener("submit", (evento) => {
  evento.preventDefault();
  contato.reset();
  contato.querySelector(".form-status").textContent = "Envio simulado. Nenhuma mensagem foi transmitida.";
});

// Conta e autenticação local
function atualizarConta() {
  const atual = ler("sessao");
  document.querySelector("[data-account]").textContent = atual ? "Minha conta" : "Entrar";
  const painel = document.querySelector("#sessao-conta");
  if (!painel) return;
  painel.hidden = !atual;
  painel.textContent = atual ? "Você entrou como " + atual.nome + "." : "";
  document.querySelector("#sair-conta").hidden = !atual;
  document.querySelector("#formularios-conta").hidden = Boolean(atual);
}

async function assinatura(senha, sal) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits({
    name: "PBKDF2", salt: new TextEncoder().encode(sal), iterations: 600000, hash: "SHA-256"
  }, material, 256);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

atualizarConta();
for (const form of document.querySelectorAll("#form-login, #form-cadastro")) {
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const status = form.querySelector(".form-status");
    const dados = new FormData(form);
    const email = dados.get("email").trim().toLowerCase();
    const senha = dados.get("senha");
    const cadastro = form.id === "form-cadastro";
    const nome = cadastro ? dados.get("nome").trim() : "";
    const botao = form.querySelector("button");
    botao.disabled = true;
    try {
      const contas = ler("contas", []);
      const conta = contas.find((item) => item.email === email);
      if (cadastro && (!nome || conta)) {
        status.textContent = conta ? "Já existe uma conta com esse e-mail neste navegador." : "Preencha seu nome.";
        return;
      }
      if (!cadastro && (!conta || conta.hash !== await assinatura(senha, conta.sal))) {
        status.textContent = "E-mail ou senha inválidos.";
        return;
      }
      if (cadastro) {
        const sal = crypto.randomUUID();
        const nova = { email, nome, sal, hash: await assinatura(senha, sal) };
        const atuais = ler("contas", []);
        if (atuais.some((item) => item.email === email)) {
          status.textContent = "Já existe uma conta com esse e-mail neste navegador.";
          return;
        }
        if (!salvar("contas", [...atuais, nova])) throw new Error("Armazenamento indisponível");
      }
      if (!salvar("sessao", { nome: cadastro ? nome : conta.nome })) throw new Error("Armazenamento indisponível");
      form.reset();
      status.textContent = "";
      atualizarConta();
      const sessao = document.querySelector("#sessao-conta");
      sessao.tabIndex = -1;
      sessao.focus();
    } catch {
      status.textContent = "Não foi possível acessar a conta. Abra o projeto pelo Live Server ou por HTTPS.";
    } finally {
      botao.disabled = false;
    }
  });
}
document.querySelector("#sair-conta")?.addEventListener("click", () => {
  salvar("sessao", null);
  atualizarConta();
  document.querySelector("#form-login input").focus();
});
