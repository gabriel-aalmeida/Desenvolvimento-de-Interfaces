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
const camposBusca = ["destino", "tipo", "checkin", "checkout", "adultos", "criancas"];
const chavesBusca = [...camposBusca, "oferta", "ordem"];
// Links antigos traziam somente o total de hóspedes, sem a composição do grupo.
if (parametros.has("hospedes") && !parametros.has("adultos")) {
  parametros.set("adultos", parametros.get("hospedes"));
}
parametros.delete("hospedes");

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
function iconeInterface(nome, classes = "") {
  return `<svg class="ui-icon ${classes}" aria-hidden="true" focusable="false"><use href="images/interface.svg#${nome}"></use></svg>`;
}

function classificacaoHospedes(avaliacao) {
  if (avaliacao.classificacao) return avaliacao.classificacao;
  if (avaliacao.nota >= 9.5) return "Excepcional";
  if (avaliacao.nota >= 9) return "Fabuloso";
  if (avaliacao.nota >= 8) return "Muito bom";
  return avaliacao.nota >= 7 ? "Bom" : "Regular";
}

// As quatro famílias mais úteis na comparação aparecem primeiro nos cartões.
function principaisComodidades(nomes, limite) {
  const familias = ["cafe", "carro", "piscina", "wifi"];
  const principais = familias.map(icone => nomes.find(nome => comodidadesDetalhes[nome]?.[0] === icone));
  return [...new Set([...principais.filter(Boolean), ...nomes])].slice(0, limite);
}

function resumoDoCard(hotel) {
  const dados = dadosDetalhes[hotel.id];
  if (!dados) return "";
  const { avaliacao, comodidades } = dados;
  return `${avaliacao ? `<div class="stay-rating">
          <span class="score-badge">${avaliacao.nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}</span>
          <span><b>${classificacaoHospedes(avaliacao)}</b><small>${avaliacao.total.toLocaleString("pt-BR")} avaliações</small></span>
        </div>` : ""}
        <ul class="card-amenities" aria-label="Principais comodidades">
          ${principaisComodidades(comodidades, 3).map(nome => `<li>${iconeInterface(comodidadesDetalhes[nome]?.[0] || "check")}${nome}</li>`).join("")}
        </ul>
        <span class="card-cancel" title="Condição da reserva simulada">${iconeInterface("check")} Cancelamento grátis</span>`;
}

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
    const linkDetalhes = urlHotel("detalhes.html", hotel.id);
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
          <h3><a href="${linkDetalhes}">${hotel.nome}</a></h3>
          ${resumoDoCard(hotel)}
          <div class="stay-rates">
            <p class="price-label">${hotel.referencia ? "Diária" : "Diária simulada"}</p>
            <p class="stay-price">${hotel.desconto ? `<del>${moeda.format(hotel.preco)}</del>` : moeda.format(hotel.preco)} <small>/ noite</small></p>
            ${hotel.desconto ? `<p class="price-label sale-price">Black Friday simulada: <strong>${moeda.format(diaria(hotel))}</strong> / noite</p>` : ""}
          </div>
          <a class="action card-details" href="${linkDetalhes}" aria-label="Ver detalhes de ${hotel.nome}">Ver detalhes <span aria-hidden="true">→</span></a>
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
        ${iconeInterface("calendario")}
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
  configurarViajantes(busca);
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

// O destaque acompanha a seção aberta, inclusive na navegação pelo histórico.
function atualizarMenuPrincipal() {
  const menu = document.querySelector(".site-header nav");
  const inicio = menu.querySelector('[href="index.html"]');
  const hoteis = menu.querySelector('[href="hospedagens.html"]');
  const ofertas = menu.querySelector('[href="index.html#ofertas"]');
  if (!document.querySelector("#ofertas, #lista-hospedagens")) return;
  for (const link of [inicio, hoteis, ofertas]) link.removeAttribute("aria-current");
  const campanha = location.hash === "#ofertas" || (lista && parametros.get("oferta") === "1");
  (campanha ? ofertas : lista ? hoteis : inicio).setAttribute("aria-current", campanha ? "location" : "page");
}

