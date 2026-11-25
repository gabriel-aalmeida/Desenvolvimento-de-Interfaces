"use strict";

const notaDetalhes = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const quantidadeAvaliacoes = new Intl.NumberFormat("pt-BR");

function iconeDetalhe(nome) {
  return iconeInterface(nome, `property-icon icon-${nome}`);
}

function montarGaleria(fotos) {
  return `
    <section class="detail-gallery" id="fotos" aria-label="Fotos da hospedagem">
      <div class="gallery-mosaic" aria-label="Fotos" role="group" aria-roledescription="carrossel">
        ${fotos.map(({ src, legenda }, indice) => `
          <button type="button" class="gallery-tile" aria-current="${indice === 0}" aria-label="Foto ${indice + 1}: ${legenda}">
            <img src="${src}" alt="${legenda}" ${indice === 0 ? 'fetchpriority="high"' : ""}>
            <span class="photo-missing" hidden>Foto temporariamente indisponível.</span>
          </button>`).join("")}
        <div class="gallery-controls">
          ${fotos.length > 1 ? `<button class="gallery-arrow gallery-prev" type="button" aria-label="Foto anterior">‹</button>
            <button class="gallery-arrow gallery-next" type="button" aria-label="Próxima foto">›</button>` : ""}
          <span class="gallery-count" aria-live="polite"></span>
          <button class="gallery-open" type="button">${iconeDetalhe("fotos")} Ver ${quantidadeTexto(fotos.length, "foto", "fotos")}</button>
        </div>
      </div>
      <div class="gallery-thumbs" role="group" aria-label="Miniaturas das fotos">
        ${fotos.map(({ src, legenda }, i) => `
          <button type="button" class="gallery-thumb" aria-label="Mostrar foto ${i + 1}: ${legenda}">
            <span aria-hidden="true">${i + 1}</span><img src="${src}" alt="" loading="lazy">
          </button>`).join("")}
      </div>
      <dialog class="gallery-dialog" aria-labelledby="titulo-galeria">
        <div class="gallery-dialog-heading">
          <h2 id="titulo-galeria">Fotos da hospedagem</h2>
          <button type="button" class="gallery-close" aria-label="Fechar galeria" autofocus>×</button>
        </div>
        <div class="gallery-dialog-stage">
          <img class="gallery-expanded" alt="">
          <p class="gallery-dialog-error" hidden>Foto temporariamente indisponível.</p>
          ${fotos.length > 1 ? `<button class="gallery-arrow gallery-prev" type="button" aria-label="Foto anterior">‹</button>
            <button class="gallery-arrow gallery-next" type="button" aria-label="Próxima foto">›</button>` : ""}
        </div>
        <p class="gallery-legend" aria-live="polite"></p>
      </dialog>
    </section>`;
}

