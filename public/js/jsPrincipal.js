//Declaração de variáveis globais

//Busca dados do Json no carregamento da página
window.onload = function() {
  rotinaSessao();
  rotinaLayout();
  //buscarUsuarios();
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
  inner("textoSaudacao", "Olá, " + getS("sessaoNomeUsuario") + ".");
}

//Apaga os dados da sessão e volta para a tela de login
function sair() {
  clrS();
  nav("index");
}

//Busca e retorna os objetos no arquivo Json
// function buscarUsuarios() {
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       usuarios = verificaCampos(JSON.parse(this.responseText));
//     }
//   };
//   xmlhttp.open("GET", "./json/usuarios.json", true);
//   xmlhttp.send();
// }
