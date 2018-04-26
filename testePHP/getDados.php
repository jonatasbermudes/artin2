<?php
    //Conectando ao banco de dados
    $con = new mysqli("localhost", "id5466868_artin2", "artin2", "id5466868_artin2");
    if (mysqli_connect_errno()) trigger_error(mysqli_connect_error());

   //  $id = $_POST["id"];
   // $nome = $_POST["nome"];
   // $login = $_POST["login"];
   // $senha = $_POST["senha"];
   //
   // mysqli_query($con, "INSERT INTO usuario VALUES (null, '".$nome"', '".$login"', '".$senha"')");

    //Consultando banco de dados
    $qryLista = mysqli_query($con, "SELECT * FROM usuario");
    while($resultado = mysqli_fetch_assoc($qryLista)){
        $vetor[] = array_map('utf8_encode', $resultado);
    }

    //Passando vetor em forma de json
    echo json_encode($vetor);

?>
