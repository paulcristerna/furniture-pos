app.factory('clientesService', function($http) {
    var rootURL = "api/modulos/clientes/cliente";

    function formToJSON(cliente) {
        return JSON.stringify({
            "clave": cliente.clave,
            "nombre": cliente.nombre,
        });
    }
    
    return {
        obtener: function() {
            return $http.get(rootURL);
        },
        guardar: function(cliente) {
            return $http.post(rootURL, formToJSON(cliente));
        },
        editar: function(id, cliente) {
            return $http.put(rootURL+'/'+id, formToJSON(cliente));
        },
        eliminar: function(id) {
            return $http.delete(rootURL+'/'+id);
        },
    };
});