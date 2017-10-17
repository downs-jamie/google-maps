$(document).ready(function(){
		var google = window.google;
		console.log('map loaded');
		// console.log(google.maps.event)
		// geographic center of the US
		myLatlng = {
			lat: 40.0000,
			lng: -98.0000
		};
		// Init the map to load at geoCenter, zoom 4
		var mapElement = document.getElementById('map');
		mapOptions = {
			zoom: 4,
			center: myLatlng
		}


		///////////////////////////////////
		// Initial Map Load with ALL cities
		///////////////////////////////////
		var map = new google.maps.Map(mapElement,mapOptions);
		// markers array
		var markers = [];
		// global infoWindow for everyone to share
		var infoWindow = new google.maps.InfoWindow();
		// loop through the cities array which is in cities.js
		var listHTML = '';
		cities.map((city)=>{
			createMarker(city);
			listHTML += addCityToList(city);
		});
		$('#cities-table tbody').html(listHTML);
		$('.city-name').click(()=>{
			console.log("City clicked on.")
			// trigger = simulate the given event (click, change, etc.) 
			// arg1: what element
			// arg2: which event
			var index = $(this).attr('index');
			google.maps.event.trigger(markers[index],"click");
		})
		$('.city-zoom').click(function(){
			// console.log($(this));
			var index = $(this).attr('index');
			zoomToCity(cities[index].lat,cities[index].lon);
		});
		$('.city-directions').click(function(){
			// console.log($(this));
			var index = $(this).attr('index');
		});



		///////////////////////////////////
		/////////SUBMIT HANDLER////////////
		///////////////////////////////////
		// Add submit listener to the form
		$('#filter-form').submit(function(event){
			// wipe out all the markers
			markers.map((marker)=>{
				marker.setMap(null);
			});

			event.preventDefault();
			// user submitted the input box
			// console.log("User submission!");
			var userSearch = $('#filter-input').val().toLowerCase();
			listHTML = '';
			cities.map((city)=>{
				var cityName = city.city.toLowerCase();
				if(cityName.indexOf(userSearch) > -1){
					// The city we are on, contains the search text the user entered
					createMarker(city);
					listHTML += addCityToList(city);
				}
			});
			if(listHTML === ''){
				$('#cities-table tbody').html("<h2>No matching cities. Please refine your search</h2>");
			}else{
				$('#cities-table tbody').html(listHTML);
			}

		});

		function addCityToList(city){
			var newHTML = '<tr>';
				newHTML += `<td class="city-name" index=${city.yearRank-1}>${city.city}</td>`; 
				newHTML += `<td class="city-state">${city.state}</td>`;
				newHTML += `<td class="city-directions" index=${city.yearRank-1}><button class="btn btn-primary">Get Directions</button></td>`;
				newHTML += `<td class="city-zoom" index=${city.yearRank-1}><button class="btn btn-success">Zoom to city</button></td>`;
			newHTML += '</tr>'
			return newHTML;			
		}

		function createMarker(city){
			// console.log(city);
			// set up an object with this cities lat/lon
			var cityLL = {
				lat: city.lat,
				lng: city.lon
			}
			// set up a marker for current city
			var marker = new google.maps.Marker({
				// WHERE
				position: cityLL,
				map: map,
				title: city.city
			});
			// add a click listener to THIS marker
			// addListener takes 3 args:
			// 1. What
			// 2. Event
			// 3. Code to run...
			google.maps.event.addListener(marker, 'click',()=>{
				// all infoWindows (becuase they are constructors), have a setContent
				// method which is like .html("blah blah blah")
				var infoWindowHTML = `<h2>${city.city}</h2>`
				infoWindowHTML += `<h4>City population: ${city.yearEstimate}</h4>`
				infoWindowHTML += '<img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Wonder_Woman_%28DC_Rebirth%29.jpg/170px-Wonder_Woman_%28DC_Rebirth%29.jpg">';
				infoWindow.setContent(infoWindowHTML);
				// open takes 2 args:
				// 1. Map to open the infoWindow on
				// 2. Where to put the infoWindow on teh map
				infoWindow.open(map, marker);
			});
			markers.push(marker);
		}

		// This function will zoom into a partiuclar lat/lon
		// Lat/lon will correspond to one of our cities/
		function zoomToCity(lat, lon){
			// google maps api has a constcutor to make LatLng obkect
			var LL = new google.maps.LatLng(lat, lon);
			console.log(LL);
			console.log(lat, lon);
			map = new google.maps.Map(
				document.getElementById('map'),
				{
					zoom: 15,
					center: LL
				});
			
			infoWindow = new google.maps.InfoWindow();
			// places is a add-on to GOogle Maps so we can search for stuff
			var places = new google.maps.places.PlacesService(map);
			// places has a method called "nearbySearch" that we pass an object wiht:
			// 1. location
			// 2. radius
			// 3. type
			places.nearbySearch({
				location: LL,
				radius: 5000,
				type: ['stadium']
			}, function(results, status){
				console.log(results);
			});
		}

});

	// $.getJSON(url, function(weatherData){

	// })


