<?php
require '../../Slim/Slim.php';
require '../../connector.php';
\Slim\Slim::registerAutoloader();

$app=new \Slim\Slim();
$app->config('debug', false);
$app->response()->header('Content-Type', 'application/json;charset=utf-8');
$app->get('/cliente','obtener');
$app->post('/cliente','guardar');
$app->put('/cliente/:id','editar');
$app->delete('/cliente/:id','eliminar');

function obtener() {
    $sql ="SELECT id, clave, nombre FROM clientes"; 
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
    $sql = "INSERT INTO clientes (clave, nombre) VALUES (:clave, :nombre);";   
    
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("clave",   $data->clave);
        $stmt->bindParam("nombre", $data->nombre);
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

function eliminar($id) {
    $sql = "DELETE FROM clientes WHERE id = ".$id;   
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

function editar($id){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $sql = "UPDATE clientes SET clave = :clave, nombre = :nombre WHERE id = ".$id;   
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("clave",   $data->clave);
        $stmt->bindParam("nombre", $data->nombre);
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

$app->run();
?>