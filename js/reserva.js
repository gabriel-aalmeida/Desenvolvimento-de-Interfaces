"use strict";

function informacoesDaEstadia(comodidades) {
  const destaques = principaisComodidades(comodidades, 4);
  const preferidas = ["Recepção 24h", "Ar-condicionado", "Academia", "Restaurante", "Quartos para não fumantes", "Serviço de quarto"];
  const restantes = comodidades.filter(nome => !destaques.includes(nome));
  const servicos = [...new Set([...preferidas.filter(nome => comodidades.includes(nome)), ...restantes])];
  const incluidos = servicos.length ? servicos.slice(0, 6) : destaques;
  return `
    <section class="surface quote-section quote-highlights" aria-labelledby="titulo-destaques-estadia">
      <h2 id="titulo-destaques-estadia">Destaques desta estadia</h2>
      <ul class="quote-highlight-grid">
        ${destaques.map(nome => {
          const [icone, descricao] = comodidadesDetalhes[nome] || ["check", "Comodidade"];
          return `<li><span class="highlight-icon">${iconeInterface(icone)}</span>
            <span><strong>${nome}</strong><small>${descricao}</small></span></li>`;
        }).join("")}
      </ul>
    </section>
    <section class="surface quote-section quote-included" aria-labelledby="titulo-incluido">
      <h2 id="titulo-incluido">O que está incluído na sua reserva</h2>
      <ul class="quote-inclusions">
        ${incluidos.map(nome => `<li>${iconeInterface(comodidadesDetalhes[nome]?.[0] || "check")}<span>${nome}</span></li>`).join("")}
      </ul>
      <p class="inclusion-note">Refeições e serviços extras dependem da tarifa escolhida.</p>
    </section>`;
}

