app.factory('ventasService', function($http) {
    var rootURL = "api/modulos/ventas/venta";

    function formToJSON(venta) {
        return JSON.stringify({
            "folio": venta.folio,
            "cliente": venta.cliente,
            "total": venta.total,
            "status": venta.status,
        });
    }
    
    return {
        obtener: function() {
            return $http.get(rootURL);
        },
        guardar: function(cliente) {
            return $http.post(rootURL, formToJSON(cliente));
        },
    };
});