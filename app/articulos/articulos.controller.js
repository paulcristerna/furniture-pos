app.controller('articulosController', function($scope, $http, articulosService) {

    $scope.articulos = [];
    $scope.articuloFrm = [];
    mensajeExito = null;
    mensajeError = null;

    function obtenerArticulos(){
        articulosService.obtener()
        .then(function (respuesta){
            $scope.articulos = respuesta.data;
        },function (respuesta){
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }
    
    $scope.vaciarArticulo = function() {
        $scope.accion = 1;
        $scope.articuloFrm = [];
    }

    $scope.llenarArticulo = function(articulo) {
        $scope.accion = 2;
        $scope.articuloFrm = [];
        
        $scope.articuloFrm = {
            id: articulo.id,
            descripcion: articulo.descripcion,
            modelo: articulo.modelo,
            existencia: parseInt(articulo.existencia),
            precio: parseFloat(articulo.precio),
        }
    }

    $scope.agregarArticulo = function(articulo){
        articulosService.guardar(articulo)
        .then(function (respuesta) {
            obtenerArticulos();
            $scope.mensajeExito = "Bien Hecho, el articulo ha sido registrado correctamente.";
            $('#articuloModal').modal('toggle');
        }, function (respuesta) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });    
    }

    $scope.editarArticulo = function(articulo){
        articulosService.editar(articulo.id, articulo)
        .then(function (respuesta) {
            obtenerArticulos();
            $scope.mensajeExito = "Bien Hecho, el articulo ha sido editado correctamente.";
            $('#articuloModal').modal('toggle');
        }, function (respuesta) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });    
    }

    $scope.eliminarArticulo = function() {
        articulosService.eliminar($scope.articuloFrm.id)
        .then(function (respuesta) {
            obtenerArticulos();
            $scope.mensajeExito = "Bien Hecho, el articulo ha sido eliminado correctamente.";
            $('#confirmacionModal').modal('toggle');
        }, function (respuesta) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });   
    }

    obtenerArticulos();

});