function renderizarReserva(area, hotel) {
  const dados = dadosDetalhes[hotel.id];
  const avaliacao = dados?.avaliacao;
  const diariaEstadia = diaria(hotel);
  const valorDiaria = moeda.format(diariaEstadia);
  const detalhesHotel = urlHotel("detalhes.html", hotel.id);
  const localizacao = `${hotel.cidade}, ${hotel.uf}`;
  const endereco = dados?.endereco || hotel.bairro;

  area.innerHTML = `
    <header class="quote-hero">
      <div class="shell quote-hero-inner">
        <a class="quote-back" href="${detalhesHotel}">← Voltar aos detalhes</a>
        <ol class="quote-progress" aria-label="Etapas da reserva">
          <li aria-current="step"><span class="step-number" aria-hidden="true">1</span> Estadia</li>
          <li><span class="step-number" aria-hidden="true">2</span> Pagamento</li>
        </ol>
        <h1>Estimativa da estadia</h1>
        <p>Escolha as datas e a quantidade de hóspedes para calcular a estadia.</p>
      </div>
    </header>

    <form class="shell quote-form" aria-label="Estimar valor da estadia">
      <div class="quote-main">
        <section class="surface quote-section" aria-labelledby="titulo-datas">
          <h2 id="titulo-datas">Datas da viagem</h2>
          <p class="subtle" id="reserva-data-ajuda">Digite no formato dia/mês/ano ou use o calendário.</p>
          <div class="quote-dates">
            ${campoData("checkin", "Check-in", "reserva-checkin", "reserva-data-ajuda reserva-data-erro")}
            ${campoData("checkout", "Check-out", "reserva-checkout", "reserva-data-ajuda reserva-data-erro")}
          </div>
          <p id="reserva-data-erro" class="quote-error" role="status" hidden></p>
          <div class="quote-occupancy">${camposViajantes()}</div>
          <p class="subtle">Cada acomodação recebe até ${hotel.capacidade} pessoas. O cálculo inclui acomodações extras quando necessário.</p>
        </section>
        ${informacoesDaEstadia(dados?.comodidades || [])}
        <section class="surface quote-section quote-next" aria-labelledby="titulo-proxima-etapa">
          <h2 id="titulo-proxima-etapa"><span class="benefit-icon">${iconeInterface("escudo")}</span> Vantagens LuxeStay</h2>
          <ul class="quote-benefits">
            <li>${iconeInterface("check")} Cancelamento grátis antes do check-in</li>
            <li>${iconeInterface("check")} Você não será cobrado agora (simulação segura)</li>
          </ul>
          <p><strong>Na próxima etapa</strong><br>Escolha como pagar e confira os descontos antes de confirmar a reserva.</p>
        </section>
      </div>

      <aside class="surface quote-summary" aria-labelledby="titulo-resumo-estadia">
        <div class="quote-property">
          <div class="stay-photo quote-photo">${fotoHotel(hotel, "eager")}</div>
          <div class="quote-property-copy">
            <p class="eyebrow">${tipos[hotel.tipo]} · ${localizacao}</p>
            <h2><a href="${detalhesHotel}">${hotel.nome}</a></h2>
            ${endereco ? `<p class="subtle">${endereco}</p>` : ""}
            ${avaliacao ? `<a class="quote-rating" href="${detalhesHotel}#avaliacoes">
              <strong>${avaliacao.nota.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} <span>/ 10</span></strong>
              <span class="rating-copy"><b>${classificacaoHospedes(avaliacao)}</b><small>${avaliacao.total.toLocaleString("pt-BR")} avaliações</small></span>
            </a>` : ""}
          </div>
        </div>

        <div class="quote-price">
          <h2 id="titulo-resumo-estadia">Resumo do preço</h2>
          <p class="subtle" id="reserva-grupo" aria-live="polite"></p>
          ${hotel.desconto ? `<p class="quote-offer">Black Friday simulada · ${hotel.desconto}% OFF</p>` : ""}
          <dl class="quote-nightly">
            <dt>Diária por acomodação</dt>
            <dd>${hotel.desconto ? `<del>${moeda.format(hotel.preco)}</del> ` : ""}${valorDiaria}</dd>
          </dl>
          <div id="total-reserva" class="quote-total" aria-live="polite" aria-atomic="true">
            <div>
              <span>Total estimado</span>
              <strong id="reserva-valor">Selecione as datas</strong>
            </div>
            <p id="reserva-calculo">Informe as datas para calcular o valor.</p>
          </div>
          <p class="tax-note">Impostos e taxas incluídos na estimativa simulada.</p>
          <button class="action quote-continue" type="submit" disabled>Ir para pagamento <span aria-hidden="true">→</span></button>
          <p class="quote-note test-notice">${iconeInterface("cadeado")} Reserva de teste, sem cobrança.</p>
        </div>
      </aside>
    </form>`;

  observarFotos(area);
  const form = area.querySelector("form");
  const continuar = form.querySelector("button[type=submit]");
  const total = form.querySelector("#reserva-valor");
  const calculo = form.querySelector("#reserva-calculo");
  const aviso = form.querySelector("#reserva-data-erro");
  const campos = [form.elements.checkin, form.elements.checkout];

  function atualizarResumo(datas) {
    const grupo = grupoDaReserva(form, hotel);
    const noites = datas ? noitesEstadia(datas.entrada, datas.saida) : 0;
    const quartos = grupo ? quantidadeTexto(grupo.quartos, "acomodação", "acomodações") : "";
    form.querySelector("#reserva-grupo").textContent = grupo ? resumoGrupo(grupo) + " · " + quartos : "Confira a quantidade de adultos e crianças.";
    const temTotal = Boolean(noites && grupo);
    total.classList.toggle("is-ready", temTotal);
    total.textContent = temTotal ? moeda.format(noites * grupo.quartos * diariaEstadia)
      : noites ? "Confira os hóspedes" : "Selecione as datas";
    calculo.textContent = noites && grupo
      ? quantidadeTexto(noites, "noite", "noites") + " × " + quartos + " × " + valorDiaria
      : "Informe as datas e os hóspedes para calcular o valor.";
    continuar.disabled = !datas || !grupo;

    const invalidos = campos.filter((campo) => campo.value.length === 10 && campo.validity.customError);
    for (const campo of campos) campo.setAttribute("aria-invalid", String(invalidos.includes(campo)));
    const mensagem = invalidos[0]?.validationMessage || "";
    aviso.hidden = !mensagem;
    if (mensagem !== aviso.textContent) aviso.textContent = mensagem;
  }

  configurarViajantes(form, () => validarDatas());
  const validarDatas = configurarCamposData(form, true, atualizarResumo);
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datas = validarDatas();
    const grupo = grupoDaReserva(form, hotel);
    if (!datas || !grupo) {
      form.reportValidity();
      return;
    }
    const destino = new URL(urlHotel("pagamento.html", hotel.id), location.href);
    destino.searchParams.set("checkin", datas.entrada);
    destino.searchParams.set("checkout", datas.saida);
    gravarGrupo(destino.searchParams, grupo);
    const estimativa = new URL(location.href);
    estimativa.search = destino.search;
    history.replaceState(null, "", estimativa);
    location.assign(destino.href);
  });
}
