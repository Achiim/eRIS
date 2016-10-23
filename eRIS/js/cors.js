/**
 	****************************************
	* Sportstaetten-Reservierungs-System   *
	****************************************
	
	Autor:	Achim 
	Jahr:	2016
	
	Funktionen zur Nutzung der Google Cloud Platform API
	
**/

	/*********************************************************************************
	Funktion:	createCORSRequest 
	Zweck:		Generiert einen Cross-Origin Ressource Sharing Request, damit auf den 
				Google-Cloud-Server zugegriffen werden kann.
*/
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
	var mode = false; // false = synchroner Aufruf der url | true = asynchroner Aufruf
    xhr.open(method, url, mode);						
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

	/*********************************************************************************
	Funktion:	postEvent 
	Zweck:		Speichere einen Event-Termin in den Google-Speicher
	 */
function postEvent(msg, ui) {

//msg = 'Training/12.10.2016%2017%3A00/90/A/Kunstrasen';
	

// Endpoint zur Liste aller Events
var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/addEvent/' + msg;

var eventPost = createCORSRequest('GET', url);
if (!eventPost) {
  	alert('CORS not supported');
	return;
}

// Response handlers.
eventPost.onload = function() {	
		var text = eventPost.responseText;
    	var status = eventPost.status;
	   	if (status < 200 || status >=  300) {
	   		alert('postEvent: HTTP-Fehler beim Schreiben der Events: ' + status + ' ' + text +  ' ' + msg);
	   	}
	   	else {
//	   		alert('postEvent: ok' + text);				// debug only
	   		var erisID = JSON.parse(text);				// return generierte ID aus der DB
        	$(ui).data( "erisID", erisID.id ); 			// merke dir die eindeutige Nummer des Event (generiert von Tim)

    		return;							
	   	}
	
} // Ende von eventPost.onload

eventPost.onerror = function() {
	    alert('Woops, there was an error making the request.');
	  };

eventPost.send();
}

	/*********************************************************************************
	Funktion:	postEventUpdate 
	Zweck:		Speichere einen aktualisierten Event-Termin in den Google-Speicher
	 */
