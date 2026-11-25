"use strict";

// Fotos, endereços e avaliações consultados nas fontes indicadas em cada hospedagem.
const comodidadesDetalhes = {
  "Piscina": ["piscina", "Lazer"], "Piscinas": ["piscina", "Lazer"],
  "Piscinas externas": ["piscina", "Área ao ar livre"], "Piscina ao ar livre": ["piscina", "Área ao ar livre"],
  "Piscina de borda infinita": ["piscina", "Lazer"], "Wi-Fi": ["wifi", "Internet"],
  "Wi-Fi grátis": ["wifi", "Internet sem custo"], "Academia": ["academia", "Atividade física"],
  "Spa": ["spa", "Bem-estar"], "Estacionamento": ["carro", "Na hospedagem"],
  "Estacionamento privativo": ["carro", "Disponível no local"], "Restaurante": ["restaurante", "Gastronomia"],
  "Ar-condicionado": ["clima", "Conforto nos quartos"], "Bar no hotel": ["bar", "Gastronomia"],
  "Aceita animais": ["pet", "Animais de estimação"], "Café da manhã": ["cafe", "Consulte a tarifa"],
  "Café da manhã incluído": ["cafe", "Incluído na diária"], "Recepção 24h": ["recepcao", "Atendimento"],
  "Serviço de quarto": ["servico", "Atendimento no quarto"], "Quartos para não fumantes": ["sem-fumo", "Acomodação"]
};

