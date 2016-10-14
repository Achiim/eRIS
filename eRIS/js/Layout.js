/**
    ****************************************
	* Sportstaetten-Reservierungs-System   *
	****************************************
	
	Autor:	Achim 
	Jahr:	2016
	
	Sammlung von Funktionen zum Aufbau des Layouts des Reservierungs-Systems
	
	Das Layout wird grundsätzlich nach folgenden Schema aufgebaut

	.Belegungsplan
	+--------------------------------------------------------------------------
	|  .Platzkopf
	|  +-----------------------------------------------------------------------
	|  | PlatzLinks | PlatzRechts       | Platzname
	|  |                                | Platzteil0 | Platzteil1 | Platzteil3 | ...
	|  +---------------------------------------------------------------------------
	+------------------------------------------------------------------------------
	|  .Zeitleiste                      | .Platzleiste
	|  +------------------+----------------------------------------------------+
	|  | #ganztags                                                             |
	|  | .Uhrzeit                       | .PlatzTeil | .PlatzTeil | .PlatzTeil | ....
	|  | .UhrzeitHalbe    |             |            |            |
	|  |  ...
	|  +------------------+-------------+------------+------------+------------+ ....
	+---------------------------------------------------------------------------
	|  .Buttonleiste
	|  +------------------------+
	|  | .Buttongroup           |
	|  | .Eventbutton           |
	|  +------------------------+
	+---------------------------------------------------------------------------	
	
	
 */
//*********************************************************************************
//	globale Variablen

	var pid = 0;				// Nummerierung für PlatzElemente
	var mid = 0;				// Nummerierung für Marker
	var bid = 0;				// Nummerierung für Buttons
	
	var fieldAmount = 0;		// Anzahl der Felder
	var fieldTitle = [];		// Array für Platzbezeichungen
	var fieldPortions = []		// Anzahl der belegbaren Platzteile
	var fieldPartTitle = [];	// Array für Platzteilbezeichungen jedes Platzes [Platz][Platzteil]
	var currentField = 0;		// Pointer auf den aktuellen Platz
	
	var AnzahlPlatzTeile = 4;	// aktuelle Anzahl der reservierbaren Platzteile

//*********************************************************************************
// 	Konstanten für Layout
	
	const PlatzTeilWidth = 89;
	const PlatzTeilHeight = 10;
	const PlatzTeilMargin = 1;
	
	const MarkerPadding = 5+5;
	
	const innerMarkerWidth = PlatzTeilWidth-MarkerPadding;								// abzgl. padding links und rechts und margin oben
	const innerMarkerHeight = 5;														// abzgl. padding oben und unten und margin rechts
	
	const AnzahlRasterJeStunde = 4;														// kleinstes Reservierungsraster 1/4-tel Stunde
	
	const StundeInMinuten = 60;															// eine Stunde hat 60 Minuten
	const StundeInPixel = AnzahlRasterJeStunde*(PlatzTeilHeight + PlatzTeilMargin);		// eine Stunde hat z.B. 48 Pixel
	
	const BeginnZeitLeiste = 8;															// Zeitleiste beginnt um 8:00 Uhr
	const EndeZeitLeiste = 22;															// Zeitleiste endet um 22:00 Uhr
	
	const MarkerMaxWidth = (AnzahlPlatzTeile*(PlatzTeilWidth+PlatzTeilMargin))-MarkerPadding-PlatzTeilMargin;
	const MarkerMinWidth = PlatzTeilWidth-MarkerPadding;
	const MarkerMinHeight = innerMarkerHeight*2;

	
	/*********************************************************************************
	Funktion:	doPlatzview 
	Zweck:		Erzeugt einen Kopf über dem Tagesview für einen Platz.
	 */
