/**
 * 
 * Sportstaetten-Reservierungs-System *
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 * 
 * @description Definition der Klasse "Datumsachse" mit allen Eigenschaften und
 *              Methoden.
 */

/* global $ */
/* global jQuery */
/* global erisMaxFieldsInView */
/* global erisDatum2Wert */
/* global erisBerechneDatum */
/* global erisWert2Datum */
/* global erisPlatzArray */
/* global erisTrace */
/* global erisClear */
/* global erisError */
/* global erisMessage */
/* global erisTracking */
/* global erisTrack */
/* global erisObjectTrace */

/* global Timeline */
/* global ErisEvent */
/* global Platz */


	/**
   * @param angezeigtesDatum =
   *          aktuelles Datum
   * 
   * @description Konstruktor für eine Datumsachse mit Auswahl-Slider.
   * @example Aufrufbeispiel: var timeline = new Datumsachse('30.10.2016');
   */

var Datumsachse = function (angezeigtesDatum) {
	// Pruefe ob der Constructor mit new aufgerufen wurde
	if (!(this instanceof Datumsachse)) {
		return new Datumsachse(angezeigtesDatum);
	}

	// *************************************************************************
	// Beginn der Constructor-Funktion für die Datumsachse
	
	this.angezeigtesDatum = angezeigtesDatum;				// aktuelles Datum
	this.markerNummer = 0;									// initialisiere die Nummerierung der Marker	

	//
	// Ende der Constructor-Funktion für die Datumsachse
	// *************************************************************************
	
	// *************************************************************************
	// Beginn der Definition der Methoden des Objekts auf dem Prototyp

	/**
	 * @description
	 * Mache den Zeitslider sichtbar und lege die obere und untere
	 * Grenze auf heute +/- eine Woche fest.
	*/
	Datumsachse.prototype.jQueryViewTimeline = function(containerId) {
		
		var dt_today = this.angezeigtesDatum;
		var dt_from = erisBerechneDatum(this.angezeigtesDatum,-7);
		var dt_to = erisBerechneDatum(this.angezeigtesDatum, +7);
		
		$('<div/>') // Sliderbereich
		  .attr('id', 'DateSlider')
		  .appendTo('#'+containerId);

		$('<div/>') // Slider
		  .attr('id', 'sliderView')
		  .appendTo('#DateSlider');

		var tod_val = erisDatum2Wert(dt_today);
		var min_val = erisDatum2Wert(dt_from);
		var max_val = erisDatum2Wert(dt_to);

		$("#sliderView").slider({
		  range: false,
		  min: min_val,
		  max: max_val,
		  step: 24*3600,  // ein Tag
		  value: tod_val,
		  
		  slide: function (e, ui) {
			// Achtung: this verweist hier auf das jQuery-Objekt '#sliderView'
			var erisTimeline = $('#sliderView .ui-slider-handle').data('erisTimeline');  // Referenz
																						  // auf
																						  // das
																						  // Objekt-Timeline
			erisTimeline.angezeigtesDatum = erisWert2Datum(ui.value);
			$(ui.handle).text(erisTimeline.angezeigtesDatum);			// neuer
																  // Datumswert im
															  // Schieber
		  },

		  change: function (e, ui) {
			
			// alte Meldungen entfernen 
			erisClear();
			

			// Achtung: this verweist hier auf das jQuery-Objekt '#sliderView'
			var erisTimeline = $('#sliderView .ui-slider-handle').data('erisTimeline');  // Referenz
																						  // auf
																						  // das
																						  // Objekt-Timeline
			$("#sliderView").slider( "option", "min", erisDatum2Wert(erisBerechneDatum(erisTimeline.angezeigtesDatum, -5)) );
			$("#sliderView").slider( "option", "max", erisDatum2Wert(erisBerechneDatum(erisTimeline.angezeigtesDatum, +7)) );
			
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisTimeline',
				  eventAction: 'change date',
				  eventLabel: erisTimeline.angezeigtesDatum
				});

			jQuery.each($('.Marker'), function( index ) {   
			  delete $(this).data('erisEventMarker'); // Lösche das eris-Objekt zum Marker
			  this.remove();   // Lösche das jQueryUI-Objekt zum Marker
			 }); 

			// Lade die Events für die Plaetze
			for (var a = 0; a < erisPlatzArray.length; a++ ) {
				$('#Platz'+erisPlatzArray[a].innerPlatzName).addClass('verschwommen');
				erisTimeline.loadEvents(erisPlatzArray[a].platzName, erisTimeline.angezeigtesDatum);
			}

		  }
		  
		}); // slider
		
		$('#sliderView .ui-slider-handle')
			// Achtung: this verweist hier auf das Objekt Timeline
			.text(this.angezeigtesDatum) // Zeige aktuelles Datum im Schieber an
			.data('erisTimeline', this) // Referenz auf das Timeline-Objekt
			.css('width', '100')
			.css('text-align', 'center');
		
	}; // end jQueryViewTimeline

	/**
	 * @description
	 * Lade die Events für einen Platz zu einem bestimmten Datum
	*/
	Datumsachse.prototype.loadEvents = function(field, datum) {
	  
		var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/field/' + field;
	//	    url += '/time/' + datum + '%2008%3A00/' + datum + '%2022%3A00'; // url mit Datum liefert sporadisch 503
		url = url.replace(/\s/g, '%20'); // maskiere Blank durch %20
		erisClear(); // alte Meldungen leeren
		erisMessage('Lesen der Belegungen läuft...');
	  
		return $.ajax({ type: "GET", url: url, dataType: 'json', crossDomain : true, contentType: 'text/plain' })
		.success(function( responseJson ) {
			erisTrace("ajax loadEvents success");
			erisTrace(url);
			erisClear(); // alte Meldungen leeren
			erisMessage('Lesen der Belegungen erfolgreich.');
			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisMarker',
				  eventAction: 'load success',
				  eventLabel: field + ' ' + datum
				});

			// suche den Platz, für den die Events gerade gelesen werden und mache blur weg
			for (var a = 0; a < erisPlatzArray.length; a++ ) {
				if (field === erisPlatzArray[a].platzName) $('#Platz'+erisPlatzArray[a].innerPlatzName).removeClass('verschwommen');
			}

			if (typeof responseJson !== 'undefined' ) {
				erisObjectTrace(responseJson);
				if (typeof responseJson.items !== 'undefined' && responseJson.items.length>0) {
					for (var a = 0; a < responseJson.items.length; a++) {
						var dat = responseJson.items[a].startTime.split(' ');
						if (dat[0] == Timeline.angezeigtesDatum) {
							Timeline.markerNummer++;  // nächste Markernummer
							var nE = new ErisEvent({
								erisCloudId : responseJson.items[a].id, 
								startTime : responseJson.items[a].startTime, 
								duration : responseJson.items[a].duration,
								description : responseJson.items[a].description,
								team : responseJson.items[a].team,
								match : responseJson.items[a].match,
								partOfSeries : responseJson.items[a].partOfSeries,
								PlatzName : responseJson.items[a].field,
								PlatzteilArray : responseJson.items[a].portion,
								markerNummer : Timeline.markerNummer
								});
							// Marker endDate setzen
							nE.setMarkerDateEnd();
							// Marker anzeigen
							nE.jQueryViewMarker();
						}
					}
				}
			}
		}) // end success
		.error(function( responseJson ) {
			erisTrace(url);
			erisError("ajax loadEvents error: " + responseJson.status + ' - ' + responseJson.statusText );
			erisError("ajax loadEvents error: " + responseJson.responseText );
			erisClear(); // alte Meldungen leeren
			erisMessage('Lesefehler der Belegungen, bitte erneut lesen. ' + responseJson.responseJSON.error.code + ' : ' + responseJson.responseJSON.error.message);

			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisMarker',
				  eventAction: 'load error',
				  eventLabel: field + ' ' + datum
				});

		}); // end error
	}; // end loadEvents

	/**
	 * @description
	 * Lade alle bekannten Plätze
	*/
	Datumsachse.prototype.loadPlaetze = function(timeline) {
		
		jQuery.each($('.Platz'), function( index ) {   
			this.remove();   // Lösche das jQueryUI-Objekt zum Platz
		}); 
		
		var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/field';
		url = url.replace(/\s/g, '%20'); // maskiere Blank durch %20

		erisClear(); // alte Meldungen leeren
		erisMessage('Lesen der Plätze läuft...');
	  
		return $.ajax({ type: "GET", url: url, dataType: 'json', crossDomain : true, contentType: 'text/plain' })
		.success(function( responseJson ) {
			erisTrace("ajax loadPlaetze success");
			erisTrace(url);
			erisClear(); // alte Meldungen leeren
			erisMessage('Lesen der Plätze erfolgreich.');

			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisField',
				  eventAction: 'load success',
				  eventLabel: timeline.angezeigtesDatum
				});


			if (typeof responseJson !== 'undefined' ) {
				erisObjectTrace(responseJson);
				if (typeof responseJson.items != 'undefined' && responseJson.items.length>0) {
					for (var a = 0; a < responseJson.items.length; a++) {
				   
						erisPlatzArray[a] = new Platz(timeline, 	// erzeuge eine Platz mit allen Platzteilen
							  responseJson.items[a].title, 			// Platzname 
							  responseJson.items[a].portionName,	// Kürzel für Platzteile
							  responseJson.items[a].portions);		// Anzahl der Platzteile
						erisPlatzArray[a].jQueryViewPlatz('PlatzContainer', 'PlatzMitteKopf');
					}

					// PlatzMitte anpassen, falls wenigerale 6 Plätze vorhanden sind
					if (responseJson.items.length < erisMaxFieldsInView) {
						var breite = responseJson.items.length * 125 + 5; /* 125px * 6 Plätze + 5px Abstand zwischen den Plätzen */
						$('.PlatzMitte').css('width', breite);	// sichtbarer Bereich für Plätze
						$('.PlatzContainer').css('width', breite);	// unsichbarer Bereich für Plätze -> Scrollbreite
						$('.KopfContainer').css('width', breite);	// sichtbarer Bereich für Platzkoepfe
						$('.PlatzMitteKopf').css('width', breite);	// unsichbarer Bereich für Platzkoepfe -> Scrollbreite
						$('#erisViews').css('width', breite+120);	// gesamter View
					} // end responseJson verarbeiten
				} // end responseJson verfügbar
			}
		}) // end success
		.error(function( responseJson ) {
			erisTrace(url);
			erisError("ajax loadPlaetze error: " + responseJson.status + ' - ' + responseJson.statusText );
			erisError("ajax loadPlaetze error: " + responseJson.responseText );
			erisClear(); // alte Meldungen leeren
			erisMessage('Lesefehler der Plätze, bitte erneut lesen. '  + responseJson.responseJSON.error.code + ' : ' + responseJson.responseJSON.error.message);

			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisField',
				  eventAction: 'load error',
				  eventLabel: timeline.angezeigtesDatum
				});

		}); // end error
	}; // end loadPlaetze

	//
	// Ende der Definition der Methoden des Objekts auf dem Prototyp
	// *************************************************************************
	
}; // end class