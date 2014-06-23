var map; //fuera del contexto de las funciones para que sea siempre accesible
var veces=0;

function initialize() {
	var latlng = new google.maps.LatLng(35.689487, 139.691706);
    var myOptions = {
    	zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP   //MapTypeId.SATELLITE,
    };
    map = new google.maps.Map(document.getElementById("kekkai-map"), myOptions);

	//evento que se llama cuando los límites del mapa han cambiado
	google.maps.event.addListener(map, 'bounds_changed', function() {
		mapUpdated();
	});
}