function postEventUpdate(msg) {

	//msg = 'id/12.10.2016%2017%3A00/90/Kunstrasen'
	

// Endpoint zur Liste aller Events
var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/update/' + msg;

var eventPostUpdate = createCORSRequest('GET', url);
if (!eventPostUpdate) {
  	alert('CORS not supported');
	return;
}

// Response handlers.
eventPostUpdate.onload = function() {	
		var text = eventPostUpdate.responseText;
    	var status = eventPostUpdate.status;
	   	if (status < 200 || status >=  300) {
	   		alert('postEventUpdate: HTTP-Fehler beim Update des Events: ' + status + ' ' + text +  ' ' + msg);
	   	}
	   	else {
//	   		alert('eventPostUpdate: ok' + text);				// debug only
    		return;							
	   	}
	
} // Ende von eventPostUpdate.onload

eventPostUpdate.onerror = function() {
	    alert('Woops, there was an error making the request.');
	  };

	  eventPostUpdate.send();
}

	/*********************************************************************************
	Funktion:	readAllEvents 
	Zweck:		Lese alle Event-Termine aus dem Google-Speicher
	
	In:
			field = Name des Platzes, für das Events gelesen werden sollen
					'' = hole alle Events
			datum = Tagesdatum das gelesen werden soll
	
	url-Format : https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/field/Stadion/time/21.10.2016%2008%3A00/21.10.2016%2022%3A00
*/
function readAllEvents(field, datum) {
	$('.Platz').addClass( 'verschwommen' );

	if (field == undefined || field == 'undefined') field=fieldTitle[0];	
	if (field == '') {
		// Endpoint zur Liste aller Events
		var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event';
	}
	else {
		if (datum == '') {
			
			// Endpoint zur Liste aller Events eines Fields
			var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/field/'+ field;
		}
		else {
			// Endpoint zur Liste aller Events eines Fields an einem Tag
			var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/field/'+ field;
			url += '/time/' + datum + '%2008%3A00/' + datum + '%2022%3A00';
		}
	}

	var eventList = createCORSRequest('GET', url);
	if (!eventList) {
	  	alert('CORS not supported');
		return;
	}

	// Response handlers.
	eventList.onload = function() {	
//		setTimeout(function(){
			$('.Platz').removeClass( 'verschwommen' );
//		}, 2000);
		var text = eventList.responseText;
    	var status = eventList.status;
	   	if (status < 200 || status >=  300) alert('readAllEvents: HTTP-Fehler beim lesen der Events: ' + status+ ' ' + text);

//		alert('readAllEvents:' + text);		// debugging only

		var Termine = JSON.parse(text).items;
		if (Termine == undefined) return;
		
		
/**********************************************
 * 			JSON-Aufbau 
 * 
		   "id": 19,
		   "startTime": "13.10.2016 09:00",
		   "duration": 30,
		   "description": "Training",
		   "team": "B2",
		   "match": false,
		   "partOfSeries": false,
		   "field": "Unterer Platz",
		   "portion": [1,2,3,4]
*		
*		
***********************************************/
		var Event = new Object();
    
		for (var a=0; a < Termine.length; a++) {
			Event.ID = Termine[a].id;						// interner Schlüssel
			Event.start = Termine[a].startTime;				// Datum und Uhrzeit des Beginns
			Event.Dauer = Termine[a].duration;				// Dauer in Minuten 
			Event.Beschreibung = Termine[a].description;	// Beschreibung
			Event.TeamID = Termine[a].team;					// Team Kürzel
			Event.Spiel = Termine[a].match;					// Team Kürzel
			Event.Serie = Termine[a].partOfSeries;			// Teil einer Terminserie
			Event.Platz = Termine[a].field;					// Platz
			Event.Platzteil = Termine[a].portion;			// Platzteile
			Event.dateStart = Event.start.split(' ');		// Array [0] = Datum, [1] = Zeit
    	
			var dateStart = Event.start.split(' ');
			var day = parseInt(dateStart[0].split('.')[0]);
			var month = parseInt(dateStart[0].split('.')[1]);
			var year = parseInt(dateStart[0].split('.')[2]);
			var hour = parseInt(dateStart[1].split(':')[0]);
			var minute = parseInt(dateStart[1].split(':')[1]);
    	
			newEvent(Event);
		}
	} // Ende von eventList.onload

	eventList.onerror = function() {
		    alert('Woops, there was an error making the request.');
		  };

	eventList.send();
}

	/*********************************************************************************
	Funktion:	readAllTeams 
	Zweck:		Lese alle Teams aus dem Google-Speicher
*/
function readAllTeams() {
    // This is a sample server that supports CORS.
    var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/team';
    //  var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/treeSystem/v1/traverseTree';

    var teamList = createCORSRequest('GET', url);
    if (!teamList) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    teamList.onload = function() {
    	var text = teamList.responseText;
    	var status = teamList.status;
    	if (status < 200 || status >=  300) alert('readAllTeams: HTTP-Fehler beim lesen der Teams: ' + status);
   
//		alert('readAllTeams:' + text);		// debugging only

    	var Teams = JSON.parse(text).items;
		if (Teams == undefined) return;
		
		var TeamID = '';							// Team-Kürzel z.B. "A"
    	var Team = '';								// Team-Bezeichung z.B. "A-Jugend"
    	var DefaultColor = '';						// Team-Farbcode z.B. "00AACC"
    	var DefaultDuration = '';					// Default-Dauer einer Reservierung
    	var DefaultSize = '';						// Default-Platzgräße einer Reservierung in Anzahl der Teile z.B. "3/4" für 3 von 4 max. Teilen 
    	var Klasse = '';							// Altersklasse des Teams
      
    	for (var a=0; a < Teams.length; a++) {
    		TeamID = Teams[a].teamId;
    	  
    		// übernehme die Attribute des Teams
    		Team = Teams[a].team;
    		DefaultColor = Teams[a].defaultColor;
    		DefaultDuration = Teams[a].defaultDuration;
//    		DefaultSize = Teams[a].defaultSize;
    		Klasse = Teams[a].group.groupId;
      	
    		// Generiere den Team-Button
    		$('<button>' + TeamID + '</button>')		
    		.addClass('Eventbutton ' + Klasse)
    		.attr( 'id', 'Button' + bid++)
    		.appendTo( '.Buttongroup' + Klasse )
    		.button( );

    		// onClick-Funktion für den Team-Button
    		$('#Button' + (bid-1) ).click( function( event ) {
    		event.preventDefault();
		
    		var Event = new Object();
    		Event.TeamID = $(this).html();		// ID aus dem Button
    		Event.Dauer = 60;					// DefaultDauer 60 Minuten
    		Event.dateStart = [];				// leeres Startdatum
    		Event.ID = '';						// leere DB-ID
    		newEvent(Event);				
    		});
      	}
    } // Ende teamList.onload

    
    teamList.onerror = function() {
    	alert('Woops, there was an error making the request.');
	};

	teamList.send();
}

	/*********************************************************************************
	Funktion:	readAllGroups 
	Zweck:		Lese alle Altersklassen aus dem Google-Speicher
*/
function readAllGroups() {
    // This is a sample server that supports CORS.
    var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/group';

    var groupList = createCORSRequest('GET', url);
    //  var teamList = createCORSRequest('POST', url);
    if (!groupList) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    groupList.onload = function() {
    	var text = groupList.responseText;
    	var status = groupList.status;
	   	if (status < 200 || status >=  300) alert('readAllGroupsHTTP-Fehler beim lesen der Groups: ' + status);
   
//		alert('readAllGroups:' + text);		// debugging only

    	var Groups = JSON.parse(text).items;
		if (Groups == undefined) return;
    	var GroupID = '';							// Group-Kürzel z.B. "Aktive"
    	var GroupColor = '';						// Group-Farbcode z.B. "00AACC"
      
    	for (var a=0; a < Groups.length; a++) {
    		GroupID = Groups[a].groupId;
    	  
    		// übernehme die Attribute der Group
    		GroupColor = Groups[a].color;
      	
     		$('<div>' + '</div>')		
    		.addClass('Buttongroup' + GroupID + ' Buttongroup')
    		.css({'float': 'left'})
    		.appendTo( '#Buttonlist' );
     	}

    	$('<div>' + '</div>')		
		.delay(300);						// Verzögeerung um 300ms, damit Buttongroups vorhanden sind, bevor Buttons reingelegt werden

    } // Ende groupList.onload


    groupList.onerror = function() {
    	alert('Woops, there was an error making the request.');
	};

	groupList.send();
}

