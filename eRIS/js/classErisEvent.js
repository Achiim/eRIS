/**
 * 
 * Sportstaetten-Reservierungs-System 
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 * 
 * @description Definition der Klasse "Datumsachse" mit allen Eigenschaften und
 *              Methoden.
 */

/* global $ */
/* global erisTrace */
/* global erisClear */
/* global erisError */
/* global erisMessage */
/* global erisPlatzArray */
/* global erisAnzahlPlatzTeilejeStunde */
/* global erisPlatzWidth */
/* global erisPlatzTeilMargin */
/* global erisMarkerPadding */
/* global erisMarkerHeightViertelstunde */
/* global erisLeererPlatz */
/* global erisTracking */
/* global erisTrack */
/* global erisTagesname */
/* global erisMonatsname */

var ErisEvent = function(inOpts) {

		// Pruefe ob der Constructor mit new aufgerufen wurde
		if (!(this instanceof ErisEvent)) {
			return new ErisEvent(inOpts);
		}

	// *****************************************************************************
	// Beginn der Constructor-Funktion für das ErisEvent
	
		// Default-Werte für ein ErisEvent
		var defaultOpts = {
			duration :					60,
			description :				'Training',
			match : 					false,
			partOfSeries :				false,
			PlatzName : 				erisLeererPlatz.platzName,
			PlatzteilArray :			[1],
			markerNummer :				0,
			anzahlBelegteTeile :		1,
			erstesBelegtesTeil :		1,
			liegtAufPlatz : 			erisLeererPlatz,
			dateStart : 				[],

			// Konstanten
			MarkerWidth :				erisPlatzWidth - erisPlatzTeilMargin - erisMarkerPadding,
			MarkerMaxWidth :			erisPlatzWidth - erisMarkerPadding - erisPlatzTeilMargin,
			MarkerMinHeight :			erisMarkerPadding + erisPlatzTeilMargin,
		};
		
		// erweitere die Default-Werte
		$.extend(defaultOpts, {
			// Platzkonstanten berechnen
			MarkerHeightjePlatzteil :	defaultOpts.MarkerMinHeight,
			MarkerMinWidth : 			defaultOpts.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding,
			MarkerMaxHeight :			(defaultOpts.liegtAufPlatz.bis - defaultOpts.liegtAufPlatz.von) * 4 * erisMarkerHeightViertelstunde
		});

		// erweitere die Eingangsparameter um Default-Werte
		$.extend(this, defaultOpts, inOpts);

		// laufende Nummer der Marker innerhalb eines Platzes
		this.mid = this.markerNummer;
		
		// Platzteilgröße und -position
		if (this.PlatzteilArray.length !== 0 ) {
			this.anzahlBelegteTeile = this.PlatzteilArray.length ;
			this.erstesBelegtesTeil = this.PlatzteilArray[0];
		}
		
		// Suche den Platz, auf dem der Marker liegt
		for (var a = 0; a < erisPlatzArray.length; a++) {
			if (erisPlatzArray[a].platzName == this.PlatzName) {
				// Marker liegt auf diesem Platz
				this.liegtAufPlatz = erisPlatzArray[a];		
			}
		}
		
		if(this.startTime) 
			// Spalte die Beginnzeit auf in Array[0] = Datum, Array[1] = Uhrzeit
			this.dateStart= this.startTime.split(' ');	
		else
			// falls noch kein Beginn feststeht -> leeres Array 
			this.dateStart= [];	
	//
	// Ende der Constructor-Funktion für das ErisEvent
	// *************************************************************************
	
	// *************************************************************************
	// Beginn der Definition der Methoden des Objekts auf dem Prototyp

		/**
		 * @description
		 * Mache den Marker sichtbar und statte ihn mit der nötigen 
		 * "Dekoration" aus.
		*/
		ErisEvent.prototype.jQueryViewMarker = function() {
			this.jQueryShowMarker();		// Maker anzeigen
			this.jQueryDraggableMarker();	// Marker beweglich machen
			this.jQueryResizeableMarker();	// Marker-Größe änderbar machen
			this.jQueryClickMarker();		// Marker klickbar machen
			this.jQueryQtipMarker();		// Marker einen ToolTip verpassen
		}; // end jQueryViewMarker
		
		/**
		 * @description
		 * Mache den Marker sichtbar 
		*/
		ErisEvent.prototype.jQueryShowMarker = function() {
		
			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisMarker',
				  eventAction: 'show',
				  eventLabel: 'existing Event'
				});
			
			this.MarkerWidth = this.anzahlBelegteTeile * this.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
			this.MarkerWidth += this.anzahlBelegteTeile * erisPlatzTeilMargin;
			
			var hoehe = this.minutesToPixel(this.duration);
			var breite = this.MarkerWidth;
			var markerID = this.team + this.mid;
			
			$('<div>' + this.team + '</div>')
			.addClass(this.altersKlasse(this.team) + ' Marker')
			.attr('id', markerID)
			.height(hoehe)
			.width(breite)
			.data('erisEventMarker', this)
			.appendTo('#Container'); // in den Sammler legen
			
			// falls der Marker schon auf enem Platz liegt, das richtige
			// Platzteil finden und den Marker dort ablegen
			if (this.liegtAufPlatz.timeline != null) {
		
				var dateStart = this.startTime.split(' ');
				
		  		// relativer Start auf der Zeitachse = 
		  		// aktuelle Stunde (hour) - Beginn der Zeitleiste (liegtAufPlatz.von)
		  		var hour = parseInt(dateStart[1].split(':')[0], 10) - this.liegtAufPlatz.von; 
		  		// Platzteil im 15 Minutenraster
		  		var minute = parseInt(dateStart[1].split(':')[1], 10);
		  		if (minute == 15) minute = 1;
		  		if (minute == 30) minute = 2;
		  		if (minute == 45) minute = 3;
		  			
		  		// berechne die ID des Platzteil, in dem der Marker abgelegt werden soll
		  		var Teil = (hour * erisAnzahlPlatzTeilejeStunde * this.liegtAufPlatz.anzahlTeile) 
		  				+ (minute * this.liegtAufPlatz.anzahlTeile) + this.erstesBelegtesTeil - 1;
		
		
				$('#' + markerID) // Marker auf den Platz legen
				.appendTo('#'+ Teil + this.liegtAufPlatz.innerPlatzName); 
			}
		}; // end jQueryShowMarker
		
		/**
		 * @description
		 * Mache den Marker beweglich
		*/
		ErisEvent.prototype.jQueryDraggableMarker = function() {
			var markerID = this.team + this.mid;
			$('#' + markerID)
			.draggable({ containment : 'window' })
			.draggable("option", "revert", "invalid")
			.draggable("option", "cursorAt", { left: 0, top: 0 });
		}; // end jQueryDraggableMarker
			
		/**
		 * @description
		 * Mache die Marker-Größe änderbar
		*/
		ErisEvent.prototype.jQueryResizeableMarker = function() {
			var markerID = this.team + this.mid;
			
			$('#' + markerID)
			.resizable({
				stop: function(event, ui) {
					
					// erisTrack
					if (erisTracking) erisTrack('send', {
						  hitType: 'event',
						  eventCategory: 'erisMarker',
						  eventAction: 'resize',
						  eventLabel: 'existing Event'
						});

					erisTrace('class ErisEvent - resize stop - neue Höhe = ' + 
							ui.size.height + ' neue Breite = ' + ui.size.width);
						
					// Achtung: this verweist hier auf das jQuery-Objekt 'Marker'
					var erisEventMarker = $(this).data('erisEventMarker');
					
					// Marker endDate setzen
					erisEventMarker.setMarkerDateEnd();
					
					// ToolTip aktualisieren
					erisEventMarker.jQueryQtipMarker();

					// speichere den geänderten Marker
					erisEventMarker.store();
				},
				
				resize: function(event, ui) {


					// Achtung: this verweist hier auf das jQuery-Objekt 'Marker'
					var erisEventMarker = $(this).data('erisEventMarker');
					
					// ermittle die Anzahl der vom Marker belegten Platzteile
					// ------------------------------------------------------
					var maxBreite = (erisPlatzWidth / erisEventMarker.liegtAufPlatz.anzahlTeile) - erisMarkerPadding;
					var anzTeile = Math.round(ui.size.width / maxBreite);
					if (anzTeile <= 0) anzTeile=1;
					if (anzTeile > erisEventMarker.liegtAufPlatz.anzahlTeile) anzTeile=erisEventMarker.liegtAufPlatz.anzahlTeile;
					erisEventMarker.anzahlBelegteTeile = anzTeile;
					
					
					// aktualisiere die Markerbreite schrittweise
					var breite = anzTeile * erisEventMarker.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
					breite += anzTeile * erisPlatzTeilMargin;
					
					if (breite < erisEventMarker.liegtAufPlatz.MarkerMinWidth)
						ui.size.width = erisEventMarker.liegtAufPlatz.MarkerMinWidth;
					else
						ui.size.width = breite;
					
					if (breite > erisEventMarker.liegtAufPlatz.MarkerMaxWidth)
						ui.size.width = erisEventMarker.liegtAufPlatz.MarkerMaxWidth;
					else
						ui.size.width = breite;
					
					// aktualisiere die Markerhoehe schrittweise
					var minHoehe = erisMarkerHeightViertelstunde;
					var aktHoehe = ui.size.height;
					var anzRaster = Math.round(aktHoehe / minHoehe) + 1; // 
					var hoehe = anzRaster * minHoehe + anzRaster - (erisMarkerPadding + erisPlatzTeilMargin);
					
//					if (hoehe !== aktHoehe) erisTrace('class ErisEvent - resize - neue Höhe = ' 
//									+ hoehe + ' AnzRaster = ' + anzRaster);
					
					if (hoehe < minHoehe)
						ui.size.height = minHoehe;
					else
						ui.size.height = hoehe;
					
					if (hoehe > erisEventMarker.MarkerMaxHeigth)
						ui.size.height = erisEventMarker.MarkerMaxHeigth;
					else
						ui.size.height = hoehe;
					
					// belegte Platzteile ermitteln
					erisEventMarker.setBelegtePlatzteile();
					
					// berechne die neue Dauer des Event
					erisEventMarker.duration = erisEventMarker.pixelToMinutes(hoehe); 
					
					// ToolTip aktualisieren
					erisEventMarker.jQueryQtipMarker();
					
				} // end resize
			
			}); // resizeable
		}; // end jQueryResizeableMarker
		
		/**
		 * @description
		 * Mache den Marker klickbar
		*/
		ErisEvent.prototype.jQueryClickMarker = function() {
			var markerID = this.team + this.mid;
			$('#'+markerID).click(function() {
			erisTrace('jQueryClickMarker - klick');
			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisMarker',
				  eventAction: 'click',
				  eventLabel: 'existing Event'
				});
			});
		}; // end jQueryClickMarker
		
		/**
		 * @description
		 * Versehe den Marker mit einem ToolTip
		*/
		ErisEvent.prototype.jQueryQtipMarker = function() {
			
			var markerID = this.team + this.mid;
			var markup = this.erisToolTip();
			$('#'+markerID).qtip({ // Grab some elements to apply the tooltip to
				content: {
					title: this.team,
					text: markup
				},
				position: {
					my: 'top left',
					at: 'bottom right'
				},
				style: {
					classes: 'qtip-dark qtip-shadow'
				}
			});
			
		}; // end jQueryQtipMarker
			
		
		/**
		 * berechnet die belegten Platzteile
		 */
		ErisEvent.prototype.setBelegtePlatzteile = function() {
			var ebt = this.erstesBelegtesTeil;
			if (this.anzahlBelegteTeile === 1) this.PlatzteilArray = [ebt];
			if (this.anzahlBelegteTeile === 2) this.PlatzteilArray = [ebt, ebt+1];
			if (this.anzahlBelegteTeile === 3) this.PlatzteilArray = [ebt, ebt+1, ebt+2];
			if (this.anzahlBelegteTeile === 4) this.PlatzteilArray = [ebt, ebt+1, ebt+2, ebt+3];
			if (this.anzahlBelegteTeile > 4 || this.anzahlBelegteTeile < 1 )
				erisError("Anzahl belegbarer Platzteile nicht unterstützt. Aktueller Wert = " +
						this.anzahlBelegteTeile);
			return;
		}; // end setBelegtePlatzteile
		
		/**
		 * rechnet Minuten in Pixel um
		 */
		ErisEvent.prototype.minutesToPixel = function(hh) {
			const StundeInMinuten = 60;
			const StundeInPixel = 28;
			return (Math.round(hh / StundeInMinuten * StundeInPixel)) - 
				erisMarkerPadding - erisPlatzTeilMargin; 
		}; // end minutesToPixel
		
		/**
		 * 
		 * rechnet Pixel in Minuten um
		 */
		ErisEvent.prototype.pixelToMinutes = function(hh) {
			var anzVirtelstunden = Math.round((hh + erisMarkerPadding + erisPlatzTeilMargin) / 
							(erisMarkerHeightViertelstunde + 1)); 
//			erisTrace('class ErisEvent - pixelToMinutes - Höhe = ' + hh + ' anzVirtelstunden = ' + anzVirtelstunden);
			return anzVirtelstunden*15;
		}; // end pixelToMinutes
		
		/**
		 * 
		 * setze die Markerbreite
		 */
		ErisEvent.prototype.setMarkerWidth = function(ui) {
			var breite = this.anzahlBelegteTeile * this.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
			breite += this.anzahlBelegteTeile * erisPlatzTeilMargin;
			// Markergröße setzen
			$(ui.draggable).css({'width' : breite}); 
		}; // end setMarkerWidth
		
		/**
		 * 
		 * setze die Markerhöhe
		 */
		ErisEvent.prototype.setMarkerHeight = function(ui) {
			var hoehe = this.minutesToPixel(this.duration);
			// Markerhöhe setzen
			$(ui.draggable).css({'height' : hoehe}); 
		}; // end setMarkerHeight
		
		/**
		 * 
		 * setze die Marker-Endedatum
		 */
		ErisEvent.prototype.setMarkerDateEnd = function(ui) {
			var uhrzeit = this.dateStart[1];
			var uu = uhrzeit.split(':'); // hh:mm
			var hh = parseInt(uu[0], 10);
			var mm = parseInt(uu[1], 10);

			var dh = Math.floor(this.duration/erisMinutenJeStunde);
			var dm = Math.floor(this.duration%erisMinutenJeStunde);
			
			hh += dh;
			mm += dm;
			if (mm === 0) mm = '00';
			
			// Stundenübertrag berücksichtigen
			if (mm === 60) {
				hh++;
				mm = '00';
			}
			
			uhrzeit = hh + ':' + mm;
			
			// Markerendedatum setzen
			this.endTime = this.dateStart[0] + ' ' + uhrzeit; 
			this.dateEnd = [];
			this.dateEnd[0] = this.dateStart[0]; 
			this.dateEnd[1] = uhrzeit; 
			
		}; // end setMarkerHeight
		
		/**
		 * 
		 * baue den ToolTip-Inhalt zusammen
		 */
		ErisEvent.prototype.erisToolTip = function() {
			//	erisTrace('erisToolTip - Beginn');
			
			// Tag aus Datum extrahieren
			var dd = this.dateStart[0].split('.'); // tt.mm.jjjj
			var tag = parseInt(dd[0], 10);

			
			var tt = '';
			tt += "<div id='Kalenderblatt'>" + 
					"<div id='Tagname'>" + erisTagesname(this.dateStart[0]) + "</div>" +
					"<div id='Tag'>" + tag + "</div>" + 
					"<div id='Monat'>" + erisMonatsname(this.dateStart[0]) + "</div></div>";
			if (this.PlatzName) tt += 'erisPlatz = ' + this.PlatzName + '<br\>';
			if (this.startTime) tt += 'erisStart = ' + this.startTime + '<br\>';
			if (this.endTime) tt += 'erisEnde = ' + this.endTime + '<br\>';
			if (this.duration) tt += 'erisDauer = ' + this.duration + ' Minuten<br\>';
			if (this.description) tt += 'erisBeschreibung = ' + this.description + '<br\>';
			// if (this.team) tt += 'erisTeamID = ' + this.team + '<br\>';
			if (this.match) tt += 'erisSpiel = ' + this.match + '<br\>';
			if (this.partOfSeries) tt += 'erisSerie = ' + this.partOfSeries + '<br\>';
			if (this.PlatzteilArray) tt += 'erisPlatzteil = ' + this.PlatzteilArray + '<br\>';
			if (this.anzahlBelegteTeile) tt += 'erisAnzahlBelegteTeile = ' + this.anzahlBelegteTeile + '<br\>'; 
			// if (this.dateStart) tt += 'erisDateStart = ' + this.dateStart;
			if (this.erstesBelegtesTeil) tt += 'erstesBelegtesTeil = ' + this.erstesBelegtesTeil + '<br\>';
			if (this.erisCloudId) tt += 'erisID = ' + this.erisCloudId;
			
			// erisTrace('erisToolTip - Ende');
			return tt;
		}; // end erisToolTip
		
		/**
		 * Hilfsfunktion, solange die Daten nicht aus der DB kommen
		 * 
		 * @param TeamID
		 * @returns Bezeichnung der Alterklasse
		 */
		ErisEvent.prototype.altersKlasse = function(TeamID) {
		//		erisTrace('altersKlasse - Beginn/Ende');
		
			var AH = ['AH', 'H1', 'H2'];
			if ($.inArray(TeamID, AH) > -1) return 'alteHerren';
		
			var Ak = ['Ak', '1.', '2.'];
			if ($.inArray(TeamID, Ak) > -1) return 'Aktive';
		
			var A = ['A', 'A1', 'A2', 'AM'];
			if ($.inArray(TeamID, A) > -1) return 'A-Junioren';
		
			var B = ['B', 'B1', 'B2', 'BM'];
			if ($.inArray(TeamID, B) > -1) return 'B-Junioren';
		
			var C = ['C', 'C1', 'C2', 'CM'];
			if ($.inArray(TeamID, C) > -1) return 'C-Junioren';
		
			var D = ['D', 'D1', 'D2', 'D3', 'D4', 'D5', 'DM'];
			if ($.inArray(TeamID, D) > -1) return 'D-Junioren';
		
			var E = ['E', 'E1', 'E2', 'E3', 'E4', 'E5', 'EM'];
			if ($.inArray(TeamID, E) > -1) return 'E-Junioren';
		
			var F = ['F', 'F1', 'F2', 'F3', 'F4', 'F5'];
			if ($.inArray(TeamID, F) > -1) return 'F-Junioren';
		
			var G = ['G', 'G1', 'G2', 'G3', 'G4', 'G5'];
			if ($.inArray(TeamID, G) > -1) return 'G-Junioren';
		
			return '';
		}; // end altersKlasse
		
		/**	
		 * @description
		 * Marker speichern ueber Endpoints:
		 *	var urlSave = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/addEvent/';
		 *	var urlUpdate =	'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/update/';
		*/	
		ErisEvent.prototype.store = function() {
			var url = '';
			var msg = '';
		  
			if (this.erisCloudId === null || this.erisCloudId === undefined) {
				url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/addEvent/';
				msg = this.description + '/' + this.startTime + '/' + this.duration + '/' + this.team + '/' + this.PlatzName + '/' + this.PlatzteilArray;
			} else {
				url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/update/';
				msg = this.erisCloudId + '/' + this.startTime + '/' + this.duration + '/' + this.PlatzName + '/' + this.PlatzteilArray;
			}
			msg = msg.replace(/\s/g, '%20'); // maskiere Blank durch %20
			msg = msg.replace(/\./g, '%2E'); // maskiere . durch %2E
			msg = msg.replace(/\s/g, '%20'); // maskiere Blank durch %20
			msg = msg.replace(/\:/g, '%3A'); // maskiere : durch %3A
			msg = msg.replace(/\,/g, '%2B'); // ersetzte Komma durch %2B
			
			url += msg;
			
			var newMarkerNummer;
			
			erisClear();
			
			$.ajax({ type: "GET", url: url, dataType: 'json'})
		
			.success(function( responseJson ) {
				erisTrace("ajax erisEvent store success");
				erisTrace(url);
				
				var urlArray = url.split('/');
					
		  		if (typeof responseJson !== 'undefined' ) { // bei update gibt es keine Antwort
		  			// ID des gespeicherten erisObjekt aus der Cloud merken
		  			newMarkerNummer = responseJson.id;
		  		}
		    	erisMessage('Speichern erfolgreich.');
		    	
		    	if (urlArray[8] === 'update') {
					// erisTrack
			    	if (erisTracking) erisTrack('send', {
						  hitType: 'event',
						  eventCategory: 'erisMarker',
						  eventAction: 'update success',
						  eventLabel: urlArray[11]			// Team
						});
		    	} else {
					// erisTrack
			    	if (erisTracking) erisTrack('send', {
						  hitType: 'event',
						  eventCategory: 'erisMarker',
						  eventAction: 'store success',
						  eventLabel: urlArray[11]			// Team
						});
		    	}

			})
		    .error(function( responseJson ) {
				var urlArray = url.split('/');
		    	erisTrace(url);
		    	erisError("ajax erisEvent store error: " + responseJson.status + ' - ' + responseJson.statusText );
		    	erisError("ajax erisEvent store error: " + responseJson.responseText);
		    	erisMessage('Speicherfehler, bitte erneut lesen und wiederholen. ' + responseJson.responseJSON.error.code + ' : ' + responseJson.responseJSON.error.message );

		    	if (urlArray[8] === 'update') {
			    	// erisTrack
			    	if (erisTracking) erisTrack('send', {
						  hitType: 'event',
						  eventCategory: 'erisMarker',
						  eventAction: 'update error',
						  eventLabel: msg
						});
		    	} else {
			    	// erisTrack
			    	if (erisTracking) erisTrack('send', {
						  hitType: 'event',
						  eventCategory: 'erisMarker',
						  eventAction: 'store error',
						  eventLabel: msg
						});
		    	}
		    });
			
			if (newMarkerNummer !== undefined) {
				this.erisCloudId = newMarkerNummer;
				this.jQueryQtipMarker();
			}
		}; // end store
		
	//
	// Ende der Definition der Methoden des Objekts auf dem Prototyp
	// *************************************************************************

}; // end class ErisEvent