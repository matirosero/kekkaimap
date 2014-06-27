//replace map with kekkaiMap
var kekkaiMap; 

var markers = [];

var getFrom;

var markerDragon = 'dragon.svg';
var markerFroggie ='froggie.svg';

function initialize() {

	//style from http://snazzymaps.com/style/74/becomeadinosaur
	var style_kekkai = [{"elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#f5f5f2"},{"visibility":"on"}]},{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#ffffff"},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"visibility":"simplified"},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"color":"#ffffff"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#71c8d4"}]},{"featureType":"landscape","stylers":[{"color":"#e5e8e7"}]},{"featureType":"poi.park","stylers":[{"color":"#8ba129"}]},{"featureType":"road","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.sports_complex","elementType":"geometry","stylers":[{"color":"#c7c7c7"},{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#a0d3d3"}]},{"featureType":"poi.park","stylers":[{"color":"#91b65d"}]},{"featureType":"poi.park","stylers":[{"gamma":1.51}]},{"featureType":"road.local","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","stylers":[{"visibility":"simplified"}]},{"featureType":"road"},{"featureType":"road"},{},{"featureType":"road.highway"}];
	//Then we use this data to create the styles.
	var styled_kekkai = new google.maps.StyledMapType(style_kekkai, { name: "kekkai style" });

	//Tokyo location
	var latlng = new google.maps.LatLng(35.689487, 139.673706);
    
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
	
	
	//calls function that gets kekkai
	getKekkai('manga');

	
	$("#select-kekkai a").click(
		function(event){

			event.preventDefault();
			
			var selectedKekkai = $(this).attr('id');
			
			if (selectedKekkai == 'manga' || selectedKekkai == 'tv' || selectedKekkai == 'movie') {
				
				clearMarkers();
				getKekkai(selectedKekkai);
				
			}  else if (selectedKekkai == 'showall') {
				
				//this should show all kekkai, not the array that has been selected previously
				showMarkers();
			}
			
	
		}
	);


	
}


function getKekkai(kekkaiSource) {
	
	console.log('kekkai source is '+kekkaiSource);
	
	$.getJSON("kekkai.json",function(data){ //funcion con los datos leidos = ultimo parametro
		//lo de arriba es un callback function, se pone como ultimo parametro
		
		//array to hold kekkai indexes
		var shownKekkaiIndex = [];
		
		//variable for each kekkai index in turn
		//TODO: iterate in function
		var indexKekkai = 0;
		
		for (var i in data.kekkai) {

			if (kekkaiSource == 'manga' && data.kekkai[i].manga_is_kekkai == 'Yes') {
				
				//if this was a kekkai in the manga, add to array
				
				//console.log(data.kekkai[i].name+' is a kekkai in the manga with ID '+indexKekkai);
				shownKekkaiIndex.push(indexKekkai);
				//console.log('new array of kekkai: '+shownKekkaiIndex);
				
			} else if (kekkaiSource == 'tv' && data.kekkai[i].tv_is_kekkai == 'Yes') {
				//if this was a kekkai in the tv anime, add to array
				shownKekkaiIndex.push(indexKekkai);
			} else if (kekkaiSource == 'movie' && data.kekkai[i].movie_is_kekkai == 'Yes') {
				//if this was a kekkai in the movie, add to array
				shownKekkaiIndex.push(indexKekkai);
			} 
			
			indexKekkai++;
			
			//console.log(name+'/'+name_japanese+': '+latitude+', '+longitude);
					
		}
		
		//console.log('FINAL array of kekkai: '+shownKekkaiIndex);
		
		for (var i in shownKekkaiIndex) {
			//console.log('index: '+shownKekkaiIndex[i]);
			
			var thisKekkai = shownKekkaiIndex[i]
			//console.log('name: '+data.kekkai[shownKekkaiIndex[i]].name);
			
			var name = data.kekkai[thisKekkai].name;
			var name_japanese = data.kekkai[thisKekkai].name_japanese;
			var name_romanji = data.kekkai[thisKekkai].name_romanji;
			var latitude = data.kekkai[thisKekkai].latitude;
			var longitude = data.kekkai[thisKekkai].longitude;
			var manga_destroyed = data.kekkai[thisKekkai].manga_destroyed;
			var manga_attacked_by = data.kekkai[thisKekkai].manga_attacked_by;
			var tv_destroyed = data.kekkai[thisKekkai].tv_destroyed;
			var tv_attacked_by = data.kekkai[thisKekkai].tv_attacked_by;
			var movie_destroyed = data.kekkai[thisKekkai].movie_destroyed;
			var movie_attacked_by = data.kekkai[thisKekkai].movie_attacked_by;
				
						
			var information = data.kekkai[thisKekkai].information;
				
			var infowindowContent = [name];
			//console.log('mandamos: 1- '+infowindowContent);

			
			//create variable to store html for infowindow
			var html='';
			
				
			html = '<div class="infowindow-text" style="float:right;width:200px;"><h3 style="margin-top:0"><a href="#'+name+'" class="more kekkai">'+name+'</a></h3>';
				
			if ((kekkaiSource == 'manga' && manga_destroyed == 'Yes') || (kekkaiSource == 'tv' && tv_destroyed == 'Yes') || (kekkaiSource == 'movie' && movie_destroyed == 'Yes')) {
				var destroyed_status = 'and destroyed ';
			} else {
				var destroyed_status  = 'but not destroyed ';
			}
			
			
			//TODO: separate attacking dragons by source
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
				var markerIcon=markerFroggie;
			} else {
				var markerIcon=markerDragon;
			}
			
			infowindowContent.push(html);
			//console.log('mandamos: '+infowindowContent);	
				
				
			createMarker(kekkaiMap,new google.maps.LatLng(
				latitude,
				longitude),
				markerIcon,
				infowindowContent);
				
			//console.log(name+' is a kekkai in the manga!');
			
		}
		
	});
	
}


//crea un marker con una burbuja de texto, y una imagen personalizada
function createMarker(map,point,image,content) {
	
	//create marker
	var marker = new google.maps.Marker({
		position: point,
		map: map,
		icon: image
	});
	
	//push to markers array 
	markers.push(marker);
	
	
	//create info window, but don't put in any content yet
	var infowindow = new google.maps.InfoWindow({
		//content: txt
	});
	
	//when marker is clicked, load content and show window
	google.maps.event.addListener(marker, 'click', function() {

		//prepare content
		var name = content[0];
		var text = content[1]
		
		//imagen bajada anteriormente
		var img = name.replace(/\s/g, '').replace('/', '-').toLowerCase();
		img ='<img src="images/'+img+'.jpg" style="float:left; margin-right:10px; width:100px;">';

		//put content together
		var newContent = img+text;
		
		//load content into window when marker is clicked NOT before
		infowindow.setContent(newContent);
		
		//open window \O/
		infowindow.open(map,marker);

	});

	return marker;
}



// Sets the map on all markers in the array.
function setAllMap(kekkaiMap) {
  console.log('markers: '+markers);
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(kekkaiMap);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
   console.log('markers: '+markers);
   setAllMap(kekkaiMap);
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
	

