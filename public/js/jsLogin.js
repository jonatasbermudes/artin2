//Declaração de variáveis globais
var usuarios;
var seq;

//Busca dados do Json no carregamento da página
window.onload = function() {
  rotinaSessao();
  iniciarFirebase();
  buscarUsuarios();
}

//Rotina necessária para avaliar se a sessão do usuário ainda está ativa (menos de 10 minutos de inatividade)
function rotinaSessao() {
  if (getS("sessaoAberta") == "S") {
    if (new Date().getTime() - getS("sessaoHora") <= 600000) {
      setS("sessaoHora", new Date().getTime());
      nav("principal");
    } else {
      clrS();
      setS("sessaoAberta", "N");
      nav("index");
    }
  } else if (getS("sessaoAberta") == "N") {
    inner("erroSessao", "A sessão expirou. Faça login novamente!");
    clrS();
  } else {
    clrS();
    //location.replace("./index.html"); //redirecionar para pagina principal! (usar nas páginas internas)
  }
}

//Validação dos dados informados na tela de login
function validarLogin() {
  limparErros();

  var user = document.getElementById("inputUsuario").value;
  var pass = document.getElementById("inputSenha").value;

  if (user == "") {
    inner("erroUsuario", "Digite aqui seu nome de usuário!");
    return;
  } else {
    var userExiste = false;
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].login == user) {
        setS("sessaoCodigoUsuario", i);
        userExiste = true;
        break;
      }
    }
    if (!userExiste) {
      inner("erroUsuario", "O usuário informado não existe!");
      return;
    }
  }

  if (pass == "") {
    inner("erroSenha", "Digite aqui sua senha!");
    return;
  } else {
    if (usuarios[getS("sessaoCodigoUsuario")].senha == pass) {
      getE("botaoEntrar").className += " is-loading";
      setS("sessaoNomeUsuario", usuarios[getS("sessaoCodigoUsuario")].nome);
      setS("sessaoAberta", "S");
      setS("sessaoHora", new Date().getTime());
      nav("principal");
    } else {
      inner("erroSenha", "A senha está incorreta!");
    }
  }
}

//Função para limpar todos os erros exibidos na tela
function limparErros() {
  inner("erroSessao", "");
  inner("erroUsuario", "");
  inner("erroSenha", "");
}

//Busca e retorna os objetos no Firebase
function buscarUsuarios() {
  var ref = firebase.database().ref("usuarios").on('value', function(snapshot) {
    usuarios = snapshot.val().dados;
    seq = snapshot.val().info.seq; //retorna o valor da ultima chave
  });
}

//Busca e retorna os objetos no arquivo Json
// function buscarUsuarios() {
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       usuarios = JSON.parse(this.responseText);
//     }
//   };
//   xmlhttp.open("GET", "./json/usuarios.json", true);
//   xmlhttp.send();
// }
