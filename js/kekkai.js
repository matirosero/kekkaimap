//replace map with kekkaiMap
var map; //fuera del contexto de las funciones para que sea siempre accesible
var veces=0;

function initialize() {

var style_kekkai = [
  {
	  "featureType": "administrative",
	  "stylers": [
	  	{ "visibility": "on" }
 ]
 },
  {
    "featureType": "transit",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },
  {
    "featureType": "poi.park",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      { "visibility": "simplified" }
    ]
  }
];
//Then we use this data to create the styles.
var styled_kekkai = new google.maps.StyledMapType(style_kekkai, {name: "kekkai style"});

	var latlng = new google.maps.LatLng(35.689487, 139.691706);
    var myOptions = {
    	zoom: 12,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP   //MapTypeId.SATELLITE,
    };
    
    //replace map with kekkaiMap
    kekkaiMap = new google.maps.Map(document.getElementById("kekkai-map"), myOptions);
    kekkaiMap.mapTypes.set('map_styles_kekkai', styled_kekkai);
	kekkaiMap.setMapTypeId('map_styles_kekkai');

	//evento que se llama cuando los límites del mapa han cambiado
	//replace map with kekkaiMap
	google.maps.event.addListener(kekkaiMap, 'bounds_changed', function() {
		//mapUpdated();
	});
	
	
	//TODO: markers
	/*
	createMarker(kekkaiMap,new google.maps.LatLng(35.707522,139.664684),'dragon.png','hola');
	
	$("#test").click(
		function(event){

			event.preventDefault();
			*/
			$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
				//lo de arriba es un callback function, se pone como ultimo parametro
		
				for (var i=0; i<=data.kekkai.length-1; i=i+1) {
					var name = data.kekkai[i].name;
					var name_japanese = data.kekkai[i].name_japanese;
					var latitude = data.kekkai[i].latitude;
					var longitude = data.kekkai[i].longitude;
					console.log(name+'/'+name_japanese+': '+latitude+', '+longitude);
					
					if (name == 'Ebisu Garden Place') {
						var marker='frog.png';
					} else {
						var marker='blue-dragon.png';
					}
					
					
					var html=name;
					

					createMarker(kekkaiMap,new google.maps.LatLng(
						latitude,
						longitude),
						marker,
						html);
					
				}
			});
	/*		
		}
	);*/
	
}

//crea un marker con una burbuja de texto, y una imagen personalizada
function createMarker(map,point,image,txt) {
	console.log('NOW:');

	var marker = new google.maps.Marker({
		position: point,
		map: map,
		icon: image
	});



	var infowindow = new google.maps.InfoWindow({
	content: txt
	});
	google.maps.event.addListener(marker, 'click', function() {

	  infowindow.open(map,marker);

	});


	return marker;
}
/*
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
*/