// Destaques e resultados do catálogo
const destaques = document.querySelector("#destaques");
if (destaques) {
  const ids = [12, 1, 25, 34, 4, 41, 2, 9];
  mostrarCards(destaques, ids.map((id) => hospedagens.find((hotel) => hotel.id === id)));
  const atalhos = document.querySelectorAll('main a[href^="detalhes.html"], main a[href^="hospedagens.html"]');
  function atualizarAtalhos() {
    const { adultos, criancas, checkin, checkout } = busca.elements;
    if (!adultos.validity.valid || !criancas.validity.valid) return;
    for (const link of atalhos) {
      const destino = new URL(link.href);
      gravarGrupo(destino.searchParams, { adultos: adultos.value, criancas: criancas.value });
      for (const campo of [checkin, checkout]) {
        if (checkin.validity.valid && checkout.validity.valid && campo.value) {
          destino.searchParams.set(campo.name, dataDigitada(campo.value));
        } else {
          destino.searchParams.delete(campo.name);
        }
      }
      link.href = destino.href;
    }
  }
  busca.addEventListener("input", atualizarAtalhos);
  busca.addEventListener("change", atualizarAtalhos);
  atualizarAtalhos();
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
    atualizarMenuPrincipal();
    const consulta = normalizar(parametros.get("destino") || "").match(/[a-z0-9]+/g) || [];
    const tipo = parametros.get("tipo");
    const selecionados = hospedagens.filter((hotel) => {
      const local = normalizar([hotel.nome, hotel.cidade, hotel.uf, hotel.bairro].join(" "));
      return consulta.every((termo) => local.includes(termo)) &&
        (!Object.hasOwn(tipos, tipo) || hotel.tipo === tipo) &&
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
    if (!selecionados.length) lista.innerHTML = '<p class="notice">Nenhum resultado. Ajuste o destino, o tipo ou o filtro de ofertas.</p>';
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

atualizarMenuPrincipal();
window.addEventListener("hashchange", atualizarMenuPrincipal);

// Carrossel Black Friday
const carrossel = document.querySelector("#ofertas-luxe");
if (carrossel) {
  for (const selo of carrossel.querySelectorAll("[data-deal-badge]")) {
    const hotel = hospedagens.find(({ id }) => id === Number(selo.dataset.dealBadge));
    selo.textContent = "Black Friday · " + hotel.desconto + "% OFF simulado";
    const preco = selo.closest(".deal-copy").querySelector(".deal-price");
    preco.textContent = moeda.format(diaria(hotel)) + " / noite";
    preco.insertAdjacentHTML("beforebegin", resumoDoCard(hotel));
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

function camposViajantes() {
  return `<label>Adultos<input name="adultos" type="number" inputmode="numeric" min="1" step="1" required></label>
    <label>Crianças<input name="criancas" type="number" inputmode="numeric" min="0" step="1" required></label>`;
}

function configurarViajantes(form, aoAlterar) {
  for (const nome of ["adultos", "criancas"]) {
    const campo = form.elements[nome];
    const recebido = parametros.get(nome);
    const numero = Number(recebido);
    const valido = recebido && Number.isSafeInteger(numero) && numero >= Number(campo.min);
    campo.value = valido ? numero : (nome === "adultos" ? 2 : 0);
    campo.addEventListener("input", () => {
      campo.setCustomValidity(campo.value && !Number.isSafeInteger(campo.valueAsNumber)
        ? "Informe uma quantidade inteira válida." : "");
      aoAlterar?.();
    });
  }
}

function grupoDaReserva(form, hotel) {
  const { adultos, criancas } = form.elements;
  if (!adultos.validity.valid || !criancas.validity.valid) return null;
  const total = adultos.valueAsNumber + criancas.valueAsNumber;
  return { adultos: adultos.valueAsNumber, criancas: criancas.valueAsNumber, quartos: Math.ceil(total / hotel.capacidade) };
}

function quantidadeTexto(numero, singular, plural) {
  return numero + " " + (numero === 1 ? singular : plural);
}

function resumoGrupo(grupo) {
  const adultos = quantidadeTexto(grupo.adultos, "adulto", "adultos");
  const criancas = quantidadeTexto(grupo.criancas, "criança", "crianças");
  return grupo.criancas ? adultos + " e " + criancas : adultos;
}

function gravarGrupo(consulta, grupo) {
  consulta.delete("hospedes");
  consulta.set("adultos", grupo.adultos);
  consulta.set("criancas", grupo.criancas);
}

// Detalhes e estimativa da estadia
const detalhes = document.querySelector("#detalhes-hotel");
const reserva = document.querySelector("#reserva-hotel");
if (detalhes || reserva) {
  const hotel = hospedagens.find(({ id }) => id === Number(parametros.get("id")));
  if (!hotel) {
    (detalhes || reserva).innerHTML = `<div class="${reserva ? "shell inner-page" : ""}">
      <h1>Hospedagem não encontrada</h1><p><a href="hospedagens.html">Voltar ao catálogo</a></p>
    </div>`;
  } else if (detalhes) {
    renderizarDetalhes(detalhes, hotel);
  } else {
    renderizarReserva(reserva, hotel);
  }
}

// Formulário de contato
const contato = document.querySelector("#form-contato");
contato?.addEventListener("submit", (evento) => {
  evento.preventDefault();
  contato.reset();
  contato.querySelector(".form-status").textContent = "Envio simulado. Nenhuma mensagem foi transmitida.";
});
