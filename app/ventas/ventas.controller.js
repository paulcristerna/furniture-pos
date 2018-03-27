app.controller('ventasController', function($scope, $filter, $http, ventasService, clientesService, articulosService, configuracionService) {
     var articuloVentaRepetido = []
        tasaFinanciamiento = 0;
        plazoMaximo = 0;
        porcentajeEnganche = 0,  
        importe = 0, 
        enganche = 0, 
        bonificacionEnganche = 0, 
        totalAdeudo = 0, 
        precioContado = 0, 
        totalPagar = 0, 
        articuloVenta = [],
        articulosOriginal = [],
        ventaCliente = [],
        ventaRealizada = [],
        idArticulo = [];  
        
    $scope.ventas = [];
    $scope.clientes = [];
    $scope.articulos = [];
    $scope.articulosVenta = [];
    $scope.pasoVenta = 1;

    $scope.ventaFrm = [];
    $scope.ventaFrm.cliente = 0;
    $scope.ventaFrm.articulo = 0;
    $scope.ventaFrm.cantidad = 1;

    $scope.importe = 0;
    $scope.mensajeExito = null;
    $scope.mensajeError = null;
    $scope.mensajeErrorFrm = null;
    
    $scope.enganche = 0;
    $scope.bonificacionEnganche = 0;
    $scope.totalAdeudo = 0;
    $scope.plazoVenta = 3;

    $scope.importeAbono3 = 0;
    $scope.importeAbono6 = 0;
    $scope.importeAbono9 = 0;
    $scope.importeAbono12 = 0;

    $scope.totalPagar3 = 0;
    $scope.totalPagar6 = 0;
    $scope.totalPagar9 = 0;
    $scope.totalPagar12 = 0;

    $scope.importeAhorroAbono3 = 0;
    $scope.importeAhorroAbono6 = 0;
    $scope.importeAhorroAbono9 = 0;
    $scope.importeAhorroAbono12 = 0;
    
    function obtenerVentas(){
        ventasService.obtener()
        .then(function (respuesta){
            $scope.ventas = respuesta.data;
        },function (respuesta){
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }

    function obtenerClientes(){
        clientesService.obtener()
        .then(function (respuesta){
            $scope.clientes = respuesta.data;
        },function (respuesta){
            $scope.mensajeErrorFrm = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }

    function obtenerArticulos(){
        articulosService.obtener()
        .then(function (respuesta){
            $scope.articulos = respuesta.data;
        },function (respuesta){
            $scope.mensajeErrorFrm = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }

    function obtenerConfiguracion(){
        configuracionService.obtener()
        .then(function (respuesta){
            tasaFinanciamiento = respuesta.data[0].tasa_financiamiento;
            plazoMaximo = respuesta.data[0].plazo_maximo;
            porcentajeEnganche = respuesta.data[0].enganche;
        },function (respuesta){
            $scope.mensajeErrorFrm = "Ocurrio un error, favor de volverlo a intentar.";
        });
    }

    $scope.prepararEliminarArticulo = function(index) {
        $scope.el = index;
    }

    $scope.vaciarVenta = function() {
        $scope.reniniciarValores();
        obtenerClientes();
        obtenerArticulos();
        obtenerConfiguracion();
    }

    $scope.eliminarArticulo = function() {
        $scope.articulosVenta.splice([$scope.el], 1);

        $('#confirmarEliminarArticuloModal').modal('toggle');
    }

    var calcularImporte = function(articulos) {
        importe = 0;

        angular.forEach(articulos, function(value, key) {
            importe += value.cantidad * value.precio;
        });

        return importe;
    }

    var calcularEnganche = function(porcentajeEnganche, importe) {
        return (porcentajeEnganche / 100) * importe;
    }

    var calcularBonificacionEnganche = function(enganche, tasaFinanciamiento, plazoMaximo) {
        return enganche * ((tasaFinanciamiento * plazoMaximo) / 100);
    }

    var calcularSubTotales = function() {
        importe = calcularImporte($scope.articulosVenta);
        enganche = calcularEnganche(porcentajeEnganche, importe);
        bonificacionEnganche = calcularBonificacionEnganche(enganche, tasaFinanciamiento, plazoMaximo);
        totalAdeudo = importe - enganche - bonificacionEnganche;

        $scope.enganche = enganche;
        $scope.bonificacionEnganche = bonificacionEnganche;
        $scope.totalAdeudo = totalAdeudo;
    }

    $scope.agregarArticulo = function() {

        if($scope.ventaFrm.articulo > 0) {
            if($scope.ventaFrm.cantidad > 0) {

                idArticulo = $scope.ventaFrm.articulo; 
                articuloVentaRepetido = $filter('filter')($scope.articulosVenta, function (d) {return d.id == idArticulo})[0];

                if(articuloVentaRepetido) {
                
                    $scope.mensajeErrorFrm = "El artículo ya esta agregado, favor de verificar.";
                
                } else {
                    articuloVenta = [];
                    articulosOriginal = [];

                    angular.copy($scope.articulos, articulosOriginal);

                    articuloVenta = $filter('filter')(articulosOriginal, function (d) {return d.id == idArticulo})[0];

                    if(articuloVenta.existencia > 0) {
                        if(articuloVenta.existencia >= $scope.ventaFrm.cantidad) {

                            articuloVenta.cantidad = parseFloat($scope.ventaFrm.cantidad); 
                            articuloVenta.precio = articuloVenta.precio * (1 + (tasaFinanciamiento * plazoMaximo) / 100);

                            $scope.ventaFrm.articulo = 0;
                            $scope.ventaFrm.cantidad = 1;

                            $scope.articulosVenta.push(articuloVenta);

                            calcularSubTotales();

                        } else {
                            $scope.mensajeErrorFrm = "El artículo seleccionado no cuenta con existencia suficiente, favor de verificar.";
                        }
                    } else {
                        $scope.mensajeErrorFrm = "El artículo seleccionado no cuenta con existencia, favor de verificar.";
                    }
                }
            
            } else {
                $scope.mensajeErrorFrm = "La cantidad debe ser mayor a cero, favor de verificar.";
            }
        } else {
            $scope.mensajeErrorFrm = "No hay un articulo seleccionado, favor de verificar.";
        }
    }

    var calcularPrecioContado = function() {
        return totalAdeudo / (1 + ((tasaFinanciamiento * plazoMaximo) / 100));        
    }

    var calcularTotalPagar = function(plazo) {
        precioContado = calcularPrecioContado();
        totalPagar = precioContado * (1 + (tasaFinanciamiento * plazo) / 100);        

        return (totalPagar).toFixed(2);
    }

    var calcularAbonos = function(plazo) {
        precioContado = calcularPrecioContado();
        totalPagar = calcularTotalPagar(plazo);

        return (totalPagar / plazo).toFixed(2);
    }

    var calcularImporteAhorro = function(plazo) {
        precioContado = totalAdeudo / (1 + ((tasaFinanciamiento * plazoMaximo) / 100));
        totalPagar = precioContado * (1 + (tasaFinanciamiento * plazo) / 100);        

        return (totalAdeudo - totalPagar).toFixed(2);
    }

    $scope.siguientePasoVenta = function() {
        $scope.pasoVenta = 2;

        calcularSubTotales();

        $scope.importeAbono3 = calcularAbonos(3);
        $scope.importeAbono6 = calcularAbonos(6);
        $scope.importeAbono9 = calcularAbonos(9);
        $scope.importeAbono12 = calcularAbonos(12);

        $scope.totalPagar3 = calcularTotalPagar(3);
        $scope.totalPagar6 = calcularTotalPagar(6);
        $scope.totalPagar9 = calcularTotalPagar(9);
        $scope.totalPagar12 = calcularTotalPagar(12);

        $scope.importeAhorroAbono3 = calcularImporteAhorro(3);
        $scope.importeAhorroAbono6 = calcularImporteAhorro(6);
        $scope.importeAhorroAbono9 = calcularImporteAhorro(9);
        $scope.importeAhorroAbono12 = calcularImporteAhorro(12);
    }

    $scope.atrasPasoVenta = function() {
        $scope.pasoVenta = 1;
    }

    $scope.seleccionarPlazo = function(plazo) {
        $scope.plazoVenta = plazo;
    }

    $scope.guardarVenta = function() {

        totalPagarFinal = calcularTotalPagar($scope.plazoVenta);

        ventaCliente = $filter('filter')($scope.clientes, function (d) {return d.id == $scope.ventaFrm.cliente})[0];

        ventaRealizada = 
        {
            folio: Math.floor(Math.random()*90000) + 10000,
            cliente: ventaCliente.id,
            total: totalPagarFinal,
            status: '1',
        };

        ventasService.guardar(ventaRealizada)
        .then(function (respuesa) {
            $scope.reniniciarValores();
            obtenerVentas();    

            $scope.mensajeExito = "Bien Hecho, Tu venta ha sido registrada correctamente.";

            $('#agregarVentaModal').modal('toggle');
        }, function (respuesa) {
            $scope.mensajeError = "Ocurrio un error, favor de volverlo a intentar.";
        });    
    }

    $scope.reniniciarValores = function() {

        articuloVentaRepetido = []
        importe = 0;
        enganche = 0;
        bonificacionEnganche = 0;
        totalAdeudo = 0;
        precioContado = 0;
        totalPagar = 0;
        articuloVenta = [];
        rticulosOriginal = [],
        idArticulo = [];        

        $scope.articulosVenta = [];
        
        $scope.ventaFrm = [];
        $scope.ventaFrm.cliente = 0;
        $scope.ventaFrm.articulo = 0;
        $scope.ventaFrm.cantidad = 1;
        $scope.pasoVenta = 1;

        $scope.importe = 0;
        $scope.mensajeExito = null;
        $scope.mensajeError = null;
        $scope.mensajeErrorFrm = null;

        $scope.enganche = 0;
        $scope.bonificacionEnganche = 0;
        $scope.totalAdeudo = 0;
        $scope.plazoVenta = 3;

        $scope.importeAbono3 = 0;
        $scope.importeAbono6 = 0;
        $scope.importeAbono9 = 0;
        $scope.importeAbono12 = 0;

        $scope.totalPagar3 = 0;
        $scope.totalPagar6 = 0;
        $scope.totalPagar9 = 0;
        $scope.totalPagar12 = 0;

        $scope.importeAhorroAbono3 = 0;
        $scope.importeAhorroAbono6 = 0;
        $scope.importeAhorroAbono9 = 0;
        $scope.importeAhorroAbono12 = 0;
    }

    $('body').on('change', '.target', function() {
        calcularSubTotales();
    });

    $scope.cancelarVenta = function() {
        $scope.reniniciarValores();
        $('#agregarVentaModal').modal('toggle');
    }

    obtenerVentas();    

});