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
/* global erisJetzt */

var ErisEvent = function(inOpts) {

		// Pruefe ob der Constructor mit new aufgerufen wurde
		if (!(this instanceof ErisEvent)) {
			return new ErisEvent(inOpts);
		}

		// Default-Werte für ein ErisEvent
		var defaultOpts = {
			duration : 60,
			description : 'Training',
			match : false,
			partOfSeries : false,
			PlatzName : erisLeererPlatz.platzName,
			PlatzteilArray : [1],
			markerNummer : 0,
			anzahlBelegteTeile : 1,
			erstesBelegtesTeil : 1,
			liegtAufPlatz : erisLeererPlatz,
			dateStart : [],
			
			MarkerWidth : erisPlatzWidth - erisPlatzTeilMargin - erisMarkerPadding,
			MarkerMaxWidth : erisPlatzWidth - erisMarkerPadding - erisPlatzTeilMargin,
			MarkerMinHeight : erisMarkerPadding + erisPlatzTeilMargin,
			MarkerHeightjePlatzteil : this.MarkerMinHeight
		};
		
		// erweitere die Eingangsparameter um Default-Werte
		$.extend(this, defaultOpts, inOpts);

		// Platzteilgröße und -position
		if (this.PlatzteilArray.length !== 0 ) {
			this.anzahlBelegteTeile = this.PlatzteilArray.length ;
			this.erstesBelegtesTeil = this.PlatzteilArray[0];
		}
		
		// suche den Platz mit dem PlatzNamen
		this.liegtAufPlatz = erisLeererPlatz; // Default-Platz
		// Suche das Platzobjekt auf dem der Marker liegen soll
		for (var a = 0; a < erisPlatzArray.length; a++) {
			if (erisPlatzArray[a].platzName == this.PlatzName) {
				// Marker liegt auf diesem Platz
				this.liegtAufPlatz = erisPlatzArray[a];		
			}
		}
		
		if(this.startTime) 
		  this.dateStart= this.startTime.split(' ');	// Array [0] = Datum, [1]
		else
		  this.dateStart= [];		// ohne Zeit als leeres Array
		
		// laufende Nummer der Marker innerhalb eines Platzes
		this.mid = this.markerNummer;	// Nummerierung der Marker
		
		// Platzkonstanten
		this.MarkerMinWidth = this.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
		this.MarkerMaxHeight = (this.liegtAufPlatz.bis - this.liegtAufPlatz.von) * 4 * erisMarkerHeightViertelstunde;

		// *****************************************************************************
		// Methoden des Objekts auf dem Prototyp

		ErisEvent.prototype.jQueryViewMarker = function() {
			
			this.jQueryShowMarker(); // zeige den Maker an
			this.jQueryDraggableMarker(); // mache den Marker beweglich
			this.jQueryResizeableMarker(); // mache den Marker in der Größe
											// änderbar
			this.jQueryClickMarker(); // mache den Marker klickbar
			this.jQueryQtipMarker(); // verpasse dem Marker einen ToolTip
		
		
		} // end jQueryViewMarker
		
		ErisEvent.prototype.jQueryShowMarker = function() {
		
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
		} // end jQueryShowMarker
		
		ErisEvent.prototype.jQueryDraggableMarker = function() {
			var markerID = this.team + this.mid;
			$('#' + markerID)
			.draggable({ containment : 'window' })
			.draggable("option", "revert", "invalid")
			.draggable("option", "cursorAt", { left: 0, top: 0 });
		} // end jQueryDraggableMarker
			
		ErisEvent.prototype.jQueryResizeableMarker = function() {
			var markerID = this.team + this.mid;
			
			$('#' + markerID)
			.resizable({
				stop: function(event, ui) {
					// Achtung: this verweist hier auf das jQuery-Objekt 'Marker'
					var erisEventMarker = $(this).data('erisEventMarker');
					
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
					
					if (hoehe !== aktHoehe) erisTrace('class ErisEvent - resize - neue Höhe = ' 
									+ hoehe + ' AnzRaster = ' + anzRaster);
					
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
		} // end jQueryResizeableMarker
		
		/**
		* click Event-Handler für den Marker erzeugen
		*/
		ErisEvent.prototype.jQueryClickMarker = function() {
			var markerID = this.team + this.mid;
			$('#'+markerID).click(function() {
			  erisTrace('jQueryClickMarker - klick');
			});
		}
		
		/**
		* qTip für den Marker erzeugen
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
			
		} // end jQueryQtipMarker
			
		
		/**
		 * berechnet die belegten Platzteile
		 */
		ErisEvent.prototype.setBelegtePlatzteile = function() {
			var ebt = this.erstesBelegtesTeil;
			if (this.anzahlBelegteTeile === 1) this.PlatzteilArray = [ebt];
			if (this.anzahlBelegteTeile === 2) this.PlatzteilArray = [ebt, ebt+1];
			if (this.anzahlBelegteTeile === 3) this.PlatzteilArray = [ebt, ebt+1, ebt+2];
			if (this.anzahlBelegteTeile === 4) this.PlatzteilArray = [ebt, ebt+1, ebt+2, ebt+3];
			return;
		}
		
		/**
		 * rechnet Minuten in Pixel um
		 */
		ErisEvent.prototype.minutesToPixel = function(hh) {
			const StundeInMinuten = 60;
			const StundeInPixel = 28;
			return (Math.round(hh / StundeInMinuten * StundeInPixel)) - 
				erisMarkerPadding - erisPlatzTeilMargin; 
		}
		
		/**
		 * 
		 * rechnet Pixel in Minuten um
		 */
		ErisEvent.prototype.pixelToMinutes = function(hh) {
			const StundeInMinuten = 60;
			const StundeInPixel = 28;
			const PlatzTeilMargin = 1;
			var anzVirtelstunden = Math.round((hh + erisMarkerPadding + erisPlatzTeilMargin) / 
							(erisMarkerHeightViertelstunde + 1)); 
			erisTrace('class ErisEvent - pixelToMinutes - Höhe = ' + hh + ' anzVirtelstunden = ' + anzVirtelstunden);
			return anzVirtelstunden*15;
		}
		
		ErisEvent.prototype.setMarkerWidth = function(ui) {
			var breite = this.anzahlBelegteTeile * this.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
			breite += this.anzahlBelegteTeile * erisPlatzTeilMargin;
			// Markergröße setzen
			$(ui.draggable).css({'width' : breite}); 
		}
		
		ErisEvent.prototype.erisToolTip = function() {
		//		erisTrace('erisToolTip - Beginn');
			var tt = '';
			if (this.PlatzName) tt += 'erisPlatz = ' + this.PlatzName + '<br\>';
			if (this.startTime) tt += 'erisStart = ' + this.startTime + '<br\>';
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
			
		//		erisTrace('erisToolTip - Ende');
			return tt;
		}
		
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
		}
		
		/**	
		 * Marker speichern ueber Endpoints:
			var urlSave = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/addEvent/';
			var urlUpdate =	'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/update/';
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
		
		  		if (typeof responseJson !== 'undefined' ) { // bei update gibt es keine Antwort
		  			// ID des gespeicherten erisObjekt aus der Cloud merken
		  			newMarkerNummer = responseJson.id;
		  		}
		    	erisMessage('Speichern erfolgreich.');
			})
		    .error(function( responseJson ) {
		    	erisTrace(url);
		    	erisError("ajax erisEvent store error: " + responseJson.status + ' - ' + responseJson.statusText );
		    	erisError("ajax erisEvent store error: " + responseJson.responseText);
		    	erisMessage('Speicherfehler, bitte erneut lesen und wiederholen.');
		    });
			
			if (typeof newMarkerNummer !== undefined) {
				this.erisCloudId = newMarkerNummer;
				this.jQueryQtipMarker();
			}
		} // end store

} // end class ErisEvent

