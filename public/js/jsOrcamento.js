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

    if (filtrarCartao && (produtos[i].codigo.search("cv") == 0)) {
      lista += "<p class='control'>";
      lista += "<label class='checkbox'>";
      lista += "<input id='" + produtos[i].codigo + "' type='checkbox' onchange=\"exibirQuantidades('" + produtos[i].codigo + "')\">" + "&nbsp";
      lista += produtos[i].nome;
      lista += "</label>";
      lista += "<div id='qtd" + produtos[i].codigo + "'></div>";
      lista += "</p>";
    }

    if (filtrarPanfleto && (produtos[i].codigo.search("pf") == 0)) {
      lista += "<p class='control'>";
      lista += "<label class='checkbox'>";
      lista += "<input id='" + produtos[i].codigo + "' type='checkbox' onchange=\"exibirQuantidades('" + produtos[i].codigo + "')\">" + "&nbsp";
      lista += produtos[i].nome + "&nbsp";
      lista += "</label>";
      lista += "<div id='qtd" + produtos[i].codigo + "'></div>";
      lista += "</p>";
    }

    if (filtrarLogo && (produtos[i].codigo.search("lg") == 0)) {
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
  quantidades += "<li style='list-style-type: none'>";
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].codigo == cod) {
      for (var q in produtos[i].quantidades) {
        quantidades += "<ul>";
        quantidades += "<label class='checkbox'>";
        quantidades += "<input id='" + produtos[i].codigo + q + "' type='checkbox'>";

        if (produtos[i].codigo.search("lg") == 0) {
          quantidades += " 1 unidade: R$ " + produtos[i].quantidades[q];
        } else {
          quantidades += " " + q + " unidades: R$ " + produtos[i].quantidades[q];
        }

        quantidades += "</label>";
        quantidades += "</ul>";
      }
    }
  }

  quantidades += "</li>";
  quantidades += "</div>";
  inner("qtd" + cod, quantidades);
}

//Função para habilitar ou não o checkbox de parcelas
function incluirValor() {
  if (getE("checkValorTotal").checked) {
    getE("checkParcelar").disabled = false;
  } else {
    getE("checkParcelar").disabled = true;
  }
}

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

//Função para gerar e exibir o texto contendo o orçamento
function gerarOrcamento() {
  inner("erroOrcamento", "");
  inner("textoCopiar", "");

  var cliente = getE("inputCliente").value;
  var incluirValorTotal = getE("checkValorTotal").checked;
  var parcelar = getE("checkParcelar").checked;
  var orcamento = "<b>Orçamento: </b>";
  var valorTotal = 0;

  if (cliente != null && cliente != "") {
    orcamento += "<b>" + cliente + "</b><br/>";
  } else {
    orcamento += "<br/>";
  }

  var produtoValido = false;

  for (var i = 0; i < produtos.length; i++) {
    var checked = getE(produtos[i].codigo) == null ? false : getE(produtos[i].codigo).checked;
    if (checked) {
      orcamento += "<br/><b>" + produtos[i].nome + "</b><br/>";
      orcamento += produtos[i].descricao + "<br/>";
      produtoValido = true;
    }

    var quantidadeValida = false;
    var countQuantidade = 0;

    for (var q in produtos[i].quantidades) {
      var checked = getE(produtos[i].codigo + "" + q) == null ? false : getE(produtos[i].codigo + "" + q).checked;
      if (checked) {
        //caso seja logotipo, que não possui quantidade
        if (produtos[i].codigo.search("lg") == 0) {
          orcamento += "Valor do serviço: R$ " + produtos[i].quantidades[q] + "<br/>";
        } else {
          orcamento += q + " unidades: R$ " + produtos[i].quantidades[q] + "<br/>";
        }
        valorTotal += produtos[i].quantidades[q];
        quantidadeValida = true;
        countQuantidade++;
      } else if (getE(produtos[i].codigo) == null) {
        quantidadeValida = true;
      }
    }

    if (incluirValorTotal && countQuantidade > 1) {
      inner("erroOrcamento", "Não é possível incluir o valor total ao selecionar mais de uma quantidade do mesmo produto!");
      inner("textoOrcamento", "");
      getE("botaoCopiar").setAttribute("disabled", "disabled");
      getE("checkValorTotal").disabled = true;
      getE("checkParcelar").disabled = true;
      return;
    } else {
      getE("checkValorTotal").disabled = false;
      if (getE("checkValorTotal").checked) {
        getE("checkParcelar").disabled = false;
      }
    }

    if (getE(produtos[i].codigo) != null && getE(produtos[i].codigo).checked && !quantidadeValida) {
      inner("erroOrcamento", "Selecione pelo menos uma quantidade para cada produto marcado!");
      inner("textoOrcamento", "");
      return;
    }
  }

  if (!produtoValido) {
    inner("erroOrcamento", "Selecione pelo menos um produto!");
    inner("textoOrcamento", "");
    return;
  }

  if (incluirValorTotal) {
    orcamento += "<br/>" + "<b>Valor total:</b> R$ " + (valorTotal - (valorTotal / 100 * 5)).toFixed(0) + " (à vista, com desconto)";

    if (parcelar) {
      orcamento += " ou 2x de R$ " + (valorTotal / 2).toFixed(0);
    }
    orcamento += "<br/>";
  }

  orcamento += "<br/><i>" + "Arte inclusa.";
  orcamento += "<br/>" + "Orçamento válido por 7 dias.";
  orcamento += "<br/>" + "Entrega em até 10 dias úteis após aprovação da arte.</i>";

  getE("botaoCopiar").removeAttribute("disabled");
  inner("textoAviso", "Aqui está seu orçamento:");
  inner("textoOrcamento", orcamento);

  setS("sessaoHora", new Date().getTime());
}

//Função que copia o conteúdo da div de Orçamento para a área de tranferência
function copiarTexto() {
  str = getE("textoOrcamento").innerHTML;

  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);

  inner("textoCopiar", "O orçamento foi copiado para a área de transferencia! Use \"Ctrl + V\" para colar.");
}

//Função que imprime em PDF o orçamento gerado
function imprimirPDF() {

  //SEM USAR BIBLIOTECA:
  // var divContents = getE("textoOrcamento").innerHTML;
  // var printWindow = window.open('', '', 'height=400,width=800');
  // printWindow.document.write('<html><head><title>DIV Contents</title>');
  // printWindow.document.write('</head><body >');
  // printWindow.document.write(divContents);
  // printWindow.document.write('</body></html>');
  // printWindow.document.close();
  // printWindow.print();

  var printDoc = new jsPDF();
  printDoc.fromHTML(getE('textoOrcamento').innerHTML, 10, 10, {
    'width': 180
  });
  printDoc.autoPrint();
  printDoc.output("dataurlnewwindow");


  // str = getE("textoOrcamento").innerHTML;
  // str = str.replace("<br/>", "\n")
  //
  // var doc = new jsPDF();
  // doc.text(str, 35, 25);
  // doc.save("Artin2 - Orçamento.pdf");
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
