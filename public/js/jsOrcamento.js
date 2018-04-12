//Declaração de variáveis globais
var produtos;

//Busca dados do Json no carregamento da página
window.onload = function() {
  rotinaSessao();
  buscarProdutos();
  rotinaLayout();
}

//Rotina necessária para avaliar se a sessão do usuário ainda está ativa (menos de 10 minutos de inatividade)
function rotinaSessao() {
  if (getS("sessaoAberta") == "S") {
    if (new Date().getTime() - getS("sessaoHora") <= 600000) {
      setS("sessaoHora", new Date().getTime());
    } else {
      clrS();
      setS("sessaoAberta", "N");
      nav("index");
    }
  } else {
    clrS();
    nav("index");
  }
}

//Função que carrega o layout da página de acordo com os dados do usuário e configurações customizáveis
function rotinaLayout() {

}

//Função para filtrar os tipos de serviço a serem exibidos
function filtrarOrcamento() {
  var filtrarLogo = getE("checkLogo").checked;
  var filtrarCartao = getE("checkCartao").checked;
  var filtrarPanfleto = getE("checkPanfleto").checked;

  var lista = "";
  lista += "<ul style='list-style-type:none'>";

  for (var i = 0; i < produtos.length; i++){
      lista += "<li>";
      lista += "<input id='" + produtos[i].codigo + "' type='checkbox' class='checkbox'>";
      lista += produtos[i].nome;
      lista += "</li>";
  }
  lista += "</ul>";

  inner("listaServicos", lista);

  getE("botaoFiltrar").className += " is-hidden";
  getE("botaoOrcamento").className = "button is-primary";
}

//Função para gerar e exibir o texto contendo o orçamento
function gerarOrcamento() {

}

//Busca e retorna os objetos no arquivo Json
function buscarProdutos() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      produtos = JSON.parse(this.responseText);
    }
  };
  xmlhttp.open("GET", "./json/produtos.json", true);
  xmlhttp.send();
}
