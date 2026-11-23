# LuxeStay

Projeto acadêmico de Desenvolvimento de Interfaces. O catálogo de hospedagens permite pesquisar por destino ou nome, consultar fotos e simular uma reserva.

## Histórico do projeto

- [Planejamento e identidade visual](https://github.com/gabriel-aalmeida/Desenvolvimento-de-Interfaces/blob/993724857dc4ecf0dd2ed43431784081600fe81f/README.md)
- [Código da versão anterior à atualização](https://github.com/gabriel-aalmeida/Desenvolvimento-de-Interfaces/tree/f5c9d0a02ef847f7ac550db37463cdcde593012a)

Para rodar a versão anterior, baixe o código desse ponto do histórico e abra o arquivo `index.html` com o Live Server no VS Code.

## Executar
## Executar

1. Abra esta pasta no VS Code e use **Open with Live Server** no arquivo `index.html`.
2. Teste a pesquisa por **Brasília**, selecione **Resorts** ou acesse **Black Friday**.
3. Abra um card, simule uma reserva com duas datas e confira o total.
4. Em **Acessibilidade**, alterne entre modo claro e escuro e amplie o texto. As preferências são salvas no navegador.

Use localhost ou HTTPS para testar o cadastro. Conta e senha de teste são utilizadas somente para a demonstração no navegador. O formulário de contato e a confirmação de reserva são simulações. Os preços marcados como referência são os valores de partida encontrados nas páginas da Trivago durante a pesquisa, sujeitos a alteração. Capacidades, condições de reserva e descontos Black Friday são simulados.

## Estrutura do projeto

- `index.html` reúne busca, carrossel e destaques.
- `hospedagens.html`, `detalhes.html` e `reserva.html` formam o fluxo de busca, detalhes e estimativa da estadia.
- `pagamento.html` reúne o resumo da estadia e a confirmação em modo de teste.
- `login.html` e `contato.html` trazem os formulários de demonstração.
- `css/style.css` define a paleta azul-marinho, azul vibrante e coral, usa a tipografia Manrope e inclui layout responsivo, foco e temas claro e escuro.
- `js/hospedagens.js` reúne os dados das 44 hospedagens, com um campo nomeado para cada informação.
- `js/script.js` contém busca, filtros, calendário, estimativa, checkout, carrossel, conta local e preferências.
- `images/` contém as imagens que já integravam o projeto. As fotos externas são carregadas das fontes on-line creditadas nos detalhes. O catálogo contém 44 hospedagens, incluindo 35 com foto e preço de referência da Trivago.

## Construção e referências

1. A base em HTML, CSS e JavaScript foi organizada em páginas com navegação, rodapé e controles de acessibilidade compartilhados.
2. A busca ganhou um banner fotográfico, atalhos por cidade, abas por categoria e campos compactos, com o fluxo de busca da [Trivago](https://www.trivago.com.br/) como referência.
3. A [versão 5.3.8 do Bootstrap](https://getbootstrap.com/docs/5.3/) fornece componentes de card e carrossel. A folha de estilos é carregada via CDN, com estilos locais e controles locais para o carrossel caso o CDN esteja indisponível.
4. O carrossel Black Friday foi ligado aos detalhes dos hotéis e o catálogo passou a centralizar diárias, descontos e fotos.
5. A busca encaminha datas e hóspedes para os detalhes e para a simulação. O tema e o tamanho de fonte são armazenados localmente.
6. As fotos novas podem ser conferidas nos links de crédito de cada hospedagem. A [documentação WCAG 2.2](https://www.w3.org/TR/WCAG22/) é referência para contraste, foco e uso por teclado.
7. O ChatGPT foi utilizado como assistente na reorganização da interface e do código.