/*********************************************************************************
Funktion:	readAllFields 
Zweck:		Lese alle Sportstätten aus dem Google-Speicher
*/
function readAllFields() {
    // This is a sample server that supports CORS.
    var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/field';

    var fieldList = createCORSRequest('GET', url);
    if (!fieldList) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    fieldList.onload = function() {
    	var text = fieldList.responseText;
    	var status = fieldList.status;
    	if (status < 200 || status >=  300) alert('readAllFields: HTTP-Fehler beim lesen der Fields: ' + status);
   
//		alert('readAllFields:' + text);		// debugging only
    	

    	var Fields = JSON.parse(text).items;
		if (Fields == undefined) return;

		fieldAmount = Fields.length;
		
		for (var a=0; a < fieldAmount; a++) {
			fieldTitle[a] = Fields[a].title;
			
    	  
    		// übernehme die Attribute des Platzes
    		fieldPortions[a] = Fields[a].portions;
    		fieldPartTitle[a] = new Array(fieldPortions[a]);		// dynamisches Array generieren für die Plazteilbezeichungen je Platz
    		
    		for ( var pl=0; pl<fieldPortions[a]; pl++) {
     			fieldPartTitle[a][pl] = Fields[a].portionName+pl;	// Platzkürzel + lfd. Nummer
    		}
      	}

		$('#Platzname')
		.text(fieldTitle[currentField]);
		
		AnzahlPlatzTeile = fieldPortions[currentField];
		PlatzTeilWidth = PlatzWidth / AnzahlPlatzTeile - PlatzTeilMargin;
		MarkerMinWidth = PlatzTeilWidth - MarkerPadding;

		setFieldPartTitle(currentField); // neue Bezeichnung der Platzteile
		
//		for ( var pl=0; pl<AnzahlPlatzTeile; pl++) {
//			$('<div>'+fieldPartTitle[currentField][pl]+'</div>')		
//			.addClass('Platzteil')
//			.attr( 'id', 'Platzteil' + pl )
//			.css('width', PlatzTeilWidth)
//			.appendTo( '#Platz' );
//		}
		
////////////////////////////		readAllEvents(fieldTitle[currentField]); 

   } // Ende fieldList.onload

    
    fieldList.onerror = function() {
    	alert('Woops, there was an error making the request.');
	};

	fieldList.send();
}
