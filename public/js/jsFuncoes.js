//Funções para simplificar o uso do LocalStorage
function setS(chave, valor) {
  localStorage.setItem(chave, valor);
}

function getS(chave) {
  return localStorage.getItem(chave);
}

function clrS() {
  localStorage.clear();
}

//Funções para simplificar o uso do getElementById
function getE(id) {
  return document.getElementById(id);
}

function inner(id, conteudo) {
  document.getElementById(id).innerHTML = conteudo;
}

//Função para simplificar o uso do "location.replace"
function nav(endereco) {
  location.replace("./" + endereco + ".html");
}


//Busca e retorna os objetos no arquivo Json
// function buscarJson(json) {
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       json = JSON.parse(this.responseText);
//     }
//   };
//   xmlhttp.open("GET", "./json/" + json + ".json", true);
//   xmlhttp.send();
// }


//Verifica todos os campso do objeto para evitar erros com atributos "undefined"
// function verificaCampos(a) {
//   for (var i = 0; i < a.length; i++) {
//     for(var c in a[i]){
//
//       //if(typeof(a[i][c]) == "undefined")
//         alert(typeof(a[i][c]) + " - " + a[i][c]);
//
//     }
//
    // a[i].nome = v(a[i].nome);
    // a[i].idade = v(a[i].idade);
    // a[i].email = v(a[i].email);
    // a[i].login = v(a[i].login);
    // a[i].senha = v(a[i].senha);
    // a[i].campo = v(a[i].campo);
//   }
//   return a;
// }
//
// //Seta como "" campos que estejam como "undefined"
// function v(a) {
//   if (typeof(a) == "undefined") {
//     return "";
//   } else {
//     return a;
//   }
// }
