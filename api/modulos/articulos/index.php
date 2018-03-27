<?php
require '../../Slim/Slim.php';
require '../../connector.php';
\Slim\Slim::registerAutoloader();

$app=new \Slim\Slim();
$app->config('debug', false);
$app->response()->header('Content-Type', 'application/json;charset=utf-8');
$app->get('/articulo','obtener');
$app->post('/articulo','guardar');
$app->put('/articulo/:id','editar');
$app->delete('/articulo/:id','eliminar');

function obtener() {
    $sql ="SELECT id, descripcion, modelo, precio, existencia FROM articulos"; 
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
    $sql = "INSERT INTO articulos (descripcion, modelo, precio, existencia) VALUES (:descripcion, :modelo, :precio, :existencia);";   
    
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("descripcion",   $data->descripcion);
        $stmt->bindParam("modelo", $data->modelo);
        $stmt->bindParam("precio", $data->precio);
        $stmt->bindParam("existencia", $data->existencia);
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

function eliminar($id) {
    $sql = "DELETE FROM articulos WHERE id = ".$id;   
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
    $sql = "UPDATE articulos SET descripcion = :descripcion, modelo = :modelo, precio = :precio, existencia = :existencia WHERE id = ".$id;   
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->bindParam("descripcion",   $data->descripcion);
        $stmt->bindParam("modelo", $data->modelo);
        $stmt->bindParam("precio", $data->precio);
        $stmt->bindParam("existencia", $data->existencia);
        $stmt->execute();
        $db = null;     
    } catch(PDOException $e) {
        echo $e->getMessage(); 
    }
}

$app->run();
?>