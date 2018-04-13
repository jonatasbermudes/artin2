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

  for (var i = 0; i < produtos.length; i++) {

    if (filtrarCartao && (produtos[i].codigo == "cv1" || produtos[i].codigo == "cv2")) {
      lista += "<p class='control'>";
      lista += "<label class='checkbox'>";
      lista += "<input id='" + produtos[i].codigo + "' type='checkbox' onchange=\"exibirQuantidades('" + produtos[i].codigo + "')\">" + "&nbsp";
      lista += produtos[i].nome;
      lista += "</label>";
      lista += "<div id='qtd" + produtos[i].codigo + "'></div>";
      lista += "</p>";
    }

    if (filtrarPanfleto && (produtos[i].codigo == "pf1" || produtos[i].codigo == "pf2")) {
      lista += "<p class='control'>";
      lista += "<label class='checkbox'>";
      lista += "<input id='" + produtos[i].codigo + "' type='checkbox' onchange=\"exibirQuantidades('" + produtos[i].codigo + "')\">" + "&nbsp";
      lista += produtos[i].nome + "&nbsp";
      lista += "</label>";
      lista += "<div id='qtd" + produtos[i].codigo + "'></div>";
      lista += "</p>";
    }

    if (filtrarLogo && (produtos[i].codigo == "lg1" || produtos[i].codigo == "lg2")) {
      lista += "<p class='control'>";
      lista += "<label class='checkbox'>";
      lista += "<input id='" + produtos[i].codigo + "' type='checkbox' onchange=\"exibirQuantidades('" + produtos[i].codigo + "')\">" + "&nbsp";
      lista += produtos[i].nome + "&nbsp";
      lista += "</label>";
      lista += "<div id='qtd" + produtos[i].codigo + "'></div>";
      lista += "</p>";
    }
  }

  inner("selecoes", lista);

  getE("botaoFiltrar").className += " is-hidden";
  getE("botaoOrcamento").className = "button is-primary";
}

//Função para gerar e exibir o texto contendo o orçamento
function gerarOrcamento() {
  var produtosSelecionados = [];

  for (var i = 0; i < produtos.length; i++) {
    var item = {};
    item.cod = produtos[i].codigo;
    item.sel = getE(produtos[i].codigo) == null ? false : getE(produtos[i].codigo).checked;
    if (item.sel == true) {
      produtosSelecionados.push(item);
    }
  }

  //"produtosSelecionados" terá apenas o codigo dos produtos selecionados
  for (var i = 0; i < produtosSelecionados.length; i++) {
    alert(produtosSelecionados[i].cod + ": " + produtosSelecionados[i].sel);
  }
}

//Função para exibir as quantidades de cada produto selecionado
function exibirQuantidades(cod) {
  if (!getE(cod).checked) {
    inner("qtd" + cod, "");
    return;
  }

  var quantidades = "<div style='padding-left: 20px'>";

  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].codigo == cod) {
      for (var c in produtos[i].quantidades) {
        quantidades += "<label class='checkbox'>"
        quantidades += "<input id='qtd" + produtos[i].codigo + "' type='checkbox'>"
        quantidades += c + " uni: R$ " + produtos[i].quantidades[c] + "&nbsp&nbsp";
        quantidades += "</label>";
      }
    }
  }

  inner("qtd" + cod, quantidades);
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
