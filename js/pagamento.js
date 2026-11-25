"use strict";

const percentualPix = 5;

const formasPagamento = [
  { id: "pix", nome: "Pix", descricao: "Desconto sobre o valor da estadia" },
  { id: "credito", nome: "Cartão de crédito", descricao: "À vista ou em até 6 vezes sem juros" },
  { id: "debito", nome: "Cartão de débito", descricao: "Pagamento à vista" },
  { id: "boleto", nome: "Boleto bancário", descricao: "Pagamento por boleto" },
  { id: "carteira", nome: "Carteira digital", descricao: "Apple Pay, Google Pay ou PayPal" },
  { id: "transferencia", nome: "Transferência bancária", descricao: "Transferência para a hospedagem" },
  { id: "dinheiro", nome: "Dinheiro no hotel", descricao: "Pagamento na recepção" },
  { id: "cartao-hotel", nome: "Cartão no hotel", descricao: "Crédito ou débito na recepção" },
  { id: "voucher", nome: "Voucher ou vale-viagem", descricao: "Crédito de viagem ou vale-presente" },
  { id: "pontos", nome: "Pontos ou milhas", descricao: "Resgate pelo programa de fidelidade" },
  { id: "faturado", nome: "Faturamento empresarial", descricao: "Fatura para a empresa" }
];

const instrucoesPagamento = {
  boleto: "Na simulação, o boleto é compensado em até dois dias úteis. Confirme a reserva para emitir o comprovante.",
  carteira: "A autorização da carteira digital é simulada e imediata. Confirme para concluir a reserva.",
  transferencia: "Na simulação, a transferência é identificada em até um dia útil. Confirme para registrar o pagamento.",
  debito: "O valor integral é debitado à vista na simulação.",
  dinheiro: "A estadia será paga em dinheiro na recepção.",
  "cartao-hotel": "Apresente o cartão na recepção para pagar a estadia.",
  voucher: "O saldo do vale-viagem é aplicado à estadia nesta simulação.",
  pontos: "O resgate dos pontos é autorizado nesta simulação.",
  faturado: "A estadia será incluída na fatura simulada da empresa."
};

function iconePagamento(id) {
  const desenhos = {
    pix: '<g fill="#28a99b"><path d="m16 2 7 7h-3l-4 4-4-4H9zM9 23h3l4-4 4 4h3l-7 7z"/><path d="m2 16 5-5h4l5 5 5-5h4l5 5-5 5h-4l-5-5-5 5H7z"/></g>',
    credito: '<rect x="1" y="6" width="30" height="20" rx="4" fill="#213c72"/><path d="M2 12h28" stroke="#9ebcf1" stroke-width="3"/><circle cx="20" cy="20" r="4" fill="#ff6557"/><circle cx="25" cy="20" r="4" fill="#ffb441" opacity=".95"/>',
    debito: '<rect x="1" y="6" width="30" height="20" rx="4" fill="#477891"/><rect x="5" y="11" width="7" height="6" rx="1" fill="#ffe4a1"/><path d="M5 21h10m5 0h6" stroke="white" stroke-width="2"/>',
    boleto: '<rect x="1" y="5" width="30" height="22" rx="3" fill="#f2efe7"/><path d="M5 9v14m4-14v14m7-14v14m7-14v14m4-14v14" stroke="#474235" stroke-width="2"/><path d="M12 9v14m7-14v14" stroke="#474235"/>',
    carteira: '<rect x="3" y="6" width="24" height="18" rx="3" fill="#a994df" transform="rotate(-9 16 16)"/><rect x="2" y="10" width="28" height="17" rx="4" fill="#6651a1"/><path d="M30 15h-8v7h8" fill="#d7cbf1"/><circle cx="25" cy="18.5" r="1.3" fill="#6651a1"/>',
    transferencia: '<path d="M1 11 16 3l15 8zM3 26h26v3H3z" fill="#487b9a"/><path d="M7 13v11m9-11v11m9-11v11" stroke="#699ab6" stroke-width="4"/>',
    qr: '<path d="M3 3h10v10H3zM19 3h10v10H19zM3 19h10v10H3z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M6 6h4v4H6zM22 6h4v4h-4zM6 22h4v4H6zM17 16h5v5h-5zM24 17h5v3h-5zM21 22h4v7h-4zM26 25h3v4h-3zM16 25h3v4h-3z" fill="currentColor"/>'
  };
  const desenho = desenhos[id] || '<rect x="3" y="6" width="26" height="21" rx="4" fill="#72859d"/><path d="M8 13h16M8 19h10" stroke="white" stroke-width="2"/>';
  return '<svg class="method-icon" aria-hidden="true" viewBox="0 0 32 32">' + desenho + '</svg>';
}

