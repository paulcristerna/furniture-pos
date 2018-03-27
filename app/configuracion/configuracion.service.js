app.factory('configuracionService', function($http) {
    var rootURL = "api/modulos/configuracion/configuracion";

    function formToJSON(configuracion) {
        return JSON.stringify({
            "tasa_financiamiento": configuracion.tasaFinanciamiento,
            "enganche": configuracion.enganche,
            "plazo_maximo": configuracion.plazoMaximo,
        });
    }
    
    return {
        obtener: function() {
            return $http.get(rootURL);
        },
        editar: function(id, cliente) {
            return $http.put(rootURL+'/'+id, formToJSON(cliente));
        },
    };
});