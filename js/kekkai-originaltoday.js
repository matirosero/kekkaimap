//replace map with kekkaiMap
var map; //fuera del contexto de las funciones para que sea siempre accesible
var veces=0;

var getFrom;


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
	
	
	getKekkai(manga);


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


function getKekkai(getFrom) {
	
	$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
				//lo de arriba es un callback function, se pone como ultimo parametro
		
		for (var i in data.kekkai) {
			
			var name = data.kekkai[i].name;
			var name_japanese = data.kekkai[i].name_japanese;
			var name_romanji = data.kekkai[i].name_romanji;
			var latitude = data.kekkai[i].latitude;
			var longitude = data.kekkai[i].longitude;
			var manga_destroyed = data.kekkai[i].manga_destroyed;
			var manga_attacked_by = data.kekkai[i].manga_attacked_by;
			var tv_destroyed = data.kekkai[i].tv_destroyed;
			var tv_attacked_by = data.kekkai[i].tv_attacked_by;
			var movie_destroyed = data.kekkai[i].movie_destroyed;
			var movie_attacked_by = data.kekkai[i].movie_attacked_by;
				
						
			var information = data.kekkai[i].information;
				
			var img = name.replace(/\s/g, '').replace('/', '-').toLowerCase();


			if (data.kekkai[i].manga_is_kekkai == 'Yes') {
				
				//if this was a kekkai in the manga, create marker
				
				
				var html='';
				
				
				/*
				Intento de agregar imagenes Flickr, como que no las busca hasta el final, así que no las pone
				------------------------
				
				//Flickr
				//llamada a la api de flickr
				var flickrtxt=name;
				console.log('flickr searc: '+flickrtxt);
				var apikey="803c9828d52e6a1bb961e9d8b337caa1"; //cambiar por la vuestra
				
				$.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+apikey+"&text="+flickrtxt+"&per_page=1&sort=interestingness-desc&has_geo=1&extras=url_m&format=json&nojsoncallback=1",
				function(data){
					$.each(data.photos.photo, function(i,item) {
						var flickrimg="<img width='200' src='"+item.url_m+"' />";

						html=+flickrimg;
						console.log(name+': '+flickrimg);
					});
				});
				
				*/
	
	
	
	
				//como no funciona flickr, uso imagenes bajadas	
				html='<img src="images/'+img+'.jpg" style="float:left; margin-right:10px; width:100px;">';
				
				html += '<div style="float:right;width:200px;"><h3 style="margin-top:0"><a href="#'+name+'" class="more kekkai">'+name+'</a></h3>';
				
				if (manga_destroyed == 'Yes') {
					var destroyed_status = 'and destroyed ';
					//console.log(name+' was destroyed!');
				} else {
					var destroyed_status  = 'but not destroyed ';
					//console.log(name+' was NOT destroyed!');
				}
				
				if (manga_attacked_by !== undefined) {
					
					//split array into string
					var attacking_dragons = manga_attacked_by.split(", ");
					
					//how many values in string
					var n = attacking_dragons.length;
					
					//counter
					var d = 1;
					
					html += '<p>Attacked '+destroyed_status+'by ';
					
					for (var dragon in attacking_dragons) {
						
						html += '<a class="more doe" href="#'+attacking_dragons[dragon]+'">'+attacking_dragons[dragon]+'</a>';
						
						if (n > 1 && d < n - 1 ) {
							//if multiple attackers, and this is not the second to last on the list, add comma
							html +=', ';
						} else if (n > 1 && d == n - 1 ) {
							//if multiple attackers, and this is the second to last on the list, add 'and'
							html +=' and ';
						}
						
						//update counter
						d++;
					}
					
					html += '.';
					
				} else {
					html += '<p>Has not been attacked.';
					console.log(name+' was NOT attacked!');
				}
				
				html += '</div>';
				
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

//click on infobox links
	$('#kekkai-map').on("click",'.more', function(e) {
		e.preventDefault();
		console.log('go to info');
	});
	

