//Declaração de variáveis globais
var produtos;
var info;

//Busca dados do Json no carregamento da página
window.onload = function() {
  rotinaSessao();
  rotinaLayout();
  iniciarFirebase();
  buscarProdutos();
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

//Função para salvar o produto no banco
function cadastrarProduto() {
  limparErros();

  var nome = getE("inputNomeProduto").value;
  var codigo = getE("inputTipoProduto").value;
  var descricao = getE("inputDescricaoProduto").value;

  var qtd1 = getE("inputQuantidade1").value;
  var qtd2 = getE("inputQuantidade2").value;
  var qtd3 = getE("inputQuantidade3").value;
  var qtd4 = getE("inputQuantidade4").value;
  var qtd5 = getE("inputQuantidade5").value;

  var vlr1 = getE("inputValor1").value;
  var vlr2 = getE("inputValor2").value;
  var vlr3 = getE("inputValor3").value;
  var vlr4 = getE("inputValor4").value;
  var vlr5 = getE("inputValor5").value;

  //fazer validações para saber se já existe produtos com os mesmos dados!!
  if (codigo == "") {
    inner("erroTipoProduto", "Informe o tipo do produto!");
    return;
  }

  if (nome == "") {
    inner("erroNomeProduto", "Informe um nome para o produto!");
    return;
  }

  if (descricao == "") {
    inner("erroDescricaoProduto", "Informe uma descrição para o produto!");
    return;
  }

  if ((qtd1 == "" && vlr1 == "") && (qtd2 == "" && vlr2 == "") && (qtd3 == "" && vlr3 == "") && (qtd4 == "" && vlr4 == "") && (qtd5 == "" && vlr5 == "")) {
    inner("erroQuantidade", "Informe ao menos uma quantidade/valor para o produto!");
    return;
  } else if ((qtd1 != "" && vlr1 == "") || (qtd2 != "" && vlr2 == "") || (qtd3 != "" && vlr3 == "") || (qtd4 != "" && vlr4 == "") || (qtd5 != "" && vlr5 == "")) {
    inner("erroQuantidade", "Informe o valor do produto para cada quantidade informada!");
    return;
  } else if ((qtd1 == "" && vlr1 != "") || (qtd2 == "" && vlr2 != "") || (qtd3 == "" && vlr3 != "") || (qtd4 == "" && vlr4 != "") || (qtd5 == "" && vlr5 != "")) {
    inner("erroQuantidade", "Informe a quantidade do produto para cada valor informado!");
    return;
  }

  var codigoTipo = codigo;

  if (codigo == "cv") {
    codigo += info.seqcv;
    sequencialTipo = info.seqcv;
  } else if (codigo == "pf") {
    codigo += info.seqpf;
    sequencialTipo = info.seqpf;
  } else if (codigo == "lg") {
    codigo += info.seqlg;
    sequencialTipo = info.seqlg;
  }

  var qtds = [qtd1, qtd2, qtd3, qtd4, qtd5];
  var vlrs = [vlr1, vlr2, vlr3, vlr4, vlr5];

  var quantidade = "{";

  for (var i = 0; i < 5; i++) {
    if (qtds[i] != "") {
      quantidade += "\"" + qtds[i] + "\":" + vlrs[i];
      if (qtds[i + 1] != "" && i != 4) {
        quantidade += ",";
      }
    }
  }

  quantidade += "}";

  try {
    quantidade = JSON.parse(quantidade);
  } catch (erro) {
    inner("erroQuantidade", "Não deixe campos vazios entre as diferentes quantidades/valores!");
    return;
  }

  var produto = {
    nome: nome,
    codigo: codigo,
    descricao: descricao,
    quantidades: quantidade
  };

  var tipo = {
    codigo: codigoTipo,
    sequencial: sequencialTipo
  };

  firebaseInsert('produtos', info.seq, produto, tipo);
  getE("erroCadastro").className = "has-text-success";
  inner("erroCadastro", "Produto cadastrado com sucesso!");
}

function limparErros() {
  inner("erroCadastro", "");
  inner("erroNomeProduto", "");
  inner("erroTipoProduto", "");
  inner("erroDescricaoProduto", "");
  inner("erroQuantidade", "");
}

//Busca e retorna os objetos no Firebase
function buscarProdutos() {
  var ref = firebase.database().ref("produtos").on('value', function(snapshot) {
    produtos = snapshot.val().dados;
    info = snapshot.val().info; //retorna informações da tabela
  });
}