function doPlatzview() {
	
	// Löschen alter Platzview-Komponenten
	$('.PlatzLinks').remove();
	$('.PlatzRechts').remove();
	$('.Platzname').remove();
	$('#Platzteil0').remove();
	$('#Platzteil1').remove();
	$('#Platzteil2').remove();
	$('#Platzteil3').remove();
	
	// falls es noch keinen Platzkopf gibt, diesen anlegen, alle Platzview-Komponenten liegen im Platzkopf
	var pk = '';
	pk = $('.Platzkopf').attr('id');
	if (pk == undefined)
		$('<div></div>')		
		.addClass('Platzkopf')
		.attr( 'id', 'Platzkopf' )
		.appendTo( '#Belegungsplan' );

	// Navigation im Platzview nach links
	$('<div><</div>')		
	.addClass('PlatzLinks')
	.attr( 'id', 'PlatzLinks' )
	.click( function( event ) {
      event.preventDefault();
      prevField();
      readAllEvents(fieldTitle[currentField]);
    } )
	.appendTo( '#Platzkopf' );

	// Navigation im Platzview nach rechts
	$('<div>></div>')		
	.addClass('PlatzRechts')
	.attr( 'id', 'PlatzRechts' )
	.click( function( event ) {
      event.preventDefault();
      nextField();
      readAllEvents(fieldTitle[currentField]);
    } )
	.appendTo( '#Platzkopf' );

	doPlatzteilview();				// Plattzeile anzeigen
	$(document).ready( readAllFields() );				// hier werden dann auch der Platzname und alle Platzteile angelegt
		
}
		
/*********************************************************************************
Funktion:	doPlatzteilview 
Zweck:		Erzeugt einen Kopf über dem Tagesview für einen Platz.
 */
function doPlatzteilview() {

	// Löschen alter Platzview-Komponenten
	$('#Platzteil0').remove();
	$('#Platzteil1').remove();
	$('#Platzteil2').remove();
	$('#Platzteil3').remove();

	for ( var pl=0; pl<fieldPortions[currentField]; pl++) {
	$('<div>'+fieldPartTitle[currentField][pl]+'</div>')		
	.addClass('Platzteil')
	.attr( 'id', 'Platzteil' + pl )
	.appendTo( '#Platzkopf' );
	}
	
}
	
	/*********************************************************************************
	Funktion:	doTagesview 
	Zweck:		Erzeugt alle Bestandteile des Layouts des Tagebelegungsplans.
	 */
function doTagesview() {
	
	// Erzeuge die Zeitleiste
	$('<div></div>')		
	.addClass('Zeitleiste')
	.attr( 'id', 'Zeitleiste' )
	.appendTo( '#Belegungsplan' );

	
	$('<div>&nbsp</div>')		
	.addClass('Uhrzeit')
	.attr( 'id', 'ganztags')
	.appendTo( '#Zeitleiste' );

	for ( var uhr=BeginnZeitLeiste; uhr<EndeZeitLeiste; uhr++ ) {
		$('<div>'+ uhr + '<sup>00</sup></div>')		
		.addClass('Uhrzeit')
		.attr( 'id', 'U'+ uhr )
		.appendTo( '#Zeitleiste' );
		$('<div>&nbsp</div>')		
		.addClass('UhrzeitHalbe')
		.attr( 'id', 'U'+ uhr + ':30')
		.appendTo( '#Zeitleiste' );
	}
	
	// Erzeuge Platzspalte
	$('<div></div>')		
	.addClass('Platzleiste')
	.attr( 'id', 'Platzleiste' )
	.appendTo( '#Belegungsplan' );

	$('<div>&nbsp</div>')		
	.addClass('Uhrzeit')
	.appendTo( '#Platzleiste' );

	for ( var uhr=BeginnZeitLeiste; uhr<EndeZeitLeiste; uhr=uhr+(1/AnzahlRasterJeStunde)) {
		for ( var pl=0; pl<AnzahlPlatzTeile; pl++ ) {
			$('<div></div>')		
			.addClass('PlatzTeil')
			.attr( 'id', pid++)
			.appendTo( '#Platzleiste' )
		}
	}

	makePlatzDroppable();

}

	/*********************************************************************************
	Funktion:	realZiel 
	Zweck:		Marker werden normalerweise in das Objekt gelegt, das unter der "Mitte" des Markers liegt.
				Diese Funktion liefert das Objekt unter der linken, oberen Ecke als return-Werk,
				damit der Marker dort abgelegt werden kann.
			
				In
					Ziel 	= lfd. Nummer des Objekts unter der Mitte des Markers
					h		= Höhe des Markers, der abgelegt werden soll
					w		= Breite des Markers, der abgelegt werden soll
			
				return		= lfd. Nummer des Objekts unter der linken, oberen Ecke des Markers
							= -1, wenn unter der linken, oberen Ecke kein Objekt liegt
				
*/

