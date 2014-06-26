//replace map with kekkaiMap
var map; //fuera del contexto de las funciones para que sea siempre accesible

var markers = [];

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
	
	
	getKekkai('manga');


	/*		
		}
	);*/




	
	$("#select-kekkai a").click(
		function(event){

			event.preventDefault();
			
			var selectedKekkai = $(this).attr('id');
			//selectKekkai(selectedKekkai);
			
			console.log('CLICK');
			
			if (selectedKekkai == 'remove') {
				clearMarkers();
			} else if (selectedKekkai == 'showall') {
				showMarkers();
			}
			
	
		}
	);


	
}


function getKekkai(kekkaiSource) {
	
	console.log('kekkai source is '+kekkaiSource);
	
	$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
		//lo de arriba es un callback function, se pone como ultimo parametro
		
		var shownKekkaiIndex = [];
		var indexKekkai = 0;
		var myKekkai = [];
		
		for (var i in data.kekkai) {

			if (kekkaiSource == 'manga' && data.kekkai[i].manga_is_kekkai == 'Yes') {
				
				//if this was a kekkai in the manga, create marker
				
				console.log(data.kekkai[i].name+' is a kekkai in the manga with ID '+indexKekkai);
				shownKekkaiIndex.push(indexKekkai);
				console.log('new array of kekkai: '+shownKekkaiIndex);
				//data.kekkai[i].push(myKekkai);
				
			} else if (kekkaiSource == 'tv' && data.kekkai[i].tv_is_kekkai == 'Yes') {
				shownKekkaiIndex.push(indexKekkai);
			} else if (kekkaiSource == 'movie' && data.kekkai[i].movie_is_kekkai == 'Yes') {
				shownKekkaiIndex.push(indexKekkai);
			} 
			
			indexKekkai++;
			
			
			//console.log(name+'/'+name_japanese+': '+latitude+', '+longitude);
					
		}
		
		console.log('FINAL array of kekkai: '+shownKekkaiIndex);
		
		for (var k in shownKekkaiIndex) {
			console.log('index: '+shownKekkaiIndex[k]);
			
			var selectedIndexKekkai = shownKekkaiIndex[k]
			console.log('name: '+data.kekkai[shownKekkaiIndex[k]].name);
			
			var name = data.kekkai[selectedIndexKekkai].name;
			var name_japanese = data.kekkai[selectedIndexKekkai].name_japanese;
			var name_romanji = data.kekkai[selectedIndexKekkai].name_romanji;
			var latitude = data.kekkai[selectedIndexKekkai].latitude;
			var longitude = data.kekkai[selectedIndexKekkai].longitude;
			var manga_destroyed = data.kekkai[selectedIndexKekkai].manga_destroyed;
			var manga_attacked_by = data.kekkai[selectedIndexKekkai].manga_attacked_by;
			var tv_destroyed = data.kekkai[selectedIndexKekkai].tv_destroyed;
			var tv_attacked_by = data.kekkai[selectedIndexKekkai].tv_attacked_by;
			var movie_destroyed = data.kekkai[selectedIndexKekkai].movie_destroyed;
			var movie_attacked_by = data.kekkai[selectedIndexKekkai].movie_attacked_by;
				
						
			var information = data.kekkai[selectedIndexKekkai].information;
				
			var infowindowContent = [name];
			console.log('mandamos: 1- '+infowindowContent);

			var html='';
			
			//como no funciona flickr, uso imagenes bajadas	
			//var img = name.replace(/\s/g, '').replace('/', '-').toLowerCase();
			//html='<img src="images/'+img+'.jpg" style="float:left; margin-right:10px; width:100px;">';
				
			html = '<div class="infowindow-text" style="float:right;width:200px;"><h3 style="margin-top:0"><a href="#'+name+'" class="more kekkai">'+name+'</a></h3>';
				
			if ((kekkaiSource == 'manga' && manga_destroyed == 'Yes') || (kekkaiSource == 'tv' && tv_destroyed == 'Yes') || (kekkaiSource == 'movie' && movie_destroyed == 'Yes')) {
				var destroyed_status = 'and destroyed ';
			} else {
				var destroyed_status  = 'but not destroyed ';
				//console.log(name+' was NOT destroyed!');
			}
			
			
			//TODO: separate attacking drgons by source
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
			
			infowindowContent.push(html);
			console.log('mandamos: '+infowindowContent);	
				
				
			createMarker(kekkaiMap,new google.maps.LatLng(
				latitude,
				longitude),
				marker,
				infowindowContent);
				
			console.log(name+' is a kekkai in the manga!');
			
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
function createMarker(map,point,image,content) {
	var marker = new google.maps.Marker({
		position: point,
		map: map,
		icon: image
	});
	
	
	markers.push(marker);
	

	

	var infowindow = new google.maps.InfoWindow({
		//content: txt
	});
	google.maps.event.addListener(marker, 'click', function() {

		//prepare content
		var name = content[0];
		var text = content[1]
		
		//imagen bajada anteriormente
		var img = name.replace(/\s/g, '').replace('/', '-').toLowerCase();
		img ='<img src="images/'+img+'.jpg" style="float:left; margin-right:10px; width:100px;">';

		
		var newContent = img+text;
		
		//load content into window when marker is clicked NOT before
		infowindow.setContent(newContent);
		infowindow.open(map,marker);

	});

	return marker;
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

//click on infobox links
	$('#kekkai-map').on("click",'.more', function(e) {
		e.preventDefault();
		console.log('go to info');
	});
	