function opcaoPagamento({ id, nome, descricao }) {
  return `<label class="payment-option" for="forma-${id}">
    <input type="radio" id="forma-${id}" name="forma" value="${id}" ${id === "pix" ? "checked" : ""} required>
    <span class="payment-option-copy"><strong>${nome}</strong>
      <small${id === "pix" ? ' id="vantagem-pix"' : ""}>${descricao}</small>
    </span>
    <span class="method-art">${id === "pix" ? '<span class="pix-badge">5% OFF</span>' : ""}${iconePagamento(id)}</span>
  </label>`;
}

function calcularValoresPagamento(hotel, noites, quartos, tarifa) {
  const base = tarifa || {
    diariaOriginal: Math.round(hotel.preco * 100),
    diariaOferta: Math.round(diaria(hotel) * 100),
    promocao: hotel.desconto,
    pix: percentualPix
  };
  const subtotal = noites * quartos * base.diariaOriginal;
  const estadia = noites * quartos * base.diariaOferta;
  const descontoPix = Math.round(estadia * base.pix / 100);
  return { tarifa: base, subtotal, estadia, descontoHotel: subtotal - estadia, descontoPix, totalPix: estadia - descontoPix };
}

function descricaoParcelas(centavos, quantidade) {
  if (quantidade === 1) return "À vista";
  const base = Math.floor(centavos / quantidade);
  const extras = centavos % quantidade;
  const valor = moeda.format(base / 100);
  if (!extras) return quantidade + "× de " + valor;
  return quantidade + " parcelas (" + extras + " de " + moeda.format((base + 1) / 100)
    + " e " + (quantidade - extras) + " de " + valor + ")";
}