function realZiel(Ziel,h,w) {
	
    var zielRow = Math.floor(Ziel / AnzahlPlatzTeile);
    var zielCol = Ziel % AnzahlPlatzTeile;
    
    var markerH = (h + MarkerPadding + PlatzTeilMargin) / 2;
    var markerW = (w + MarkerPadding + PlatzTeilMargin) / 2;
    
    var markerRow = Math.floor(markerH / PlatzTeilHeight);
    var markerCol = Math.floor(markerW / PlatzTeilWidth);
    
    zielRow = zielRow - markerRow;
    zielCol = zielCol - markerCol;
    if ( zielRow >=0 && zielCol >= 0 ) {
    	var ZielID = zielRow * AnzahlPlatzTeile + zielCol;
    	return ZielID;
    }
    else {
    	return -1;
    }
    

}
	/*********************************************************************************
	Funktion:	makePlatzDroppable 
	Zweck:		mache die Platzhälften "droppable", damit Events darin abgelegt werden können
	*/
function makePlatzDroppable() {

	$( '.PlatzTeil').droppable({
        drop: function( event, ui ) {								// Funktion, die beim droppen aufgerufen wird

        var Ziel = parseInt($(this).attr('id'));					// ID des PlatzTeil in das gedroppt wird

        var ww = $(ui.draggable).css('width');						// Maße des gedroppten Marker
        var hh = $(ui.draggable).css('height');
        ww = parseInt(ww);
        hh = parseInt(hh);
         
        var real = realZiel(Ziel,hh,ww);							// ermittle reales Ziel das unter der linken, oberen Ecke liegt
        if ( real >=0  ) {
        	
			$(ui.draggable).appendTo( $('#' + real) );				// im Ziel ablegeb
 
			var MarkerID = $(ui.draggable).attr('id');
			var msg = '';
			var erisEvent = new Object();
			readAttributeFromEvent(MarkerID, erisEvent);				// übertrage Object -> .data
			
			if (erisEvent.ID == undefined || erisEvent.ID == '') {
				msg = makeEventMessage(MarkerID, real);						
				postEvent(msg, ui.draggable);							// in DB speichern
			}
			else {
				msg = makeEventUpdateMessage(MarkerID, real);
				postEventUpdate(msg);
			}
//			createEventObject(MarkerID, erisEvent);					// 
			storeEventToObjectData(MarkerID, erisEvent);				// übertrage Object -> .data
			erisToolTip(MarkerID, erisEvent);
		}
        
		$(ui.draggable).css({'top' : 0, 'left' : 0});        		// Position im Ziel oben links
	}});

};

	/*********************************************************************************
	Funktion:	newEvent 
	Zweck:		erzeugt einen neuen Marker, entweder aud der DB oder bei betätigen eines Eventbutton
	 */
function newEvent(erisEvent) {
	var marker = erisEvent.TeamID;
	var dauer = erisEvent.Dauer;
	var beginn = erisEvent.dateStart;
	var id = erisEvent.ID;
	
	var hoehe = minutesToPixel(dauer);
	var breite = innerMarkerWidth*AnzahlPlatzTeile+MarkerPadding*(AnzahlPlatzTeile-1)+(PlatzTeilMargin*(AnzahlPlatzTeile-1));
	var markerID = marker + mid++;
	$('<div>' + marker + '</div>')		
	.addClass(altersKlasse(marker) + ' Marker')
	.attr( 'id', markerID)
	.height(hoehe)
	.width(breite)
	
	.appendTo( '#Sammler' )

	.draggable()
	.draggable( "option", "revert", "invalid" )
	.draggable( "option", "cursorAt", { left: 0, top:0 } )
	
	.resizable({
		  resize: function( event, ui ) {
			    ui.size.height = (Math.round( ui.size.height / innerMarkerHeight ) * (PlatzTeilHeight + PlatzTeilMargin))  
			    					- MarkerPadding - PlatzTeilMargin ;
			    ui.size.width = (Math.round( ui.size.width / innerMarkerWidth ) * (PlatzTeilWidth + PlatzTeilMargin)) 
			    					- MarkerPadding - PlatzTeilMargin;
			    

			}
	})	
	.resizable({
			stop: function( event, ui ) { 
				var MarkerID = $(ui.element).attr('id');
				var msg = '';
				var erisEvent = new Object();
				readAttributeFromEvent(MarkerID, erisEvent);				// übertrage Object -> .data
				msg = makeEventUpdateMessage(MarkerID, real);
				postEventUpdate(msg);
			}
	})			

	.resizable( "option", "minWidth", MarkerMinWidth )	
	.resizable( "option", "maxWidth", MarkerMaxWidth )	
	.resizable( "option", "minHeight", MarkerMinHeight );

	if (beginn.length > 0) {
    	var hour = parseInt(beginn[1].split(':')[0]);
    	var minute = parseInt(beginn[1].split(':')[1]);
    	var zielID = (hour-BeginnZeitLeiste) * AnzahlRasterJeStunde*AnzahlPlatzTeile + (minute/(StundeInMinuten/AnzahlRasterJeStunde)*AnzahlPlatzTeile);		// je Stunde x Raster; Beginn allerdings bei 8:00 Uhr (8*x Raster versetzt)
    	$('#' + markerID)
    	.appendTo( '#' + zielID );	
	}
	storeEventToObjectData(markerID, erisEvent);
	erisToolTip(markerID, erisEvent);
}


	/*********************************************************************************
	Funktion:	storeEventToObjectData 
	Zweck:	
	
	erisID 			= 	Event.ID 			= interner Schlüssel
	erisStart		= 	Event.start			= Datum und Uhrzeit des Beginns
	erisDauer		=	Event.Dauer 		= Dauer in Minuten 
	erisBeschreibung=	Event.Beschreibung	= Beschreibung des Termins
	erisTeamID		=	Event.TeamID 		= Team Kürzel
	erisSpiel		=	Event.Spiel			= Spiel j/n
	erisSerie		=	Event.Serie			= Teil einer Terminserie j/n
	erisPlatz		=	Event.Platz			= Platz
	erisPlatzteil	=	Event.Platzteil		= Platzteile Array [1,2,3,4]
	erisDateStart	=	Event.dateStart		= Array [0] = Datum, [1] = Zeit
	.
	 */
