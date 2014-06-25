//replace map with kekkaiMap
var map; //fuera del contexto de las funciones para que sea siempre accesible
var veces=0;




function initialize() {

	//style
	var style_kekkai = [
		{
			"featureType": "administrative",
			"stylers": [
				{ "visibility": "on" }
			]
		},{
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
		},{
			"featureType": "poi.park",
			"stylers": [
				{ "visibility": "simplified" }
			]
		},{
			"featureType": "landscape",
			"stylers": [
				{ "visibility": "simplified" }
			]
		}
	];
	//Then we use this data to create the styles.
	var styled_kekkai = new google.maps.StyledMapType(style_kekkai, { name: "kekkai style" });

	//Tokyo location
	var latlng = new google.maps.LatLng(35.689487, 139.691706);
    
    var myOptions = {
    	zoom: 12,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP   //MapTypeId.SATELLITE,
    };
    
    //replace map with kekkaiMap
    kekkaiMap = new google.maps.Map(document.getElementById("kekkai-map"), myOptions);
    
    //Add style
    kekkaiMap.mapTypes.set('map_styles_kekkai', styled_kekkai);
	kekkaiMap.setMapTypeId('map_styles_kekkai');

	//evento que se llama cuando los límites del mapa han cambiado
	//replace map with kekkaiMap
	google.maps.event.addListener(kekkaiMap, 'bounds_changed', function() {
		//mapUpdated();
	});
	
	

	$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
				//lo de arriba es un callback function, se pone como ultimo parametro
		
		for (var i in data.kekkai) {
			
			if (data.kekkai[i].manga_is_kekkai == 'Yes') {
				
				var name = data.kekkai[i].name;
				var name_japanese = data.kekkai[i].name_japanese;
				var name_romanji = data.kekkai[i].name_romanji;
				var latitude = data.kekkai[i].latitude;
				var longitude = data.kekkai[i].longitude;
				var manga_destroyed = data.kekkai[i].manga_destroyed;
				var manga_attacked_by = data.kekkai[i].manga_attacked_by;
				var information = data.kekkai[i].information;
				
				var html='<h2>'+name+'</h2>\
					<4>'+name_japanese+'</h4>';
				
				if (manga_destroyed == 'Yes') {
					var attacked = 'and destroyed ';
					console.log(name+' was destroyed!');
				} else {
					var attacked = 'but not destroyed ';
					console.log(name+' was NOT destroyed!');
				}
				
				if (manga_attacked_by !== undefined) {
					
					html += '<p>Attacked '+attacked+'by '+manga_attacked_by+'.';
					console.log(name+' was attacked by '+manga_attacked_by);
				} else {
					html += '<p>Was never attacked.';
					console.log(name+' was NOT attacked!');
				}
				
				if (name == 'Ebisu Garden Place') {
					var marker='frog.png';
				} else {
					var marker='blue-dragon.png';
				}
				
				
				
				createMarker(kekkaiMap,new google.maps.LatLng(
					latitude,
					longitude),
					marker,
					html);
				
				console.log(name+' is a kekkai in the manga!');
				
			} else {
				console.log('__'+data.kekkai[i].name+' is NOT a kekkai in the manga!');
			}
			
			
			
			//console.log(name+'/'+name_japanese+': '+latitude+', '+longitude);
					
		}
	});

	/*		
		}
	);*/
	
	$("#select-kekkai a").click(
		function(event){

			event.preventDefault();
			
			var selectedKekkai = $(this).attr('id');
			selectKekkai(selectedKekkai);
	
		}
	);


	
}

//Select manga, tv or movie kekkai
function selectKekkai(selectedKekkai) {
	
	console.log('selected: '+selectedKekkai);
	
	var kekkai_list = "";
			
	$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
	//lo de arriba es un callback function, se pone como ultimo parametro
		
///COMO HAGO PARA DECIR, SI TAL ES TAL
		
		
		for (var i in data.kekkai) {

			var name = data.kekkai[i].name;
			var name_japanese = data.kekkai[i].name_japanese;
			var name_romanji = data.kekkai[i].name_romanji;
			var latitude = data.kekkai[i].latitude;
			var longitude = data.kekkai[i].longitude;
			var manga_is_kekkai = data.kekkai[i].manga_is_kekkai;
			var tv_is_kekkai = data.kekkai[i].tv_is_kekkai;
			var movie_is_kekkai = data.kekkai[i].movie_is_kekkai;
			
			kekkai_list += i + ' - '+name+' | ';
			
			
			//console.log(name+' is a kekkai in manga: '+manga_is_kekkai);
			//console.log(name+' is a kekkai in tv: '+tv_is_kekkai);
			//console.log(name+' is a kekkai in movie: '+movie_is_kekkai);	
			
			if(selectedKekkai == 'manga' && manga_is_kekkai == 'Yes') {
				
				
				//console.log(name+' will show up');
				
			} else if(selectedKekkai == 'tv' && tv_is_kekkai == 'Yes') {
				//console.log(name+' will show up');
			} else if(selectedKekkai == 'movie' && movie_is_kekkai == 'Yes') {
				//console.log(name+' will show up');
			} 
			
					/*
					var name = data.kekkai[i].name;
					var name_japanese = data.kekkai[i].name_japanese;
					var latitude = data.kekkai[i].latitude;
					var longitude = data.kekkai[i].longitude;
					
					
					if (name == 'Ebisu Garden Place') {
						var marker='frog.png';
					} else {
						var marker='blue-dragon.png';
					}
					
					
					var html=name;
					

					/*
					createMarker(kekkaiMap,new google.maps.LatLng(
						latitude,
						longitude),
						marker,
						html);
					*/
		}
		console.log(kekkai_list);
	});



}


//crea un marker con una burbuja de texto, y una imagen personalizada
function createMarker(map,point,image,txt) {

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


