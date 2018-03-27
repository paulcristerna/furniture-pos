<?php
require '../../Slim/Slim.php';
require '../../connector.php';
\Slim\Slim::registerAutoloader();

$app=new \Slim\Slim();
$app->config('debug', false);
$app->response()->header('Content-Type', 'application/json;charset=utf-8');
$app->get('/venta','obtener');
$app->post('/venta','guardar');

function obtener() {
    $sql ="SELECT v.id, v.folio, c.clave, c.nombre, v.total, v.fecha, status 
            FROM ventas v
            INNER JOIN clientes c ON c.id = v.cliente;"; 
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

function guardar(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $sql = "INSERT INTO ventas (folio, cliente, total, status) 
            VALUES (:folio, :cliente, :total, :status);";   
    
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("folio", $data->folio);
        $stmt->bindParam("cliente", $data->cliente);
        $stmt->bindParam("total", $data->total);
        $stmt->bindParam("status", $data->status);
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

$app->run();
?>