function storeEventToObjectData(mID, eEvent) {

	$('#'+mID)
	.data('erisID', eEvent.ID)
	.data('erisStart', eEvent.start)
	.data('erisDauer', eEvent.Dauer)
	.data('erisBeschreibung', eEvent.Beschreibung)
	.data('erisTeamID', eEvent.TeamID)
	.data('erisSpiel', eEvent.TeamID)
	.data('erisSerie', eEvent.TeamID)
	.data('erisPlatz', eEvent.TeamID)
	.data('erisPlatzteil', eEvent.TeamID)
//	.data('erisGroup', eEvent.Team)
	.data('erisDateStart', eEvent.dateStart);


}

	/*********************************************************************************
	Funktion:	readAttributeFromEvent 
	Zweck:		.
	 */
function readAttributeFromEvent(mID, eEvent) {

	eEvent.ID = $('#'+mID).data('erisID');
	eEvent.TeamId = $('#'+mID).data('erisTeamID');
	eEvent.Team = $('#'+mID).data('erisGroup');
	eEvent.dateStart = $('#'+mID).data('erisDateStart' );
	eEvent.Dauer = $('#'+mID).data('erisDauer' );
}

	/*********************************************************************************
	Funktion:	createEventObject 
	Zweck:		.
	 */
function createEventObject (mID, eEvent, real) {
	eEvent.ID = $('#'+mID).data('erisID');	
	eEvent.TeamId = $('#'+mID).text();
    var ww = $('#'+mID).css('width');												// Maße des gedroppten Marker
    var hh = $('#'+mID).css('height');
    ww = parseInt(ww);
    hh = parseInt(hh);
    eEvent.Dauer = pixelToMinutes(hh);												// Minuten aus Pixel berechnet

	var Stunde = real/AnzahlPlatzTeile/AnzahlRasterJeStunde + BeginnZeitLeiste;		// volle Stunde aus Zeile berechnet 
	StundeString = Math.floor(Stunde);												// volle Stunde aus Zeile berechnet 
	
	var xxx = (StundeString- BeginnZeitLeiste) * AnzahlPlatzTeile * AnzahlRasterJeStunde;								
	xxx = real - xxx ;																// 0 - 15tes Platzteilraster innerhalb einer Stunde

	var MinuteString = Math.floor(xxx / AnzahlRasterJeStunde);
	if (MinuteString == 0) MinuteString = '00';
	if (MinuteString == 1) MinuteString = '15';
	if (MinuteString == 2) MinuteString = '30';
	if (MinuteString == 3) MinuteString = '45';

	eEvent.startDate = "13.10.2016%20" + StundeString + "%3A" + MinuteString; 
	eEvent.description = "Training";
	eEvent.field = $('#Platzname').text();
    
}

	/*********************************************************************************
	Funktion:	doEventbutton 
	Zweck:		.
	 */
function doEventbutton() {

	doClearEventbuttons();
	$(document).ready( readAllGroups() );
	$(document).ready( readAllTeams() );
}

