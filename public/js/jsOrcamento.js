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
  inner("erroOrcamento", "");
  inner("textoPergunta", "Quais produtos e de quantas unidades precisa?");

  var filtrarLogo = getE("checkLogo").checked;
  var filtrarCartao = getE("checkCartao").checked;
  var filtrarPanfleto = getE("checkPanfleto").checked;

  if (!filtrarLogo && !filtrarCartao && !filtrarPanfleto) {
    inner("erroOrcamento", "Selecione pelo menos um tipo serviço!");
    return;
  }

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

//Função para exibir as quantidades de cada produto selecionado
function exibirQuantidades(cod) {
  if (!getE(cod).checked) {
    inner("qtd" + cod, "");
    return;
  }

  var quantidades = "<div style='padding-left: 20px'>";
  quantidades += "<li style='list-style-type: none'>"
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].codigo == cod) {
      for (var q in produtos[i].quantidades) {
        quantidades += "<ul>"
        quantidades += "<label class='checkbox'>"
        quantidades += "<input id='" + produtos[i].codigo + q + "' type='checkbox'>"
        quantidades += " " + q + " unidades: R$ " + produtos[i].quantidades[q];
        quantidades += "</label>";
        quantidades += "</ul>"
      }
    }
  }

  quantidades += "</li>"
  inner("qtd" + cod, quantidades);
}

//Função para gerar e exibir o texto contendo o orçamento
// function gerarOrcamento() {
//   var produtosSelecionados = [];
//
//   for (var i = 0; i < produtos.length; i++) {
//     var item = {};
//     item.cod = produtos[i].codigo;
//     item.qtd = produtos[i].quantidades;
//     var sel = getE(produtos[i].codigo) == null ? false : getE(produtos[i].codigo).checked;
//     if (sel == true) {
//       produtosSelecionados.push(item);
//     }
//   }
//
//   //"produtosSelecionados" terá apenas o codigo dos produtos selecionados
//   for (var i = 0; i < produtos.length; i++) {
//     for (var j = 0; j < produtosSelecionados.length; j++) {
//       //for (var t in produtosSelecionados[j]) {
//       if (produtos[i].codigo == produtosSelecionados[j].cod) {
//         produtosSelecionados[j].qtd[""]
//       }
//       alert(produtosSelecionados[j][t]["5000"]);
//       //}
//     }
//   }
//
//   var orcamento = "";
// }

function gerarOrcamento() {
  inner("erroOrcamento", "");

  var cliente = getE("inputCliente").value;
  var incluirValorTotal = getE("checkValorTotal").checked;
  var orcamento = "Orçamento: ";
  var valorTotal = 0;

  if (cliente != null && cliente != "") {
    orcamento += cliente + "\n";
  } else {
    orcamento += "\n";
  }

  var produtoValido = false;

  for (var i = 0; i < produtos.length; i++) {
    var checked = getE(produtos[i].codigo) == null ? false : getE(produtos[i].codigo).checked;
    if (checked) {
      orcamento += "\n" + produtos[i].nome + "\n";
      orcamento += produtos[i].descricao + "\n";
      produtoValido = true;
    }

    var quantidadeValida = false;

    for (var q in produtos[i].quantidades) {
      var checked = getE(produtos[i].codigo + "" + q) == null ? false : getE(produtos[i].codigo + "" + q).checked;
      if (checked) {
        orcamento += q + " unidades: R$ " + produtos[i].quantidades[q] + "\n";
        valorTotal += produtos[i].quantidades[q];
        quantidadeValida = true;
      } else if (getE(produtos[i].codigo) == null) {
        quantidadeValida = true;
      }
    }

    if (getE(produtos[i].codigo) != null && getE(produtos[i].codigo).checked && !quantidadeValida) {
      inner("erroOrcamento", "Selecione pelo menos uma quantidade para cada produto marcado!");
      return;
    }
  }

  if (!produtoValido) {
    inner("erroOrcamento", "Selecione pelo menos um produto!");
    return;
  }

  if (incluirValorTotal) {
    orcamento += "\n" + "Valor total: R$ " + valorTotal + "\n";
  }

  orcamento += "\n" + "Orçamento válido por 7 dias.";
  orcamento += "\n" + "Entrega em até 10 dias úteis após aprovação da arte.";

  alert(orcamento);
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
