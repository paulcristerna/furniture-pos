<?php
require '../../Slim/Slim.php';
require '../../connector.php';
\Slim\Slim::registerAutoloader();

$app=new \Slim\Slim();
$app->config('debug', false);
$app->response()->header('Content-Type', 'application/json;charset=utf-8');
$app->get('/configuracion','obtener');
$app->put('/configuracion/:id','editar');

function obtener() {
    $sql ="SELECT id, tasa_financiamiento, enganche, plazo_maximo FROM configuracion"; 
    try {
        $db = getConnection();
        $stmt = $db->query($sql);  
        $data = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($data);
    } catch(PDOException $e) {
        echo json_encode($e->getMessage()); 
    }
}

function editar($id){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $sql = "UPDATE configuracion SET tasa_financiamiento = :tasa_financiamiento, enganche = :enganche, plazo_maximo = :plazo_maximo WHERE id = ".$id;   
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("tasa_financiamiento",   $data->tasa_financiamiento);
        $stmt->bindParam("enganche", $data->enganche);
        $stmt->bindParam("plazo_maximo", $data->plazo_maximo);
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

$app->run();
?>