function altersKlasse(TeamID) {
	AH = ['AH', 'H1', 'H2'];
	if ( $.inArray(TeamID, AH) > -1) return 'alteHerren';
	
	Ak = ['Ak','1.','2.'];
	if ( $.inArray(TeamID, Ak) > -1) return 'Aktive';
	
	A = ['A','A1','A2'];
	if ( $.inArray(TeamID, A) > -1) return 'A-Junioren';
	
	B = ['B','B1','B2'];
	if ( $.inArray(TeamID, B) > -1) return 'B-Junioren';
	
	C = ['C','C1','C2'];
	if ( $.inArray(TeamID, C) > -1) return 'C-Junioren';
	
	D = ['D','D1','D2','D3','D4','D5'];
	if ( $.inArray(TeamID, D) > -1) return 'D-Junioren';
	
	E = ['E','E1','E2','E3','E4','E5'];
	if ( $.inArray(TeamID, E) > -1) return 'E-Junioren';
	
	F = ['F','F1','F2','F3','F4','F5'];
	if ( $.inArray(TeamID, F) > -1) return 'F-Junioren';
	
	G = ['G','G1','G2','G3','G4','G5'];
	if ( $.inArray(TeamID, G) > -1) return 'G-Junioren';
	
	return '';
}

/*********************************************************************************
Funktion:	doFuss 
Zweck:		Erzeugt eine Fußzeile im Belegungsplan.
*/
function doFuss() {

	$('<div></div>')		
	.addClass('foot')
	.appendTo( '#Container' );

	$('<div>Sammeleimer</div>')		
	.addClass('Sammeleimer')
	.attr( 'id', 'Eimertitel' )
	.appendTo( '#Container' );

	$('<div>Mülleimer</div>')		
	.addClass('Muelleimer')
	.attr( 'id', 'Sammlertitel' )
	.appendTo( '#Container' );

	$('<div>&nbsp</div>')		
	.addClass('Sammeleimer')
	.attr( 'id', 'Sammler' )
	.appendTo( '#Container' );

	$('<div>&nbsp</div>')		
	.addClass('Muelleimer')
	.attr( 'id', 'Eimer' )
	.appendTo( '#Container' );

	$( '#Sammler').droppable({
        drop: function( event, ui ) {				// Funktion, die beim droppen aufgerufen wird

        $(ui.draggable).appendTo( $(this) )			// im Ziel ablegeb
        .css({'top' : 0, 'left' : 0});        		// Position im Ziel oben links
        }
	});
} 

/*********************************************************************************
Funktion:	prevField 
Zweck:		Blättern der Anzeige für Plätze
*/
function prevField() {
	currentField--;
	if (currentField < 0) currentField = fieldAmount-1;
	if (AnzahlPlatzTeile != fieldPortions[currentField]) {
		rebuildPlatzteile(AnzahlPlatzTeile, fieldPortions[currentField]);
		AnzahlPlatzTeile = fieldPortions[currentField];
		doPlatzteilview();
		makePlatzDroppable();
	}

	doClearEvents();
	$( '#Platzname').text(fieldTitle[currentField]);
	setFieldPartTitle(currentField);
}

/*********************************************************************************
Funktion:	nextField 
Zweck:		Blättern der Anzeige für Plätze
*/
function nextField() {
	currentField++;
	if (currentField >= fieldAmount) currentField = 0;
	if (AnzahlPlatzTeile != fieldPortions[currentField]) {
		rebuildPlatzteile(AnzahlPlatzTeile, fieldPortions[currentField]);
		AnzahlPlatzTeile = fieldPortions[currentField];
		doPlatzteilview();
		makePlatzDroppable();
	}
	
	doClearEvents();
	$( '#Platzname').text(fieldTitle[currentField]);
	setFieldPartTitle(currentField);
}

/*********************************************************************************
Funktion:	setFieldPartTitle 
Zweck:		setzt die Plätzteile-Bezeichung für einen Platz
*/
function setFieldPartTitle(a) {
	for ( var pl=0; pl<fieldPortions[a]; pl++) {
		$( '#Platzteil'+pl).text(fieldPartTitle[a][pl]);
	}
}

/*********************************************************************************
Funktion:	rebuildPlatzteile 
Zweck:		Blättern der Anzeige für Plätze
*/
function rebuildPlatzteile(alt, neu) {
	
	$('.PlatzTeil').remove();
	
	$('#Platzleiste').width((PlatzTeilWidth+PlatzTeilMargin)*neu);		// Breite der Platzleiste anpassen

	pid = 0;
	for ( var uhr=BeginnZeitLeiste; uhr<EndeZeitLeiste; uhr=uhr+(1/AnzahlRasterJeStunde)) {
		for ( var pl=0; pl<neu; pl++ ) {
			$('<div></div>')		
			.addClass('PlatzTeil')
			.attr( 'id', pid++)
			.appendTo( '#Platzleiste' )
		}
	}
}

