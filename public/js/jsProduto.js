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
  var quantidade = getE("inputQuantidades").value;

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

  if (quantidade == "") {
    inner("erroQuantidade", "Informe ao menos uma quantidade/valor para o produto!");
    return;
  }

  var cod = codigo;

  if (codigo == "cv") {
    codigo += info.seqcv;
    seq = info.seqcv;
  } else if (codigo == "pf") {
    codigo += info.seqpf;
    seq = info.seqpf;
  } else if (codigo == "lg") {
    codigo += info.seqlg;
    seq = info.seqlg;
  }

  //quantidade = JSON.parse("{" + quantidade + "}");

  var produto = {
    nome: nome,
    codigo: codigo,
    descricao: descricao,
    quantidades: quantidade
  };

  var params = {
    codigo: cod,
    seq: seq
  };

  firebaseInsert('produtos', info.seq, produto, params);
  getE("erroCadastro").className = "has-text-success";
  inner("erroCadastro", "Produto cadastrado com sucesso!");
}

function limparErros() {
  inner("erroCadastro", "");
  inner("erroNomeProduto", "");
  inner("erroTipoProduto", "");
  inner("erroDescricaoProduto", "");
}

//Busca e retorna os objetos no Firebase
function buscarProdutos() {
  var ref = firebase.database().ref("produtos").on('value', function(snapshot) {
    produtos = snapshot.val().dados;
    info = snapshot.val().info; //retorna informações da tabela
  });
}
