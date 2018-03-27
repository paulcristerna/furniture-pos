app.factory('articulosService', function($http) {
    var rootURL = "api/modulos/articulos/articulo";

    function formToJSON(articulo) {
        return JSON.stringify({
            "descripcion": articulo.descripcion,
            "modelo": articulo.modelo,
            "precio": articulo.precio,
            "existencia": articulo.existencia
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