/*********************************************************************************
Funktion:	makeEventMessage 
Zweck:		generiert die Mesage für das xmlHTTP-POST (GET)
*/

function makeEventMessage(id, real) {
	var erisEvent = new Object();
	createEventObject(id, erisEvent, real);
	var ff = erisEvent.field;
	ff = ff.replace(/\s/g,'%20');
	var msg = erisEvent.description + '/' + erisEvent.startDate + '/' + erisEvent.Dauer + '/' + erisEvent.TeamId + '/' + ff;

	return msg;
}

/*********************************************************************************
Funktion:	makeEventUpdateMessage 
Zweck:		generiert die Mesage für das xmlHTTP-POST (GET)

			msg = /12.10.2016%2017%3A00/90/Kunstrasen'
*/

function makeEventUpdateMessage(id, real) {
	var erisEvent = new Object();
	createEventObject(id, erisEvent, real);
	var ff = erisEvent.field;
	ff = ff.replace(/\s/g,'%20');
	var msg = erisEvent.ID + '/' + erisEvent.startDate + '/' + erisEvent.Dauer + '/' + ff;

	return msg;
}

	/*********************************************************************************
	Funktion:	doClearEvents 
	Zweck:		Entfernt alle Eventmarker aus der Ansicht
	 */
function doClearEvents() {
	$('.Marker').remove();
}

/*********************************************************************************
Funktion:	doClearEventbuttons 
Zweck:		Entfernt alle Eventbutton aus der Ansicht
 */
function doClearEventbuttons() {
	$('.Eventbutton').remove();
	$('.Buttongroup').remove();
}

/*********************************************************************************
Funktion:	pixelToMinutes 
Zweck:		rechnet Pixel in Minuten um
 */
function pixelToMinutes(hh) {
	
	return Math.round((hh + MarkerPadding + PlatzTeilMargin)/StundeInPixel*StundeInMinuten);		// Minuten aus Pixel berechnet
}

/*********************************************************************************
Funktion:	pixelToMinutes 
Zweck:		rechnet Minuten in Pixel um
 */
function minutesToPixel(hh) {
	
	return (Math.round( hh / StundeInMinuten  * StundeInPixel)) - MarkerPadding - PlatzTeilMargin; // Pixel aus Minuten berechnet
}

/*********************************************************************************
Funktion:	erisToolTip 
Zweck:		generiert den ToolTip-Inhalt

	erisID 			= 	Event.ID 			= interner Schlüssel
	erisStart		= 	Event.start			= Datum und Uhrzeit des Beginns
	erisDauer		=	Event.Dauer 		= Dauer in Minuten 
	erisBeschreibung=	Event.Beschreibung	= Beschreibung des Termins
	erisTeamID		=	Event.TeamID 		= Team Kürzel
	erisSpiel		=	Event.Spiel			= Spiel j/n
	erisSerie		=	Event.Serie			= Teil einer Terminserie j/n
	erisPlatz		=	Event.Platz			= Platz
	erisPlatzteil	=	Event.Platzteil		= Platzteile Array [1,2,3,4]
	erisDateStart	=	Event.dateStart		= Array [0] = Datum, [1] = Zeit

 */
function erisToolTip(markerID, erisEvent) {
	var tt = 'erisID = ' + erisEvent.ID + '&lt;br&gt;';
	tt += 'erisStart = ' + erisEvent.start + ' ';
	tt += 'erisDauer = ' + erisEvent.Dauer + ' ';
	tt += 'erisBeschreibung = ' + erisEvent.Beschreibung + ' ';
	tt += 'erisTeamID = ' + erisEvent.TeamID + ' ';
	tt += 'erisSpiel = ' + erisEvent.Spiel + ' ';
	tt += 'erisSerie = ' + erisEvent.Serie + ' ';
	tt += 'erisPlatz = ' + erisEvent.Platz + ' ';
	tt += 'erisPlatzteil = ' + erisEvent.Platzteil + ' ';
	tt += 'erisDateStart = ' + erisEvent.dateStart + ' ';

	$('#' + markerID)
	.attr('title', tt )
	.tooltip();
}
