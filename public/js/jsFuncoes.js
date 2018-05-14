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

//Função que inicializa o Firebase
function iniciarFirebase() {
  var config = {
    apiKey: "AIzaSyD1-8xokGF4FSAutzWPVfP7A0WpEIlpDlY",
    authDomain: "artin2-2588c.firebaseapp.com",
    databaseURL: "https://artin2-2588c.firebaseio.com",
    projectId: "artin2-2588c",
    storageBucket: "",
    messagingSenderId: "612172412134"
  };
  firebase.initializeApp(config);
}

//FUNÇÕES DO FIREBASE:
//Salvar
function firebaseInsert(tabela, id, objeto, tipo) {
  tipo = tipo || null;

  firebase.database().ref(tabela + "/dados/" + id).set(objeto);
  id++;
  firebase.database().ref(tabela + "/info/seq").set(id);

  //incrementa sequenciais de controle, se houverem
  if(tipo != null){
    tipo.sequencial++;
    firebase.database().ref(tabela + "/info/seq" + tipo.codigo).set(tipo.sequencial);
  }
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
