app.controller('clientesController', function($scope, $http, clientesService) {

    $scope.clientes = [];
    $scope.clienteFrm = [];
    mensajeExito = null;
    mensajeError = null;

    function obtenerClientes(respuesta){
        clientesService.obtener()
        .then(function (respuesta){
            $scope.clientes = respuesta.data;
        },function (respuesta){
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }
    
    $scope.vaciarCliente = function() {
        $scope.accion = 1;
        $scope.clienteFrm = [];
    }

    $scope.llenarCliente = function(clientes) {
        $scope.accion = 2;
        $scope.clienteFrm = [];
        
        $scope.clienteFrm = {
            id: clientes.id,
            clave: clientes.clave,
            nombre: clientes.nombre,
        }
    }

    $scope.agregarCliente = function(clientes){
        clientesService.guardar(clientes)
        .then(function (respuesta){
            obtenerClientes();
            $scope.mensajeExito = "Bien Hecho, el clientes ha sido registrado correctamente.";
            $('#clienteModal').modal('toggle');
        },function (respuesta){
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }

    $scope.editarCliente = function(clientes){
        clientesService.editar(clientes.id, clientes)
        .then(function (respuesta) {
            obtenerClientes();
            $scope.mensajeExito = "Bien Hecho, el clientes ha sido editado correctamente.";
            $('#clienteModal').modal('toggle');
        }, function (respuesta) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });    
    }

    $scope.eliminarCliente = function() {
        clientesService.eliminar($scope.clienteFrm.id)
        .then(function (respuesta) {
            obtenerClientes();
            $scope.mensajeExito = "Bien Hecho, el cliente ha sido eliminado correctamente.";
            $('#confirmacionModal').modal('toggle');
        }, function (respuesta) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });   
    }

    obtenerClientes();

});