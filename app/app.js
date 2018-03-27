var app = angular.module("vendimiaApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/ventas", {
        templateUrl : "app/ventas/ventas.html",
        controller: "ventasController"
    })
    .when("/articulos", {
        templateUrl : "app/articulos/articulos.html",
        controller: "articulosController"
    })
    .when("/clientes", {
        templateUrl : "app/clientes/clientes.html",
        controller: "clientesController"
    })
    .when("/configuracion", {
        templateUrl : "app/configuracion/configuracion.html",
        controller: "configuracionController"
    })
    .otherwise({
        templateUrl : "app/ventas/ventas.html",
        controller: "ventasController"
    });
});