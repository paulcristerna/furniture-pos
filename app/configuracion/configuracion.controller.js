app.controller('configuracionController', function($scope, $http, configuracionService) {

    $scope.configuracionFrm = [];
    mensajeExito = null;
    mensajeError = null;

    var obtener = function() {
        configuracionService.obtener()
        .then(function (respuesta){
            $scope.configuracionFrm = 
            {
                id: respuesta.data[0].id,
                tasaFinanciamiento: parseFloat(respuesta.data[0].tasa_financiamiento),
                enganche: parseFloat(respuesta.data[0].enganche),
                plazoMaximo: parseFloat(respuesta.data[0].plazo_maximo),
            };
        },function (respuesta){
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }
    
    $scope.guardar = function(configuracion){
        console.log(configuracion);
        configuracionService.editar(configuracion.id, configuracion)
        .then(function (respuesta) {
            $scope.mensajeExito = "Bien Hecho, el configuracion ha sido registrada correctamente.";
        }, function (respuesta) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }

    $scope.cancelar = function() {
        obtener();
    }

    obtener();

});