// initMap
// Stuff from friday.  probably useless?
// var head = document.head
// console.log(typeof(head.children[3]))
// console.dir(head)
// head.childNodes.splice(0, 0, googleMapsScript)
// var googleMapsScript = document.head.children[1];
// googleMapsScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`);
// document.head.insertBefore(script, googleMapsScript);
// var googleMapsScript = document.head.children[1];
// googleMapsScript.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`);
// })
// TODO - add in $.ajax and jsonp
// var PlacesTypes = [
//     'accounting',
//     'airport',
//     'amusement_park',
//     'aquarium',
//     'art_gallery',
//     'atm',
//     'bakery',
//     'bank',
//     'bar',
//     'beauty_salon',
//     'bicycle_store',
//     'book_store',
//     'bowling_alley',
//     'bus_station',
//     'cafe',
//     'campground',
//     'car_dealer',
//     'car_rental',
//     'car_repair',
//     'car_wash',
//     'casino',
//     'cemetery',
//     'church',
//     'city_hall',
//     'clothing_store',
//     'convenience_store',
//     'courthouse',
//     'dentist',
//     'department_store',
//     'doctor',
//     'electrician',
//     'electronics_store',
//     'embassy',
//     'establishment (deprecated)',
//     'finance (deprecated)',
//     'fire_station',
//     'florist',
//     'food (deprecated)',
//     'funeral_home',
//     'furniture_store',
//     'gas_station',
//     'general_contractor (deprecated)',
//     'grocery_or_supermarket',
//     'gym',
//     'hair_care',
//     'hardware_store',
//     'health (deprecated)',
//     'hindu_temple',
//     'home_goods_store',
//     'hospital',
//     'insurance_agency',
//     'jewelry_store',
//     'laundry',
//     'lawyer',
//     'library',
//     'liquor_store',
//     'local_government_office',
//     'locksmith',
//     'lodging',
//     'meal_delivery',
//     'meal_takeaway',
//     'mosque',
//     'movie_rental',
//     'movie_theater',
//     'moving_company',
//     'museum',
//     'night_club',
//     'painter',
//     'park',
//     'parking',
//     'pet_store',
//     'pharmacy',
//     'physiotherapist',
//     'place_of_worship (deprecated)',
//     'plumber',
//     'police',
//     'post_office',
//     'real_estate_agency',
//     'restaurant',
//     'roofing_contractor',
//     'rv_park',
//     'school',
//     'shoe_store',
//     'shopping_mall',
//     'spa',
//     'stadium',
//     'storage',
//     'store',
//     'subway_station',
//     'synagogue',
//     'taxi_stand',
//     'train_station',
//     'transit_station',
//     'travel_agency',
//     'university',
//     'veterinary_care',
//     'zoo'
// ];