function ativarGaleria(area, fotos, capaLocal) {
  const tiles = Array.from(area.querySelectorAll(".gallery-tile"));
  const miniaturas = Array.from(area.querySelectorAll(".gallery-thumb"));
  const dialog = area.querySelector("dialog");
  const ampliada = dialog.querySelector(".gallery-expanded");
  const erro = dialog.querySelector(".gallery-dialog-error");
  const contador = area.querySelector(".gallery-count");
  let atual = 0;

  function exibir(indice) {
    atual = (indice + fotos.length) % fotos.length;
    const foto = fotos[atual];
    tiles.forEach((tile, i) => {
      const posicao = (i - atual + fotos.length) % fotos.length;
      tile.hidden = posicao > 2;
      tile.dataset.posicao = String(posicao);
      tile.setAttribute("aria-current", String(i === atual));
      miniaturas[i].setAttribute("aria-current", String(i === atual));
    });
    contador.textContent = `${atual + 1} / ${fotos.length}`;
    if (dialog.open) {
      ampliada.hidden = false;
      erro.hidden = true;
      ampliada.alt = foto.legenda;
      ampliada.src = foto.src;
      dialog.querySelector(".gallery-legend").textContent = `${atual + 1} de ${fotos.length} · ${foto.legenda}`;
      if (ampliada.complete && !ampliada.naturalWidth) falhaAmpliada();
    }
  }

  function usarCapaLocal(indice) {
    if (indice !== 0 || !capaLocal || fotos[0].src === capaLocal.src) return false;
    fotos[0] = capaLocal;
    const tile = tiles[0];
    const miniatura = miniaturas[0];
    const imagem = tile.querySelector("img");
    imagem.alt = capaLocal.legenda;
    imagem.hidden = false;
    imagem.src = capaLocal.src;
    tile.querySelector(".photo-missing").hidden = true;
    tile.setAttribute("aria-label", "Foto 1: " + capaLocal.legenda);
    miniatura.setAttribute("aria-label", "Mostrar foto 1: " + capaLocal.legenda);
    const previa = miniatura.querySelector("img");
    previa.hidden = false;
    previa.src = capaLocal.src;
    if (dialog.open && atual === 0) exibir(0);
    return true;
  }

  function falhaAmpliada() {
    if (usarCapaLocal(atual)) return;
    ampliada.hidden = true;
    erro.hidden = false;
  }

  function ampliar() {
    dialog.showModal();
    exibir(atual);
  }

  for (const [i, tile] of tiles.entries()) {
    const miniatura = miniaturas[i];
    miniatura.addEventListener("click", () => exibir(i));
    const previa = miniatura.querySelector("img");
    previa.addEventListener("load", () => { previa.hidden = false; });
    previa.addEventListener("error", () => { previa.hidden = true; });
    if (previa.complete && !previa.naturalWidth) previa.hidden = true;
    const imagem = tile.querySelector("img");
    function falha() {
      if (usarCapaLocal(i)) return;
      imagem.hidden = true;
      tile.querySelector(".photo-missing").hidden = false;
    }
    imagem.addEventListener("error", falha);
    if (imagem.complete && !imagem.naturalWidth) falha();
    tile.addEventListener("click", () => i === atual ? ampliar() : exibir(i));
  }
  ampliada.addEventListener("error", falhaAmpliada);
  for (const anterior of area.querySelectorAll(".gallery-prev")) anterior.addEventListener("click", () => exibir(atual - 1));
  for (const proxima of area.querySelectorAll(".gallery-next")) proxima.addEventListener("click", () => exibir(atual + 1));
  area.querySelector(".gallery-open").addEventListener("click", ampliar);
  dialog.querySelector(".gallery-close").addEventListener("click", () => dialog.close());
  area.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    e.preventDefault();
    exibir(atual + (e.key === "ArrowLeft" ? -1 : 1));
    if (e.target.closest(".gallery-tile")) tiles[atual].focus();
    if (e.target.closest(".gallery-thumb")) miniaturas[atual].focus();
  });
  exibir(0);
}