const dadosDetalhes = {
  1: {
    fonte: "https://www.expedia.com.br/Brasilia-Hoteis-Royal-Tulip-Brasilia-Alvorada.h2825349.Hotel-Reservas",
    endereco: "SHTN, Trecho 1, Conjunto 1B, Bloco C, Brasília – DF, 70800-200",
    avaliacao: { nota: 9.6, total: 1325, fonte: "Expedia", url: "https://www.expedia.com.br/Brasilia-Hoteis-Royal-Tulip-Brasilia-Alvorada.h2825349.Hotel-Reservas"}, 
    localizacao: { nota: 9.3, fonte: "https://www.booking.com/hotel/br/royal-tulip-brasilia-alvorada.pt-br.html" },
    comodidades: ["Piscinas externas", "Academia", "Spa", "Café da manhã", "Estacionamento privativo", "Wi-Fi grátis", "Recepção 24h", "Restaurante"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/3000000/2830000/2825400/2825349/c5022b42.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Piscina do hotel" },
      { src: "https://images.trvl-media.com/lodging/3000000/2830000/2825400/2825349/39e18159.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com varanda" },
      { src: "https://images.trvl-media.com/lodging/3000000/2830000/2825400/2825349/b2e477ae.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Átrio do hotel" },
      { src: "https://images.trvl-media.com/lodging/3000000/2830000/2825400/2825349/dfa2bae2.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Fachada à beira do lago" }
    ]
  },
  2: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/bras%C3%ADlia-palace-hotel?search=100-950829",
    endereco: "SHTN Trecho 01 Conjunto 01, SHTN Trecho 2, 1, 70800-200, Brasília, Brasil",
    avaliacao: { nota: 9.2, total: 9413, classificacao: "Excelente"}, 
    localizacao: { nota: 9.1, fonte: "https://www.booking.com/hotel/br/brasilia-palace.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/69/df/99257283f5df3b3dc7c23d8a984e92fa3a34c8ebbf4d97a5c465dc0b4cae.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/b2/1b/622a30348d5cfa6b750477274c86d6fe248472333617a6463d677ffab614.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/c9/54/a351e56f5655fa3e00bd7ce331e3c406319e3c5f17db15a8cc1302e5b23c.jpeg", legenda: "Banheiro" }
    ]
  },
  3: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/b-hotel-brasilia-bras%C3%ADlia?search=100-9743666",
    endereco: "Bloco J, St. Hoteleiro Norte, Lote L, 70705-100, Brasília, Brasil",
    avaliacao: { nota: 9.3, total: 6796, classificacao: "Excelente"}, 
    localizacao: { nota: 9.6, fonte: "https://www.booking.com/hotel/br/b-brasilia.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/6b/8a/e9f9359b531d15bc091cb12668fb4a1489d1d22a8c831a59484e1719c1e3.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/da/de/c2f82bfe723e9ee20c25f09b85958a501916181b592507cb75db59f296c8.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/8a/b3/ed00bb2cef6d734e6f7dda30e5b34bedd4a6d51155ec83c273be56797fdd.jpeg", legenda: "Quarto" }
    ]
  },
  4: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/copacabana-palace-a-belmond-hotel-rio-de-janeiro?search=100-104990",
    endereco: "Av. Atlântica, 1702, 22021-001, Rio de Janeiro, Brasil",
    avaliacao: { nota: 9.6, total: 48831, classificacao: "Excelente"}, 
    localizacao: { nota: 9.5, fonte: "https://www.booking.com/hotel/br/copacabana-palace.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/ad/37/2e37c7f38a124bb2e0197811e35902587ed441354c8ba334077ac9da6a57.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/c4/95/1da87d9896fd134c82c9f5a6a108c388cf77f84dff8f1ea8a8699310cc85.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/9a/22/35264800ca52474a375be6ebfb7fc497343925af0d43830a094ebbae81c7.jpeg", legenda: "Banheiro" }
    ]
  },
  5: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-fairmont-rio-de-janeiro-copacabana?search=100-104722",
    endereco: "Avenida Atlântica, 4240, Copacabana, 22070-002, Rio de Janeiro, Brasil",
    avaliacao: { nota: 9.2, total: 9772, classificacao: "Excelente"}, 
    localizacao: { nota: 9.4, fonte: "https://www.booking.com/hotel/br/rio-de-janeiro.pt-br.html" },
    comodidades: ["Piscina de borda infinita", "Spa", "Academia", "Estacionamento", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/66/7e/dc34b875a673c18731af2ccf518be6f561f8481d2b637f5e4d35e1a2844b.jpeg", legenda: "Foto do hotel" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/a5/90/7f0fce59ab580e0a0e8af0c3b5b5e4626225fd20cee2b6ac38b346af5cce.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/5b/bd/a9e83fc6675768179fbf7b5e55402c758e67c448b22b1178de7b3680c452.jpeg", legenda: "Banheiro" }
    ]
  },
  6: {
    fonte: "https://www.expedia.com.br/Recife-Hoteis-NANNAI-Muro-Alto.h8753701.Hotel-Reservas",
    endereco: "Rodovia PE-009, km 3, Gleba 07, Muro Alto, Ipojuca – PE, 55590-000",
    avaliacao: { nota: 9.8, total: 623, fonte: "Expedia", url: "https://www.expedia.com.br/Recife-Hoteis-NANNAI-Muro-Alto.h8753701.Hotel-Reservas"}, 
    localizacao: { nota: 9.3, fonte: "https://www.booking.com/hotel/br/nannai-resort-amp-spa.pt-br.html" },
    comodidades: ["Spa", "Restaurante", "Café da manhã incluído", "Estacionamento", "Piscina ao ar livre", "Wi-Fi grátis", "Recepção 24h"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/9000000/8760000/8753800/8753701/49b55681.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Área da piscina" },
      { src: "https://images.trvl-media.com/lodging/9000000/8760000/8753800/8753701/882cc56f.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com varanda" },
      { src: "https://images.trvl-media.com/lodging/9000000/8760000/8753800/8753701/b69495cf.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Vista aérea do resort" }
    ]
  },
  7: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/summerville-all-inclusive-resort-porto-de-galinhas?search=100-150072",
    fonteFotos: "https://www.expedia.com.br/Recife-Hoteis-Summerville-Resort.h1312477.Hotel-Reservas",
    endereco: "Praia de Muro Alto, Estr. Ac. p/ Praia de Muro Alto e Camboa, s/n, 55590-000, Porto de Galinhas, Brasil",
    avaliacao: { nota: 9.4, total: 18384, classificacao: "Excelente"}, 
    localizacao: { nota: 9.3, fonte: "https://www.booking.com/hotel/br/summerville-beach-resort-ipojuca-pe.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Spa", "Café da manhã incluído", "Estacionamento", "Recepção 24h", "Academia", "Restaurante"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/2000000/1320000/1312500/1312477/58230f5e.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com vista para o mar" },
      { src: "https://images.trvl-media.com/lodging/2000000/1320000/1312500/1312477/5adfe8e6.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Área de lazer do resort" },
      { src: "https://images.trvl-media.com/lodging/2000000/1320000/1312500/1312477/c1a7d856.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com vista para a praia" }
    ]
  },
  8: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-rieger-balne%C3%A1rio-cambori%C3%BA?search=100-588596",
    endereco: "R. 701, 162, 88330-711, Balneário Camboriú, Brasil",
    avaliacao: { nota: 8.1, total: 7494, classificacao: "Muito boa"}, 
    localizacao: { nota: 9, fonte: "https://www.booking.com/hotel/br/rieger.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/91/ac/b105a5456f8e905e6debc45625c14d8e7ee862b71bb02fd492adb719a9ad.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/b5/98/90f1d8773a3a66612390c0b463d5bc6632dbce8c833f349b59edc113b77a.jpeg", legenda: "Cama" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/36/cf/20d905d01486a2f1f3f95c497bada3eef6304b269aa474b7cf6a9d3429a2.jpeg", legenda: "Banheiro" }
    ]
  },
  9: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-windsor-plaza-brasilia-bras%C3%ADlia?search=100-4138594",
    endereco: "Bloco H, 70322-912, Brasília, Brasil",
    avaliacao: { nota: 9.3, total: 9520, classificacao: "Excelente"}, 
    localizacao: { nota: 9.7, fonte: "https://www.booking.com/hotel/br/windsor-plaza-brasilia.pt-br.html" },
    comodidades: ["Wi-Fi", "Spa", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/44/91/20a12ef2b285fbdb7cbc2fc8961385d9ea59088739a884888b6accef2300.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/8e/71/e756a6dcbadc3a909d9c232475cda153a2080df925550470a07a6296fe61.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/c8/b3/a71ad6954b8e3e122b82b5926e321dbea421f409f741e8c05c2fc1cf3a34.jpeg", legenda: "Banheiro" }
    ]
  },
  10: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-meli%C3%A1-brasil-21-bras%C3%ADlia?search=100-164667",
    fonteFotos: "https://www.expedia.com.br/Brasilia-Hoteis-Melia-Brasil-21.h1346506.Hotel-Reservas",
    endereco: "Setor Hoteleiro Sul Q. 6 Cj A Bloco D - Asa Sul, Brasília - DF, 70316-000, Brasília, Brasil",
    avaliacao: { nota: 9, total: 12131, classificacao: "Excelente"}, 
    localizacao: { nota: 9.4, fonte: "https://www.booking.com/hotel/br/melia-brasil-21.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/2000000/1350000/1346600/1346506/b3e1138f.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Saguão do hotel" },
      { src: "https://images.trvl-media.com/lodging/2000000/1350000/1346600/1346506/62d7fdd9.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Restaurante" },
      { src: "https://images.trvl-media.com/lodging/2000000/1350000/1346600/1346506/32f78a73.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com varanda" }
    ]
  },
  11: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/pousada-do-toque-s%C3%A3o-miguel-dos-milagres?search=100-1242349",
    endereco: "Povoado do Toque, R. Felisberto de Ataíde, S/N, 57940-000, São Miguel dos Milagres, Brasil",
    avaliacao: { nota: 9.3, total: 2067, classificacao: "Excelente"}, 
    localizacao: { nota: 9.4, fonte: "https://touristvr.net/br/pousada-do-toque-sao-miguel-dos-milagres" },
    comodidades: ["Wi-Fi grátis", "Ar-condicionado", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/cb/b6/d255515f934878f711490f92e565b50a4b12f2ad4d83099e2371fcbe28bb.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/70/2f/4d41e764eb2187b85409e22f81727b2aedad13ffe0cf03654a8b0684bba2.jpeg", legenda: "Natureza nos arredores" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/0e/d6/e049cad52c2d6ec303bf122bb95c58bedfd7f7313158dcb3cdc92ad0b46f.jpeg", legenda: "Quarto" }
    ]
  },
  12: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/kubitschek-plaza-hotel-bras%C3%ADlia?search=100-104879",
    endereco: "BL E, SHN, 70702-904, Brasília, Brasil",
    avaliacao: { nota: 8.5, total: 8022, classificacao: "Excelente"}, 
    localizacao: { nota: 9.6, fonte: "https://www.booking.com/hotel/br/kubitschek-plaza.pt-br.html" },
    comodidades: ["Piscina", "Academia", "Recepção 24h", "Wi-Fi", "Café da manhã", "Quartos para não fumantes"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_480,q_70,w_720/partner-images/0f/10/92abec16a5671041170abb9723718e8afdb323655dae9e88fdd0a5057164.jpeg", legenda: "Quarto do hotel" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/84/0d/3f772b86cb11b1987f825336f7c6f3cc614242d0b09ba8d04fea42ed3cb3.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/00/95/66eb28394df050bc7411e554503a49d51105213cb52f020fed0e9cb91150.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/c7/4d/052c8904992c81907cee33f7df463ba74ca894811c9230b06adecc2b2a47.jpeg", legenda: "Quarto" }
    ]
  },
  13: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-alvorada-by-bsb-inn-antigo-hotel-atlantico-bras%C3%ADlia?search=100-34430936",
    endereco: "Setor Hoteleiro, S/N, 72011-000, Brasília, Brasil",
    avaliacao: { nota: 7.9, total: 3318, classificacao: "Boa"}, 
    localizacao: { nota: 8.1, fonte: "https://www.booking.com/hotel/br/atlantico-taguatinga.html" },
    comodidades: ["Ar-condicionado", "Restaurante", "Bar no hotel", "Recepção 24h", "Wi-Fi", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/a9/15/fdf2bf5f5f99aa5a31d43a6a28480e31967cd9784f432f72ed2a9314e229.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/29/9d/c026328b1f5727c80be7cf501e9f241c0e23c343f4795748870b5ca46f6a.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/9e/a0/cdd1587f4fa1b0dc108945ab40ee6f115a02a661d64ba6fe831b97c0330f.jpeg", legenda: "Quarto" }
    ]
  },
  14: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/europa-hotel-bras%C3%ADlia-by-bsb-inn?search=100-31735490",
    endereco: "Av. Areal, 70297-400, Brasília, Brasil",
    avaliacao: { nota: 8.3, total: 2539, classificacao: "Muito boa"}, 
    localizacao: { nota: 8.5, fonte: "https://www.booking.com/hotel/br/europa-brasilia1.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Ar-condicionado", "Quartos para não fumantes", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/f1/29/d186f797061695042e1289b093d483669baa6a97ccb7f79804579b4f0429.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/be/06/b413d5c76f6b67b8a56b9d3b302c0e40012956bd3dceec58b69b69038404.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/22/05/4b24688af6f98bc5a56e7c41f526ff4206a47d712e0b7161a97f61faff7b.jpeg", legenda: "Banheiro" }
    ]
  },
  15: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/lets-idea-bras%C3%ADlia-hotel?search=100-522071",
    endereco: "Bloco B, 70705-020, Brasília, Brasil",
    avaliacao: { nota: 8.7, total: 9065, classificacao: "Excelente"}, 
    localizacao: { nota: 9.6, fonte: "https://www.booking.com/hotel/br/allia-gran-brasalia-suites.pt-br.html" },
    comodidades: ["Wi-Fi", "Ar-condicionado", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/41/82/f55968c893805410084cee9205aa61be09e0fa9263932ad9a3cda25e4adb.jpeg", legenda: "Sacada/terraço" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/27/0e/85b5597d9af2e77efbc86763d906fcee224f6eaf30a647e3775d75e611a9.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/4f/8f/a2a3d9458155a58547686564bd7497b22a870f35b6b151cb69179fab3aca.jpeg", legenda: "Quarto" }
    ]
  },
  16: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-mercure-brasilia-lider-bras%C3%ADlia?search=100-104972",
    endereco: "SHN Qd. 5 B. I, 70705-912, Brasília, Brasil",
    avaliacao: { nota: 8.4, total: 8748, classificacao: "Muito boa"}, 
    localizacao: { nota: 9.2, fonte: "https://www.booking.com/hotel/br/apartments-brasilia-lider.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Estacionamento", "Quartos para não fumantes", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/4f/14/c529902fd13fd90f61567cc7a5de077eb8eaf43d581d658905a0b9dde7c7.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/fe/10/3e420a51d8b25ee4571450c5f67403a777e9ab1d6fb03260de707105e4d8.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/db/66/7dc987943c0b3df45756faca2f30fea2e0fc752ebabe551350b650d85eac.jpeg", legenda: "Quarto" }
    ]
  },
  17: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-ramada-by-wyndham-brasilia-alvorada-bras%C3%ADlia?search=100-28347054",
    endereco: "bloco A, 70322-909, Brasília, Brasil",
    avaliacao: { nota: 8.9, total: 5366, classificacao: "Excelente"}, 
    localizacao: { nota: 9.5, fonte: "https://www.booking.com/hotel/br/ramada-by-wyndham-brasilia-alvorada.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/f8/4f/d6e9bcb405c250789948c56bff156c8bd0478415c0ced237a0c9eab7147d.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/1d/d9/4189de7e65ffd48efc6728e2decdf3db65fa69678169486a346a9dd8b586.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/fe/af/c0c1dc96a351f1e55b7c82c82d8a494b530009dfb8d988c97ad94464e3ec.jpeg", legenda: "Quarto" }
    ]
  },
  18: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/garvey-park-hotel-bras%C3%ADlia?search=100-956163",
    fonteFotos: "https://www.expedia.com.br/Brasilia-Hoteis-Garvey-Park-Hotel.h3958055.Hotel-Reservas",
    endereco: "SHN Q. 2, BL J, 70702-909, Brasília, Brasil",
    avaliacao: { nota: 7.7, total: 6013, classificacao: "Boa"}, 
    localizacao: { nota: 9.4, fonte: "https://www.booking.com/hotel/br/garvey-park-brasilia12345.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/4000000/3960000/3958100/3958055/596ab57b.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Piscina externa" },
      { src: "https://images.trvl-media.com/lodging/4000000/3960000/3958100/3958055/59c01849.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Fachada" },
      { src: "https://images.trvl-media.com/lodging/4000000/3960000/3958100/3958055/049744e3.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Recepção" }
    ]
  },
  19: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-tryp-by-wyndham-brasilia-nacoes-bras%C3%ADlia?search=100-33707524",
    endereco: "BL I, 70322-907, Brasília, Brasil",
    avaliacao: { nota: 9.1, total: 3789, classificacao: "Excelente"}, 
    localizacao: { nota: 9.6, fonte: "https://www.booking.com/hotel/br/tryp-by-wyndham-brasilia-nacoes.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/e0/fd/0a072e5b86ad26ee9ef8a86ae8759889d74674a5e6996f6791e24eeb12f6.jpeg", legenda: "Piscina" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/19/70/897094d27c344a6827a2d2ee2dd4c74e51c37c3f2311d820dec79026803d.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/4b/17/8ef3b83b609d0c94ed22e8213f65b1f21f4151ceec3f71c4e8678b7931e3.jpeg", legenda: "Quarto" }
    ]
  },
  20: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-golden-tulip-bras%C3%ADlia-alvorada?search=100-129720",
    endereco: "SHTN, Trecho 1, Conjunto 1B, blocos A e B, Brasília – DF, 70800-200",
    avaliacao: { nota: 8.9, total: 9277, classificacao: "Excelente"}, 
    localizacao: { nota: 8.9, fonte: "https://www.booking.com/hotel/br/golden-tulip-brasilia-alvorada.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/d3/c9/ea4ae2c43bcb6348933faf10a3f6148b7af2c7c7e9633e25a5dac88279d6.jpeg", legenda: "Parte externa" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/04/06/30d5134ee99ef3edb849a884ce19e9e6e436dd1fea4d63feb9b4af9a4dba.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/48/b0/f00c3434405e5e1ae7541be2f9a9f9c9811cfb96afadd2ea2232e8e2a978.jpeg", legenda: "Quarto" }
    ]
  },
  21: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-manhattan-plaza-bras%C3%ADlia?search=100-104873",
    endereco: "SHN Quadra 02 Bloco A, St. Hoteleiro Norte, 70702-900, Brasília, Brasil",
    avaliacao: { nota: 8.9, total: 11585, classificacao: "Excelente"}, 
    localizacao: { nota: 9.5, fonte: "https://www.booking.com/hotel/br/manhattan-plaza.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Ar-condicionado", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/aa/3b/6c32b4d92ef7251f0104bc0725ff70fdc1b88e4085d5f0a0098826553e57.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/b6/54/398565857a4ced46580dab01445841754e32615a674984d8e8458ad91584.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/a2/d9/39366a56483fda481362c0b3cec881ac7441c4b60cecbb996fb549f89a0c.jpeg", legenda: "Quarto" }
    ]
  },
  22: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-fusion-hplus-express-bras%C3%ADlia?search=100-2653224",
    endereco: "Shn qd 01, 70701-040, Brasília, Brasil",
    avaliacao: { nota: 9, total: 9854, classificacao: "Excelente"}, 
    localizacao: { nota: 9.5, fonte: "https://www.booking.com/hotel/br/fusion-express.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Recepção 24h", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/e9/82/20a464ad23940943fa001115999860ccd41e989d9c1f2f6e666a25923211.jpeg", legenda: "Parte externa" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/e3/52/9cfec5b8ad08d6177e017fcf3371bb5f5fe903813b776bc9e0651b79e639.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/aa/a3/dd7cae2b1a64f7c8cb5a98b7d994f20cd4e28590b70964d027411ee37c93.jpeg", legenda: "Quarto" }
    ]
  },
  23: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-comfort-suites-brasilia-bras%C3%ADlia?search=100-104668",
    endereco: "SHN Q 4, Bloco D, 70704-040, Brasília, Brasil",
    avaliacao: { nota: 8.7, total: 9711, classificacao: "Excelente"}, 
    localizacao: { nota: 9.5, fonte: "https://www.booking.com/hotel/br/comfort-suites-brasilia.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/d5/26/9fff3e4b4ce4b14d683e9d15bb6b737bb67e42f6f0b14cdcf8c16fa420f0.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/2d/bd/074054f06d6a04ea850482025ebea8c770716c9e41548995552fa96be3c7.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/b8/6c/c357724f5558d6c6aee3c9488923ff8f2627e8f519ef3a72d3f1195441e1.jpeg", legenda: "Quarto" }
    ]
  },
  24: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-hplus-vision-executive-bras%C3%ADlia?search=100-4521140",
    fonteFotos: "https://www.expedia.com.br/Brasilia-Hoteis-Vision-Hplus-Express.h12423375.Hotel-Reservas",
    endereco: "Qd. 01 - SDN SHN Bloco F - Asa Norte, 70701-000, Brasília, Brasil",
    avaliacao: { nota: 8.9, total: 7417, classificacao: "Excelente"}, 
    localizacao: { nota: 9.4, fonte: "https://www.booking.com/hotel/br/vision-hplus-executive.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/13000000/12430000/12423400/12423375/eb9210ca.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com vista para Brasília" },
      { src: "https://images.trvl-media.com/lodging/13000000/12430000/12423400/12423375/91249788.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Saguão" },
      { src: "https://images.trvl-media.com/lodging/13000000/12430000/12423400/12423375/36589f7d.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Piscina no terraço" }
    ]
  },
  25: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/pratagy-beach-all-inclusive-resort-macei%C3%B3?search=100-834526",
    endereco: "AL-101 Norte, km 10, Maceió – AL, 57039-600",
    avaliacao: { nota: 9, total: 36320, classificacao: "Excelente"}, 
    localizacao: { nota: 8.4, fonte: "https://www.booking.com/hotel/br/village-pratagy-resort.html" },
    comodidades: ["Wi-Fi", "Piscina", "Spa", "Café da manhã incluído", "Academia", "Estacionamento", "Recepção 24h", "Restaurante"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/5e/88/af7acc5b1d26669140fd26bcfb61e09111b917dd5258dff6beda369e85be.jpeg", legenda: "Praia do resort" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/4a/ca/dd6d5b5050724a5b0309e6d3b192054bad958d44a5b8f8a4f9a1735faee8.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/da/db/d58e36437caf1429d831d1dbadc7eb0201753d6bc15dc96c7762e16d42ae.jpeg", legenda: "Banheiro" }
    ]
  },
  26: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/matsubara-hotel-macei%C3%B3?search=100-104905",
    endereco: "Av. Brigadeiro Eduardo Gomes de Brito, 1551, 57038-230, Maceió, Brasil",
    avaliacao: { nota: 7.5, total: 7633, classificacao: "Boa"}, 
    localizacao: { nota: 8.2, fonte: "https://www.booking.com/hotel/br/matsubara.html" },
    comodidades: ["Estacionamento", "Ar-condicionado", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Wi-Fi", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/ac/8e/95adf035221ba96307228f117616807705658576ed2d6e08a2a0f19f01dd.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/a6/de/9156e74da119fc42e4fbc977a6062e4a0abd162046caa0022c0a559006a8.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/69/4e/ef933017dfe6b0628fcf5c18878c17650c2e1b7eec624dab958358d05d66.jpeg", legenda: "Quarto" }
    ]
  },
  27: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/villas-supreme-hotel-macei%C3%B3?search=100-3502866",
    endereco: "Villas Supreme Hotel, Rua da Paz 10202c, 57039-600, Maceió, Brasil",
    avaliacao: { nota: 8.5, total: 2780, classificacao: "Excelente"}, 
    localizacao: { nota: 9.1, fonte: "https://www.holiwise.com/stays/br/maceio_brazil/villas-supreme-hotel/79166" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Spa", "Estacionamento", "Quartos para não fumantes", "Restaurante", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/49/69/3d42c1b792a802b39a1c2794918aefcff577e40a4b706f028506a2762c21.jpeg", legenda: "Parte externa" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/27/3c/c58913cbb6408c540a187678e1b39d000f6b8fee81cb1d4e657d87ce8f49.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/72/90/bab73259a9f0862f0164a168b45b7c4a2cce034240c45b339ae8a3eb706b.jpeg", legenda: "Banheiro" }
    ]
  },
  28: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/jati%C3%BAca-hotel-resort-macei%C3%B3?search=100-116406",
    endereco: "Av. Álvaro Otacílio, 5500, 57036-850, Maceió, Brasil",
    avaliacao: { nota: 9.2, total: 9626, classificacao: "Excelente"}, 
    localizacao: { nota: 9.3, fonte: "https://www.booking.com/hotel/br/jatiuca-resort.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/f0/47/a791faf7cbc32140a5386cf77852430a35b30602562260aded50bae875fd.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/50/57/3a02b40729d1a1a56e89308be959357f43d81c47e0f704ed3f6ce97c4009.jpeg", legenda: "Natureza nos arredores" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/27/39/985ac63bb73bf65b67fa97e2d846b9f6d7d1482962f44e8523639d017ea7.jpeg", legenda: "Quarto" }
    ]
  },
  29: {
    fonte: "https://www.hotelpontaverde.com.br/hoteis/maceio/sobre-o-hotel",
    fonteFotos: "https://www.expedia.com.br/Maceio-Hoteis-Hotel-Ponta-Verde-Maceio.h8099524.Hotel-Reservas",
    endereco: "Av. Álvaro Otacílio, 2933, Ponta Verde, Maceió – AL, 57035-180",
    avaliacao: { nota: 8.6, total: 495, fonte: "Expedia", url: "https://www.expedia.com.br/Maceio-Hoteis-Hotel-Ponta-Verde-Maceio.h8099524.Hotel-Reservas"}, 
    localizacao: { nota: 9.6, fonte: "https://www.booking.com/hotel/br/ponta-verde.pt-br.html" },
    comodidades: ["Piscina", "Wi-Fi grátis", "Recepção 24h", "Academia", "Estacionamento", "Serviço de quarto", "Ar-condicionado", "Restaurante"],
    fotos: [
      { src: "https://images.trvl-media.com/lodging/9000000/8100000/8099600/8099524/cb846499.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Quarto com vista para a praia" },
      { src: "https://images.trvl-media.com/lodging/9000000/8100000/8099600/8099524/43a0c702.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Varanda" },
      { src: "https://images.trvl-media.com/lodging/9000000/8100000/8099600/8099524/068cd60e.jpg?impolicy=resizecrop&ra=fit&rw=960", legenda: "Restaurante" }
    ]
  },
  30: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/porto-kaet%C3%A9-hotel-macei%C3%B3?search=100-8256346",
    endereco: "Av. Dr. Júlio Marques Luz, 221, 57035-700, Maceió, Brasil",
    avaliacao: { nota: 9.3, total: 7500, classificacao: "Excelente"}, 
    localizacao: { nota: 9.3, fonte: "https://www.booking.com/hotel/br/porto-jatiuca.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/1e/c4/2f58f65aa25c7f5a934fc0b92d97d6ba9624e720bc0cd93ddb508506d84d.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/ee/ce/c572031d65b0d3c5148ae18d1079e0d743e94525d03f4a4c84b3ef05a3d7.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/02/30/5dc64b2fce808737bed25580d0245f924144fd24ede4120c94c47ead2860.jpeg", legenda: "Banheiro" }
    ]
  },
  31: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-pousada-praia-bela-macei%C3%B3?search=100-13576326",
    fonteFotos: "https://www.decolar.com/hoteis/h-1694539/pousada-praia-bela-maceio-maceio",
    endereco: "R. Ver. Mironildes Vieira, 345, 57037-635, Maceió, Brasil",
    avaliacao: { nota: 7.4, total: 2697}, 
    localizacao: { nota: 8.5, fonte: "https://www.booking.com/hotel/br/e-pousada-praia-bela.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Ar-condicionado", "Quartos para não fumantes", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://media.staticontent.com/media/pictures/2532cd3d-e7fa-4997-bbe0-bf21057caa4b", legenda: "Fachada da pousada" },
      { src: "https://media.staticontent.com/media/pictures/c0f0e9a3-a4f3-463e-b159-7170f517f38d", legenda: "Área da piscina" },
      { src: "https://media.staticontent.com/media/pictures/e7853803-c703-4619-a3ac-882a2445e2ec", legenda: "Quarto" }
    ]
  },
  32: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-jati%C3%BAca-suites-resort-by-slaviero-hot%C3%A9is-macei%C3%B3?search=100-7773394",
    endereco: "Av. Roberto Mascarenhas Brito, 666, 57038-230, Maceió, Brasil",
    avaliacao: { nota: 8.8, total: 2083, classificacao: "Excelente"}, 
    localizacao: { nota: 8.8, fonte: "https://www.booking.com/hotel/br/jatiuca-resort-flat.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Spa", "Academia", "Estacionamento", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/f9/c2/2989795e3031fe5ab504d715817ef9dd7927f76d06790639a1f3e384115b.jpeg", legenda: "Piscina" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/c5/17/7090b9f19b1d07e9eeb77b3cc8e9be838a5173024bc0790f4696d717b1dc.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/c3/96/90a33396f622e734328d0ec6ca1c5247fac8f01e281a5c41961aef3122f8.jpeg", legenda: "Quarto" }
    ]
  },
  33: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-atl%C3%A2ntico-prime-rio-de-janeiro?search=100-4626720",
    endereco: "R. do Rezende, 87, 20231-091, Rio de Janeiro, Brasil",
    avaliacao: { nota: 7.3, total: 35123, classificacao: "Boa"}, 
    localizacao: { nota: 7.5, fonte: "https://www.booking.com/hotel/br/hotel-atlantico-prime.html" },
    comodidades: ["Wi-Fi", "Estacionamento", "Ar-condicionado", "Academia", "Café da manhã", "Recepção 24h", "Quartos para não fumantes"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/84/7e/ef558f0baaec56f3e1c98eb4f6c35c9d15ed8d382943dcc62f58bda9fcdf.jpeg", legenda: "Lounge" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/ae/a0/decacd654332d53ce9fb26cd6903b49c94c115a77591c880d7d73194285f.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/b0/fd/4c59bf223dde97ab3e3515f3ec89186e8b32700b611c68713bfab0c88927.jpeg", legenda: "Banheiro" }
    ]
  },
  34: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-nacional-rio-de-janeiro?search=100-17020926",
    endereco: "Av. Niemeyer, 769, 22450-221, Rio de Janeiro, Brasil",
    avaliacao: { nota: 8.8, total: 14061, classificacao: "Excelente"}, 
    localizacao: { nota: 8.6, fonte: "https://www.booking.com/hotel/br/hotel-nacional-rio-de-janeiro.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Spa", "Academia", "Estacionamento", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/9b/83/5a843646e0b677af9c43e42829a51268a2fe6a4b3c19500f8d08c5024c2d.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/16/ef/91cb951dc877e7be5b5be280c72dd919c60138f319e915e303f8065b7407.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/c6/fa/8fe6668b19450c6c92f147b1d061657a091be1854f0a13dd34a634ebe5eb.jpeg", legenda: "Banheiro" }
    ]
  },
  35: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-ibis-rio-porto-atlantico-rio-de-janeiro?search=100-5789164",
    endereco: "Av. Prof. Pereira Reis, 49, 20220-800, Rio de Janeiro, Brasil",
    avaliacao: { nota: 8.1, total: 4198, classificacao: "Muito boa"}, 
    localizacao: { nota: 8.2, fonte: "https://www.booking.com/hotel/br/ibis-rio-porto-atlantico.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Spa", "Estacionamento", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/6f/b8/8a87578f1f65c60972cf6f9eaa9ce793f4b0688d099af7de94d42992d8c2.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/cc/7c/a410d58365f5290aa904d15edd747cc1cf2b3f6acc2381e752100ae00897.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/74/14/b2d559021eb06e7945ea942e420b88a80bf40debc88b7a834da649d4fa67.jpeg", legenda: "Quarto" }
    ]
  },
  36: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-atl%C3%A2ntico-business-centro-rio-de-janeiro?search=100-1797509",
    endereco: "R. Sen. Dantas, 25, 20031-202, Rio de Janeiro, Brasil",
    avaliacao: { nota: 7.3, total: 27888}, 
    localizacao: { nota: 8.5, fonte: "https://www.booking.com/hotel/br/atlantico-business.en-gb.html" },
    comodidades: ["Wi-Fi", "Spa", "Academia", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/bc/7d/5a43451ad315fd7f1b5ce2ca322670c39f76f676d5d7340187d1034ab018.jpeg", legenda: "Natureza nos arredores" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/70/2f/8a8e47a2f118c0f934a78a3974c667b99db04559af0d8a9f86a07510112e.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/98/f1/64ec6531da1d6c6829fb8b6d3dcc7b8a575e88cc5cd185e15ced75b1ef70.jpeg", legenda: "Quarto" }
    ]
  },
  37: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/b-b-hotels-rio-de-janeiro-norte?search=100-23633190",
    endereco: "Av. Dom Hélder Câmara, 5531, 20770-145, Rio de Janeiro, Brasil",
    avaliacao: { nota: 9.1, total: 5528, classificacao: "Excelente"}, 
    localizacao: { nota: 8.7, fonte: "https://www.booking.com/hotel/br/b-amp-b-hotels-rio-de-janeiro-norte.html" },
    comodidades: ["Wi-Fi grátis", "Aceita animais", "Ar-condicionado", "Quartos para não fumantes", "Recepção 24h"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/89/d8/36d4dc6f8ba6c6c812661380402d5d7a9fc35d60aa6681b02a2ba0128073.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/82/a0/d516c27b9a4864550f45516b85310faa3bca8960be8754cea8ccfdd6bf37.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/ab/fe/84f8e799fec02fb2b296c2f46b2ad551bc315a64aac773a1db9f5792aa84.jpeg", legenda: "Quarto" }
    ]
  },
  38: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-atl%C3%A2ntico-copacabana-rio-de-janeiro?search=100-111534",
    endereco: "Rua Siqueira Campos, 90, 22071-032, Rio de Janeiro, Brasil",
    avaliacao: { nota: 7, total: 18621}, 
    localizacao: { nota: 8.5, fonte: "https://www.booking.com/hotel/br/atlantico-copacabana.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/26/48/3354589aa20e6b8aef44c52de496a360fa16683a620bab451a8ebcadfaa3.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/2f/b2/279fdc65be83f2d0dc8ffc1303a0b556c8e79bdb9b1f89cd1d4880fa0b60.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/d9/65/8d8afce57da05a067229406b003145d2d1b621b2afbce862fa7b990956f4.jpeg", legenda: "Banheiro" }
    ]
  },
  39: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/resort-hotel-village-le-canton-teres%C3%B3polis?search=100-4357504",
    endereco: "R. Antônio da Silva, 300, 25990-150, Teresópolis, Brasil",
    avaliacao: { nota: 8.9, total: 12433, classificacao: "Excelente"}, 
    localizacao: { nota: 8.6, fonte: "https://www.booking.com/hotel/br/village-le-canton.html" },
    comodidades: ["Wi-Fi", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/1c/51/35bdc5a4222924b4b72a3cc24a9fac2c03f53d27d7a2af34e74a004aff85.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/5e/ce/bef61287dfb42f6028e05475f1230b7f39084e0a4fb46e39fbbf90566bc2.jpeg", legenda: "Arredores" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/a7/e3/0ced2b2e6d5a85beac3ca74e57722a5f4a8783c50322cd84f31b0d35fea6.jpeg", legenda: "Quarto" }
    ]
  },
  40: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-pousada-apple-house-paraty?search=100-5002942",
    endereco: "R. Joaquim Gama, 23970-000, Paraty, Brasil",
    avaliacao: { nota: 9.6, total: 9304, classificacao: "Excelente"}, 
    localizacao: { nota: 8.5, fonte: "https://www.booking.com/hotel/br/pousada-apple-house-paraty.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Academia", "Estacionamento", "Piscina ao ar livre", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/65/13/d2423eb868ba3ffdbf34b964887368119326869b82f5a72348758da5c88d.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/c3/b1/545c859167ed0d9608f0c82dadd6657c58dcca70760dc07dd97d78bdcddc.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/6e/02/8947c68f1605be2d3b188f110e1cdf03523d911aa35e78384e63b10fa253.jpeg", legenda: "Banheiro" }
    ]
  },
  41: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/b%C3%BAzios-beach-resort?search=100-1334288",
    endereco: "Rua das Dunas, Praia de Tucuns, S/N, 28954-660, Búzios, Brasil",
    avaliacao: { nota: 8, total: 14428, classificacao: "Muito boa"}, 
    localizacao: { nota: 7.6, fonte: "https://www.booking.com/hotel/br/blue-buzios.en-gb.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Estacionamento", "Restaurante", "Recepção 24h", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/7d/9f/0ab2887607cb17956546deab1531b6927777f15df36d4d3253419502dbb2.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/9d/f2/ba555a69b65817a60b09b91f0a73693d98a1aa566f44141a95b4a2e9e14e.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/94/b4/52a0a2589acc3f187c7c1ff34d05e2d3504bedb747b43a447fd5dddc91bd.jpeg", legenda: "Banheiro" }
    ]
  },
  42: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-fazenda-santa-barbara-engenheiro-paulo-de-frontin?search=100-1815113",
    endereco: "Estrada Engenheiro Paulo de Frontin, km. 12, 26650-000, Engenheiro Paulo de Frontin, Brasil",
    avaliacao: { nota: 8.8, total: 3188, classificacao: "Excelente"}, 
    localizacao: { nota: 8.7, fonte: "https://www.booking.com/hotel/br/fazenda-sta-barbara.html" },
    comodidades: ["Wi-Fi grátis", "Piscina", "Spa", "Academia", "Estacionamento", "Quartos para não fumantes", "Restaurante", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/9c/a8/2d52735f7fa14999615e75a974f3236a24381c6a980380347792e3b82d74.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/17/a4/a3bcc9f5c90423da73aed18d32573c408726dccefee8142a085e8480c89d.jpeg", legenda: "Edifício" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/5c/f7/61cef29634742d06147b1877cc8185f408fa8f2733a736707061e947ab8a.jpeg", legenda: "Piscina interna" }
    ]
  },
  43: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/hotel-tulip-inn-campos-dos-goytacazes?search=100-4418120",
    endereco: "R. Dr. Silvio Bastos Tavares, 340, 28051-250, Campos dos Goytacazes, Brasil",
    avaliacao: { nota: 8.7, total: 6399, classificacao: "Excelente"}, 
    localizacao: { nota: 9.2, fonte: "https://www.booking.com/hotel/br/tulip-inn-campos.pt-br.html" },
    comodidades: ["Wi-Fi grátis", "Estacionamento", "Ar-condicionado", "Academia", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Serviço de quarto", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/b8/22/03316eba576610d821b1faf75f930e92cabc0754d2382eb606f404e19a02.jpeg", legenda: "Vista da hospedagem" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/4c/71/0ca2f583e0ef22361aa7eadf745aa0a8c515931ef36e42ec4a762b372c48.jpeg", legenda: "Recepção" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/partner-images/c9/ab/ddbeba01d0888807a1f1d8067a9d848b23243ae1c3486fc323c85c0391a3.jpeg", legenda: "Quarto" }
    ]
  },
  44: {
    fonte: "https://www.trivago.com.br/pt-BR/oar/castelo-de-itaipava-hotel-eventos-e-gastronomia-petr%C3%B3polis?search=100-4440852",
    endereco: "Km 56 ao km 57,998 BR-040, 25740-340, Petrópolis, Brasil",
    avaliacao: { nota: 8.5, total: 21669, classificacao: "Excelente"}, 
    localizacao: { nota: 9.2, fonte: "https://www.agoda.com/en-nz/castelo-de-itaipava-hotel-eventos-e-gastronomia-h15427547/hotel/petropolis-br.html" },
    comodidades: ["Wi-Fi grátis", "Spa", "Estacionamento", "Piscina ao ar livre", "Quartos para não fumantes", "Restaurante", "Recepção 24h", "Café da manhã"],
    fotos: [
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/a0/01/47adb5cd53c38b29a2377ff18898f67ce5c56343ea3ba5a3badb3b10ed77.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/8a/f2/9bf2540ed6930d15f9c551b31b7967e4aae33a9512332f759127a5756d37.jpeg", legenda: "Quarto" },
      { src: "https://imgcy.trivago.com/c_fill,e_sharpen:60,f_auto,h_600,q_75,w_960/hotelier-images/ac/19/ac16ca9d57159510d702bbfd47d0f2e582f5919d8d4f2f7f91537a376f38.jpeg", legenda: "Banheiro" }
    ]
  }
};