function renderizarPagamento(area, hotel, entrada, saida) {
  const noites = noitesEstadia(entrada, saida);
  const duracao = noites === 1 ? "1 noite" : noites + " noites";
  const formatar = (centavos) => moeda.format(centavos / 100);
  const voltar = urlHotel("reserva.html", hotel.id);

  area.innerHTML = `
    <header class="quote-hero">
      <div class="shell quote-hero-inner">
        <a class="quote-back" id="checkout-editar" href="${voltar}">← Editar estadia</a>
        <ol class="quote-progress" aria-label="Etapas da reserva">
          <li><span class="step-number">1</span> Estadia <span class="step-done" aria-label="concluída">✓</span></li>
          <li aria-current="step"><span class="step-number">2</span> Pagamento</li>
        </ol>
        <h1>Pagamento</h1>
        <p>Revise sua estadia e escolha como pagar.</p>
      </div>
    </header>

    <form class="shell quote-form payment-layout" aria-label="Pagamento da reserva">
      <div class="quote-main">
        <section class="surface quote-section" aria-labelledby="titulo-estadia">
          <h2 id="titulo-estadia">Sua estadia</h2>
          <div class="quote-occupancy">${camposViajantes()}</div>
        </section>

        <section class="surface quote-section" aria-labelledby="titulo-forma">
          <fieldset class="payment-methods">
            <legend id="titulo-forma">Formas de pagamento</legend>
            <div class="payment-choices">
              ${formasPagamento.slice(0, 6).map(opcaoPagamento).join("")}
            </div>
            <details class="more-methods"><summary>Outras formas de pagamento</summary>
              <div class="payment-choices">${formasPagamento.slice(6).map(opcaoPagamento).join("")}</div>
            </details>
          </fieldset>
          <div class="method-panel" id="painel-forma" hidden>
            <h3 id="painel-titulo"></h3>
            <div id="painel-pix" hidden>
              <p>Aprovação imediata • Desconto de <span id="taxa-pix">5</span>% já aplicado</p>
              <div class="pix-copy">${iconePagamento("qr")}<div><small>Pix Copia e Cola simulado</small>
                <code id="codigo-pix"></code></div>
                <button type="button" class="copy-button" data-copiar="codigo-pix">Copiar código</button>
              </div>
              <div class="pix-total"><span>Valor final</span><strong id="valor-pix"></strong></div>
              <p class="copy-status" role="status"></p>
            </div>
            <fieldset class="card-fields" id="campos-cartao" hidden disabled>
              <legend class="sr-only">Dados fictícios do cartão</legend>
              <p>Use dados fictícios para simular o pagamento.</p>
              <label>Número do cartão<input type="text" inputmode="numeric" autocomplete="off" pattern="(?:[0-9] ?){12,18}[0-9]" maxlength="23" placeholder="0000 0000 0000 0000" required></label>
              <label>Nome impresso<input type="text" autocomplete="off" maxlength="80" placeholder="Nome no cartão" required></label>
              <label>Validade<input type="text" inputmode="text" autocomplete="off" pattern="(0[1-9]|1[0-2])/[0-9]{2}" maxlength="5" placeholder="MM/AA" required></label>
              <label>CVV<input type="password" inputmode="numeric" autocomplete="off" pattern="[0-9]{3,4}" maxlength="4" placeholder="000" required></label>
              <label class="payment-installments" id="opcao-parcelas">Parcelamento<select name="parcelas"></select></label>
            </fieldset>
            <p id="instrucao-forma"></p>
            <button id="confirmar-no-painel" class="action" type="submit" hidden>Confirmar reserva</button>
          </div>
        </section>
      </div>

      <aside class="surface quote-summary payment-summary" aria-labelledby="titulo-compra">
        <div class="payment-summary-heading"><h2 id="titulo-compra">Resumo da compra</h2></div>
        <div class="payment-summary-body">
          <div class="payment-property">
            <div class="stay-photo">${fotoHotel(hotel, "eager")}</div>
            <div>
              <p class="eyebrow">${tipos[hotel.tipo]}</p>
              <h3><a href="${urlHotel("detalhes.html", hotel.id)}">${hotel.nome}</a></h3>
              <p class="subtle">${hotel.cidade}, ${hotel.uf}</p>
            </div>
          </div>
          <div class="payment-itinerary">
            <div><span>${iconeInterface("calendario")} Check-in</span><strong><time datetime="${entrada}">${dataExibida(entrada)}</time></strong></div>
            <div><span>${iconeInterface("calendario")} Check-out</span><strong><time datetime="${saida}">${dataExibida(saida)}</time></strong></div>
            <div><span>${iconeInterface("lua")} Noites</span><strong>${noites}</strong></div>
          </div>
          <p id="checkout-grupo" class="payment-group"></p>
          <dl class="payment-lines">
            <div><dt id="rotulo-diarias"></dt><dd id="preco-subtotal"></dd></div>
            <div class="payment-saving" id="linha-promocao" hidden><dt id="rotulo-promocao"></dt><dd id="desconto-promocao"></dd></div>
            <div class="payment-saving" id="linha-pix" hidden><dt>Desconto no Pix</dt><dd id="desconto-pix"></dd></div>
          </dl>
          <div class="payment-total" aria-live="polite" aria-atomic="true">
            <div><strong>Total da reserva</strong><strong class="stay-price" id="total-compra"></strong></div>
            <p id="resumo-forma"></p>
            <p class="tax-note">Impostos e taxas incluídos na estimativa simulada.</p>
          </div>
          <button class="action quote-continue" type="submit" id="checkout-confirmar" disabled>${iconeInterface("cadeado")}<span>Confirmar reserva</span></button>
          <p id="aviso-conta-pagamento" class="checkout-account"><a href="login.html">Entrar para guardar esta reserva no meu perfil</a></p>
          <p class="quote-note test-notice">${iconeInterface("info")} Pagamento demonstrativo, sem cobrança.</p>
          <p id="checkout-status" class="payment-status" role="status"></p>
          <a id="ver-minhas-reservas" href="perfil.html#reservas" hidden>Ver minhas reservas →</a>
        </div>
      </aside>
    </form>`;

  observarFotos(area);
  const recibo = document.querySelector("#comprovante");
  const form = area.querySelector("form");
  const campos = form.elements;
  const botao = area.querySelector("#checkout-confirmar");
  const status = area.querySelector("#checkout-status");
  let grupo;
  let valores;
  let registro;
  let titular = contaAtiva()?.id;

  function chaveReserva() {
    // Reservas de visitantes conservam as chaves usadas nas versões anteriores.
    const prefixo = titular ? prefixoReservasConta(titular) : "reserva-teste:";
    const partes = [hotel.id, entrada, saida, grupo.adultos];
    if (grupo.criancas) partes.push("criancas", grupo.criancas);
    return prefixo + partes.join(":");
  }

  function registroAtual() {
    const salvo = ler(chaveReserva());
    return typeof salvo === "string" ? { codigo: salvo } : salvo;
  }

  function numeroParcelas() {
    return campos.forma.value === "credito" ? Number(campos.parcelas.value) || 1 : 1;
  }

  function atualizarEscolha() {
    const forma = formasPagamento.find(({ id }) => id === campos.forma.value);
    const pix = forma?.id === "pix";
    const cartao = forma?.id === "credito" || forma?.id === "debito";
    const dadosCartao = area.querySelector("#campos-cartao");
    dadosCartao.hidden = !cartao;
    dadosCartao.disabled = !cartao || !grupo;
    area.querySelector("#opcao-parcelas").hidden = forma?.id !== "credito";
    area.querySelector("#painel-forma").hidden = !forma || !grupo;
    area.querySelector("#painel-titulo").textContent = forma?.nome || "";
    area.querySelector("#painel-pix").hidden = !pix;
    area.querySelector("#instrucao-forma").textContent = instrucoesPagamento[forma?.id] || "";
    if (pix && grupo) {
      area.querySelector("#codigo-pix").textContent = ["LUX-TESTE", hotel.id, entrada, grupo.adultos, grupo.criancas, valores.totalPix].join("-");
      area.querySelector("#valor-pix").textContent = formatar(valores.totalPix);
      area.querySelector("#taxa-pix").textContent = valores.tarifa.pix;
    }
    area.querySelector("#painel-pix .copy-status").textContent = "";
    area.querySelector("#linha-pix").hidden = !pix || !grupo;
    area.querySelector("#total-compra").textContent = grupo ? formatar(pix ? valores.totalPix : valores.estadia) : "A definir";
    let resumo = "Selecione uma forma de pagamento.";
    if (forma) {
      resumo = forma.nome;
      if (forma.id === "credito" && grupo) resumo += " · " + descricaoParcelas(valores.estadia, numeroParcelas());
    }
    area.querySelector("#resumo-forma").textContent = resumo;
    const semAlteracao = registro && forma && forma.id === registro.forma && numeroParcelas() === (registro.parcelas || 1);
    botao.disabled = !grupo || !forma || semAlteracao;
    botao.querySelector("span").textContent = registro ? "Salvar forma de pagamento" : "Confirmar reserva";
    const acaoPainel = area.querySelector("#confirmar-no-painel");
    acaoPainel.hidden = !["boleto", "carteira", "transferencia"].includes(forma?.id);
    acaoPainel.disabled = botao.disabled;
    acaoPainel.textContent = botao.querySelector("span").textContent;
    area.querySelector("#ver-minhas-reservas").hidden = !(registro && titular);
    status.textContent = registro
      ? "Reserva " + registro.codigo + (semAlteracao ? " · Forma de pagamento salva." : " · Escolha a forma e salve a alteração.")
      : "";
  }

  function atualizarGrupo() {
    const novaConta = contaAtiva()?.id;
    if (novaConta !== titular) {
      if (recibo.open) recibo.close();
      titular = novaConta;
      for (const opcao of campos.forma) opcao.checked = opcao.value === "pix";
      limparCartao();
      campos.parcelas.value = "1";
    }
    const avisoConta = area.querySelector("#aviso-conta-pagamento");
    avisoConta.hidden = Boolean(titular);
    const parcelasAnteriores = numeroParcelas();
    grupo = grupoDaReserva(form, hotel);
    const resumo = area.querySelector("#checkout-grupo");
    if (!grupo) {
      registro = null;
      resumo.textContent = "Informe pelo menos um adulto e uma quantidade válida de crianças.";
      area.querySelector(".payment-lines").hidden = true;
      atualizarEscolha();
      return;
    }
    gravarGrupo(parametros, grupo);
    const url = new URL(location.href);
    gravarGrupo(url.searchParams, grupo);
    history.replaceState(null, "", url);
    avisoConta.querySelector("a").href = "login.html?" + new URLSearchParams({ continuar: "pagamento.html" + url.search });
    area.querySelector("#checkout-editar").href = urlHotel("reserva.html", hotel.id);
    area.querySelector(".payment-property a").href = urlHotel("detalhes.html", hotel.id);
    registro = registroAtual();
    valores = calcularValoresPagamento(hotel, noites, grupo.quartos, registro?.tarifa);
    area.querySelector(".payment-lines").hidden = false;
    const quartos = quantidadeTexto(grupo.quartos, "acomodação", "acomodações");
    resumo.textContent = resumoGrupo(grupo) + " · " + quartos;
    area.querySelector("#rotulo-diarias").textContent = duracao + " × " + quartos + " × " + formatar(valores.tarifa.diariaOriginal);
    area.querySelector("#preco-subtotal").textContent = formatar(valores.subtotal);
    area.querySelector("#linha-promocao").hidden = !valores.descontoHotel;
    area.querySelector("#rotulo-promocao").textContent = "Black Friday (" + valores.tarifa.promocao + "%)";
    area.querySelector("#desconto-promocao").textContent = "− " + formatar(valores.descontoHotel);
    area.querySelector("#desconto-pix").textContent = "− " + formatar(valores.descontoPix);
    area.querySelector("#vantagem-pix").textContent = valores.tarifa.pix + "% de desconto · " + formatar(valores.totalPix);
    area.querySelector(".pix-badge").textContent = valores.tarifa.pix + "% OFF";
    campos.parcelas.replaceChildren(...Array.from({ length: 6 }, (_, i) =>
      new Option((i + 1) + "x sem juros · " + (i ? descricaoParcelas(valores.estadia, i + 1) : formatar(valores.estadia)), String(i + 1))));
    if (registro?.forma) {
      for (const opcao of campos.forma) opcao.checked = opcao.value === registro.forma;
      if (area.querySelector(".more-methods :checked")) area.querySelector(".more-methods").open = true;
    }
    campos.parcelas.value = String(registro?.parcelas || parcelasAnteriores);
    atualizarEscolha();
  }

  function limparCartao() {
    for (const campo of area.querySelectorAll("#campos-cartao input")) campo.value = "";
  }

  async function copiar(evento) {
    const botaoCopiar = evento.target.closest("[data-copiar]");
    if (!botaoCopiar) return;
    const alvo = document.getElementById(botaoCopiar.dataset.copiar);
    const aviso = botaoCopiar.closest("#painel-pix, .receipt-inner").querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(alvo.textContent);
      aviso.textContent = "Código copiado.";
    } catch {
      const selecao = window.getSelection();
      const intervalo = document.createRange();
      intervalo.selectNodeContents(alvo);
      selecao.removeAllRanges();
      selecao.addRange(intervalo);
      aviso.textContent = "Código selecionado. Use a opção Copiar do navegador.";
    }
  }

  function exibirComprovante(pagamento) {
    const forma = formasPagamento.find(item => item.id === pagamento.forma);
    const dados = {
      "mensagem-comprovante": "Sua simulação de estadia no " + hotel.nome + " está garantida.",
      "codigo-confirmacao": pagamento.codigo,
      "rec-hotel": hotel.nome, "rec-entrada": dataExibida(entrada), "rec-saida": dataExibida(saida),
      "rec-grupo": resumoGrupo(grupo), "rec-forma": forma.nome,
      "rec-total": formatar(forma.id === "pix" ? valores.totalPix : valores.estadia)
    };
    for (const [id, valor] of Object.entries(dados)) document.getElementById(id).textContent = valor;
    const link = recibo.querySelector(".action");
    link.href = titular ? "perfil.html#reservas" : area.querySelector("#aviso-conta-pagamento a").href;
    link.textContent = titular ? "Ver em Minhas Reservas →" : "Entrar para salvar no perfil →";
    recibo.querySelector(".copy-status").textContent = "";
    recibo.showModal();
  }

  area.addEventListener("click", copiar);
  recibo.addEventListener("click", copiar);
  configurarViajantes(form, atualizarGrupo);
  for (const opcao of campos.forma) opcao.addEventListener("change", atualizarEscolha);
  campos.parcelas.addEventListener("change", atualizarEscolha);
  window.addEventListener("storage", (evento) => {
    if ([null, "luxestay:sessao", "luxestay:contas"].includes(evento.key) || (grupo && evento.key === "luxestay:" + chaveReserva())) atualizarGrupo();
  });
  window.addEventListener("pageshow", atualizarGrupo);
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (titular !== contaAtiva()?.id) { atualizarGrupo(); return; }
    if (!grupo || !campos.forma.value) return;
    const anterior = registroAtual();
    const codigo = anterior?.codigo || "#LUX-" + crypto.randomUUID().slice(0, 8).toUpperCase();
    const pagamento = { codigo, forma: campos.forma.value, parcelas: numeroParcelas(), tarifa: valores.tarifa, ...grupo };
    if (titular) Object.assign(pagamento, {
      contaId: titular, hotelId: hotel.id, checkin: entrada, checkout: saida,
      criadaEm: anterior?.criadaEm || new Date().toISOString(),
      totalCentavos: campos.forma.value === "pix" ? valores.totalPix : valores.estadia
    });
    if (!salvar(chaveReserva(), pagamento)) {
      status.textContent = "Não foi possível salvar a reserva neste navegador. Tente novamente.";
      return;
    }
    limparCartao();
    atualizarGrupo();
    exibirComprovante(pagamento);
  });
  atualizarGrupo();
}

const paginaPagamento = document.querySelector("#pagamento-hotel");
const hotelPagamento = hospedagens.find(({ id }) => id === Number(parametros.get("id")));
const entradaPagamento = dataDigitada(dataExibida(parametros.get("checkin") || ""));
const saidaPagamento = dataDigitada(dataExibida(parametros.get("checkout") || ""));
if (hotelPagamento && entradaPagamento >= dataLocal(new Date()) && saidaPagamento > entradaPagamento) {
  renderizarPagamento(paginaPagamento, hotelPagamento, entradaPagamento, saidaPagamento);
} else {
  const voltar = hotelPagamento ? urlHotel("reserva.html", hotelPagamento.id) : "hospedagens.html";
  paginaPagamento.innerHTML = `<div class="shell inner-page"><h1>Pagamento</h1>
    <p class="notice">Revise a hospedagem e as datas para continuar.</p>
    <a class="action" href="${voltar}">${hotelPagamento ? "Revisar estadia" : "Ver hospedagens"}</a></div>`;
}