function renderizarDetalhes(area, hotel) {
  const dados = dadosDetalhes[hotel.id] || {};
  const avaliacao = dados.avaliacao;
  const fotos = dados.fotos?.length ? [...dados.fotos] : [{ src: hotel.imagem, legenda: hotel.legenda }];
  const destino = `${hotel.cidade}, ${hotel.uf}`;
  const endereco = dados.endereco || [hotel.bairro, destino].filter(Boolean).join(" · ");
  const mapa = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${hotel.nome}, ${endereco}`);
  const fonte = dados.fonte || hotel.fonte;
  const fonteFotos = dados.fonteFotos || fonte;
  const nomeFonte = avaliacao?.fonte || "Trivago";
  const linkAvaliacao = avaliacao?.url || fonte;
  const preco = diaria(hotel);
  const reserva = urlHotel("reserva.html", hotel.id);
  const comodidades = dados.comodidades || [];
  const sobre = hotel.descricao.startsWith("Hospedagem em ") && hotel.descricao.includes("Consulte o anúncio")
    ? `${hotel.nome} fica em ${destino}${hotel.bairro && hotel.bairro !== hotel.cidade ? ", na região de " + hotel.bairro : ""}.`
    : hotel.descricao;

  document.title = hotel.nome + " | LuxeStay";
  area.innerHTML = `
    <a class="text-link back-link" href="${urlResultados()}">← Voltar às hospedagens</a>
    <header class="property-heading">
      <div>
        <p class="eyebrow">${tipos[hotel.tipo]} · ${destino}</p>
        <h1>${hotel.nome}</h1>
        <div class="property-address">${iconeDetalhe("local")}<span>${endereco} · <a href="#localizacao">Ver localização</a></span></div>
      </div>
      <a class="action" href="${reserva}">Reservar agora</a>
    </header>
    <nav class="property-nav" aria-label="Seções da hospedagem">
      <a href="#fotos">Fotos</a><a href="#preco">Diária</a><a href="#sobre">Sobre</a>
      ${avaliacao ? '<a href="#avaliacoes">Avaliações</a>' : ""}
      <a href="#localizacao">Localização</a>
    </nav>

    <div class="property-grid">
      ${montarGaleria(fotos)}
      <div class="property-sidebar">
        ${avaliacao ? `<section id="avaliacoes" class="property-review" aria-label="Avaliações de hóspedes">
          <strong class="property-score">${notaDetalhes.format(avaliacao.nota)}<small> / ${avaliacao.escala || 10}</small></strong>
          <div><h2>${classificacaoHospedes(avaliacao)}</h2>
            ${linkAvaliacao ? `<a href="${linkAvaliacao}" target="_blank" rel="noopener noreferrer">${quantidadeAvaliacoes.format(avaliacao.total)} avaliações · ${nomeFonte}</a>` :
            `<span>${quantidadeAvaliacoes.format(avaliacao.total)} avaliações</span>`}
          </div>
        </section>` : ""}
        <aside id="preco" class="property-booking" aria-labelledby="titulo-preco">
          <div class="rate-heading"><h2 id="titulo-preco">Sua estadia</h2>
            ${hotel.desconto ? `<span class="rate-discount">−${hotel.desconto}%</span>` : ""}</div>
          ${hotel.desconto ? `<p class="rate-offer">Black Friday simulada</p>` : ""}
          <p class="rate-label">Diária por acomodação</p>
          <div class="rate-line">
            ${hotel.desconto ? `<del>${moeda.format(hotel.preco)}</del>` : ""}
            <strong class="rate-amount">${moeda.format(preco)}</strong>
          </div>
          ${hotel.desconto ? `<p class="rate-saving">Economia de ${moeda.format(hotel.preco - preco)} por noite</p>` : ""}
          <p class="tax-note">Impostos e taxas incluídos na estimativa simulada.</p>
          <p class="rate-conditions">Condições da simulação</p>
          <ul class="trust-list">
            <li>${iconeInterface("check")} Cancelamento grátis</li>
            <li>${iconeInterface("check")} Sem taxa de reserva</li>
          </ul>
          <a class="action rate-action" href="${reserva}">Ver preço e reservar <span aria-hidden="true">→</span></a>
        </aside>
        <section id="localizacao" class="property-location" aria-labelledby="titulo-localizacao">
          <span class="location-icon">${iconeDetalhe("local")}</span>
          <div><h2 id="titulo-localizacao">Destaques da localização</h2>
            <strong>${destino}</strong>
            <address>${endereco}</address>
            <a href="${mapa}" target="_blank" rel="noopener noreferrer">Ver no Google Maps ${iconeDetalhe("externo")}</a>
            ${dados.localizacao ? `<div class="location-rating">
              <b>${notaDetalhes.format(dados.localizacao.nota)} <small>/ 10</small></b>
              <span>Nota de localização<a href="${dados.localizacao.fonte}" target="_blank" rel="noopener noreferrer">Fonte da avaliação</a></span>
            </div>` : ""}
          </div>
        </section>
      </div>
    </div>

    <section class="property-highlights" aria-labelledby="titulo-destaques">
      <h2 id="titulo-destaques">Destaques da acomodação</h2>
      <ul class="amenity-list">
        ${comodidades.map(nome => {
          const [icone, categoria] = comodidadesDetalhes[nome] || ["check", "Comodidade"];
          return `<li><span class="amenity-icon">${iconeDetalhe(icone)}</span><div><strong>${nome}</strong><small>${categoria}</small></div></li>`;
        }).join("")}
        <li><span class="amenity-icon">${iconeDetalhe("pessoas")}</span><div><strong>Até ${hotel.capacidade} hóspedes</strong><small>Por acomodação</small></div></li>
      </ul>
    </section>

    <div class="property-information">
      <section id="sobre" aria-labelledby="titulo-sobre">
        <h2 id="titulo-sobre">Sobre a hospedagem</h2>
        <p>${sobre}</p>
        <p>Na estimativa, você escolhe as datas e a quantidade de adultos e crianças. Para grupos com mais de ${hotel.capacidade} pessoas, o total considera as acomodações necessárias.</p>
        <div class="property-sources">
          ${fonte ? `<a href="${fonte}" target="_blank" rel="noopener noreferrer">Consultar informações na fonte</a>` : ""}
          ${fonteFotos ? `<a href="${fonteFotos}" target="_blank" rel="noopener noreferrer">Fonte das fotos</a>` : ""}
          ${hotel.fonteFoto && hotel.fonteFoto !== fonteFotos ? `<a href="${hotel.fonteFoto}" target="_blank" rel="noopener noreferrer">Crédito da foto original</a>` : ""}
        </div>
      </section>
    </div>`;

  const abas = area.querySelectorAll(".property-nav a");
  function atualizarAba() {
    const ativa = Array.from(abas).find(link => link.hash === location.hash) || abas[0];
    for (const aba of abas) {
      if (aba === ativa) aba.setAttribute("aria-current", "location");
      else aba.removeAttribute("aria-current");
    }
  }
  atualizarAba();
  window.addEventListener("hashchange", atualizarAba);
  const capaLocal = hotel.imagem.startsWith("images/") ? { src: hotel.imagem, legenda: hotel.legenda } : null;
  ativarGaleria(area.querySelector(".detail-gallery"), fotos, capaLocal);
}
