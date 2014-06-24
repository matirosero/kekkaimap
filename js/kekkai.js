//replace map with kekkaiMap
var map; //fuera del contexto de las funciones para que sea siempre accesible
var veces=0;

function initialize() {
	var latlng = new google.maps.LatLng(35.689487, 139.691706);
    var myOptions = {
    	zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP   //MapTypeId.SATELLITE,
    };
    
    //replace map with kekkaiMap
    kekkaiMap = new google.maps.Map(document.getElementById("kekkai-map"), myOptions);

	//evento que se llama cuando los límites del mapa han cambiado
	//replace map with kekkaiMap
	google.maps.event.addListener(kekkaiMap, 'bounds_changed', function() {
		//mapUpdated();
	});
	
	
	$("#test").click(
		function(event){

			event.preventDefault();
			
			$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
				//lo de arriba es un callback function, se pone como ultimo parametro
		
				for (var i=0; i<=data.kekkai.length-1; i=i+1) {
					var name = data.kekkai[i].name;
					var name_japanese = data.kekkai[i].name_japanese;
					var latitude = data.kekkai[i].latitude;
					var longitude = data.kekkai[i].longitude;
					console.log(name+'/'+name_japanese+': '+latitude+', '+longitude);
				}
			});
			
		}
	);
	
}

	$(document).ready(function(){
		
		$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
		//lo de arriba es un callback function, se pone como ultimo parametro
		
			for (var i=0; i<=data.kekkai.length-1; i=i+1) {
				var name = data.kekkai[i].name;
				var name_japanese = data.kekkai[i].name_japanese;
				var latitude = data.kekkai[i].latitude;
				var longitude = data.kekkai[i].longitude;
				console.log(name+'/'+name_japanese+': '+latitude+', '+longitude);
			}
		});
		
	});