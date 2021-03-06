/**
 * 
 * Sportstaetten-Reservierungs-System
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 * 
 * @description Definition der Klasse "Platz" mit allen Eigenschaften und
 *              Methoden.
 */
 
/* global $ */
/* global erisAnzahlPlatzTeilejeStunde */
/* global erisPlatzWidth */
/* global erisPlatzTeilMargin */
/* global erisMarkerPadding */
/* global erisPlatzteilHeight */
/* global erisTrace */
/* global ErisEvent */
/* global erisTrace */
/* global erisTracking */
/* global erisTrack */


/**
* Klasse Platz
* ============
* @param platzName = Bezeichung des Platzes
* @param teilBezeichung = Kurzbezeichung für Platzteile
* @param anzahlTeile = Anzahl der reservierbaren Platzteile
* 
* @description Konstruktor für ein Platzobjekt.
* @example Aufrufbeispiel: var kunstrasen = new Platz('Kunstrasen', 'K', 2);
*/
var Platz = function(timeline, platzName, teilBezeichung, anzahlTeile) {
	// Pruefe ob der Constructor mit new aufgerufen wurde
	if (!(this instanceof Platz)) {
		return new Platz(timeline, platzName, teilBezeichung, anzahlTeile);
	}
	
	this.timeline = timeline;			// Referenz auf den TimeSlider mit dem
										// aktuellen Datum
	this.platzName = platzName;			// Bezeichnung des Platzes
	this.innerPlatzName = platzName
				   .replace(/\s/g, ''); // ohne Blanks
	this.platzteilNummer = 0;			// Nummerierung der Platzteile auf dem
										// Platz
	this.teilBezeichung = teilBezeichung;	
	this.anzahlTeile  = anzahlTeile;	// Anzahl der reservierbaren
										// Platzteile je Zeiteinheit
	this.platzfarbe = 'green';			// default Farbe des Platzes
	this.von = 8;                       // Anzeige ab 8:00 Uhr
	this.bis = 22;                      // Anzeige bis 22:00 Uhr

	// Breiten für Platzteile und kleinste Marker bestimmen
	// ----------------------------------------------------
	this.PlatzTeilWidth = erisPlatzWidth / this.anzahlTeile - erisPlatzTeilMargin; 
	this.MarkerMinWidth = this.PlatzTeilWidth - erisMarkerPadding;

};
/**
* Methoden der Klasse Platz
* =========================
* 
*/

Platz.prototype.jQueryViewPlatz = function(containerId, PlatzKopfId) {
		
	// erzeuge die jQueryUI-Elemente für den Platzkopf
	// -----------------------------------------------
	this.jQueryPlatzkopf(PlatzKopfId);

	// erzeuge die jQueryUI-Elemente für den Platz und die Platzteile
	// -----------------------------
	this.jQueryPlatz(containerId);

}; // end jQueryViewPlatz

Platz.prototype.jQueryPlatzkopf = function jQueryUI_Platzkopf(PlatzKopfId) {
	/***************************************************************************
	 * Platzkopfdaten = Platzname und Platzteilbezeichungen
	 **************************************************************************/

	// Container für Platzkopfbeschriftungen
	// ------------------------------------
	$('<div/>') // Container 1
		.attr('id', 'Kopf' + this.innerPlatzName)
		.addClass('Platzteile')
		.addClass('Platzkopfart' + this.anzahlTeile) // steuert die Textur des Platzkopfes
		.appendTo('#'+PlatzKopfId);

	// Beschriftung des Platzes
	// ------------------------
	$('<div/>')
		.addClass('Platzname')
		.attr('id', 'Platzname'+ this.innerPlatzName)
		.css('width', erisPlatzWidth)
		.html(this.platzName)
		.appendTo('#Kopf' + this.innerPlatzName);

	// Container für Platzteilbeschriftungen
	// ------------------------------------
	$('<div/>') // Container 2
		.attr('id', 'Platzteile' + this.innerPlatzName)
		.appendTo('#Kopf' + this.innerPlatzName);

	// Platzteilbeschriftungen
	// ------------------------------------
	for (var pl = 0; pl < this.anzahlTeile; pl++) {
		var ptn = this.teilBezeichung;
		var pz=pl+1;
		$('<div>' + ptn + pz + '</div>') // neue Bezeichung der
										 // Platzteile erzeugen
			.addClass('PlatzKopfTeil')
			.attr('id', 'PlatzKopfTeil' +  this.innerPlatzName)
			.css('width', this.PlatzTeilWidth)
			.appendTo('#Platzteile' +  this.innerPlatzName);
	}

}; // end jQueryPlatzkopf

Platz.prototype.jQueryPlatz = function jQueryUI_Platz(containerId) {

	/***************************************************************************
	 * Platz und Platzteile
	 **************************************************************************/
	// Platz
	// ------------------------
	$('<div/>')
		.addClass('Platz')
		.addClass('Platzart' + this.anzahlTeile) // steuert die Textur des Platzes
		.attr('id', 'Platz'+ this.innerPlatzName)
		.appendTo('#'+containerId);

	// Breite des Platz-Containers festlegen
	// --------------------------------------
	$('#Platz' + this.innerPlatzName).width(erisPlatzWidth); // Breite des
												// Platzes anpassen

	// erzeuge das Belegungsraster im Platz
	// ------------------------------------
	for (var uhr = this.von * erisAnzahlPlatzTeilejeStunde; uhr < this.bis * erisAnzahlPlatzTeilejeStunde; uhr++) {
		for (var pl = 0; pl < this.anzahlTeile; pl++) {
			new Platzteil(this.platzteilNummer++, this, pl+1).jQueryViewPlatzteil(); // erzeuge neues Platzteil und
												// zeige es an
		}
	}

}; // end jQueryPlatz


// ********************************************************************************************

/**
* Klasse Platzteil
* ================
* @param platzteilNummer = lfd. Nummer des zu erzeugenden Platteils
* @param platz = Referenz auf das Platz-Objekt zu em das Teil gehört
* @param pl = Teilnummer des Platzes (1 ... anzahlTeile), entspricht dem ersten reservierten Platzteil
* 
* @description Konstruktor für ein Platzteilobjekt.
* @example Aufrufbeispiel: new Platzteil(12, Platz).jQueryViewPlatzteil();
*/
  
var Platzteil = function(platzteilNummer, platz, platzSpalte) {
	// Pruefe ob der Constructor mit new aufgerufen wurde
	if (!(this instanceof Platzteil)) {
		return new Platzteil(platzteilNummer, platz, platzSpalte);
	}
	
    this.platzteilNummer = platzteilNummer; // Nummerierung der Platzteile
    this.platz = platz;                     // Referenz auf das Platz-Objekt, zu dem das
                                            // Platzteil gehört
    this.platzSpalte = platzSpalte;         // Teilnummer des Platzes (1 ... anzahlTeile)
    
    // start-Stunde
    var Stunde = platzteilNummer / platz.anzahlTeile / erisAnzahlPlatzTeilejeStunde + platz.von; 
    var vonStunde = Math.floor(Stunde); // volle Stunde aus Zeile berechnet
    vonStunde = ('00' + vonStunde).slice(-2); // mit führenden Nullen

    // start-Minute
    var Minute = (vonStunde - platz.von) * platz.anzahlTeile * erisAnzahlPlatzTeilejeStunde;
    Minute = platzteilNummer - Minute; // 0 - 15tes Platzteilraster innerhalb einer Stunde

    var vonMinute = Math.floor(Minute / platz.anzahlTeile);
    if (vonMinute === 0) vonMinute = '00';
    if (vonMinute === 1) vonMinute = '15';
    if (vonMinute === 2) vonMinute = '30';
    if (vonMinute === 3) vonMinute = '45';

    this.von = vonStunde + ':' + vonMinute;

}; // end class Platzteil

/**
* Methoden der Klasse Platzteil
* =============================
* 
*/
Platzteil.prototype.jQueryViewPlatzteil = function() {
	// erzeuge ein Platzteil mit Referenz auf den Platz
	// ------------------------------------------------
	$('<div/>')
		.addClass('PlatzTeil')
		.attr('id', this.platzteilNummer + this.platz.innerPlatzName)             // Format:
														  // "99..99Platzname"
		.css({'width': this.platz.PlatzTeilWidth,           // zum Platz passende
														  // Breite der
														  // Platzteile
		   'height': erisPlatzteilHeight})                // zum Platz passende
														  // Höhe der Platzteile
		.data('erisPlatzteil', this)                        // Referenz auf das
														  // Platzteil-Objekt
		.appendTo('#Platz' + this.platz.innerPlatzName);
	  


	// mache das erzeugte Platzteil droppable
	// --------------------------------------
	$('#'+ this.platzteilNummer + this.platz.innerPlatzName).droppable({
		tolerance: "pointer",   // Wirft den Marker in das PlatzTeil auf das der
							  // Mouse-Pointer zeigt

		drop: function(event, ui) { // Marker wurde in ein Platzteil
								  // fallengelassen

			// erisTrack
			if (erisTracking) erisTrack('send', {
				  hitType: 'event',
				  eventCategory: 'erisMarker',
				  eventAction: 'drop',
				  eventLabel: 'existing Event'
				});

			// Achtung: this verweist hier auf das jQuery-Objekt 'Platzteil' in das
			// gedropped wurde

			var erisPlatzteil = $(this).data('erisPlatzteil'); // ermittle die
																// Referenz auf das
																// Platzteil-Objekt,
																// in das gedroppt
																// wurde
			var MarkerID = $(ui.draggable).attr('id'); // ID des Markers der
														// gedropped wird
			var erisMarker = $('#' + MarkerID).data('erisEventMarker'); // Objekt des
																	// bewegten
																	// Markers

			// Parameter im Marker-Objekt aktualisieren
			// ----------------------------------------

			// Referenz auf den Platz, auf dem der Marker jetzt liegt
			erisMarker.liegtAufPlatz = erisPlatzteil.platz;
			erisMarker.erstesBelegtesTeil = erisPlatzteil.platzSpalte; // Spalte, in der der Marker abgelegt wurde

			// Attribute des Platzes auf Marker übertragen
			if (erisMarker.PlatzName !== erisPlatzteil.platz.platzName) {
				erisMarker.PlatzName = erisPlatzteil.platz.platzName;  // aktueller Platzname
				var platzWechsel = true;
		    	if (erisTracking) erisTrack('send', {
					  hitType: 'event',
					  eventCategory: 'erisMarker',
					  eventAction: 'change field',
					  eventLabel: erisMarker.PlatzName
					});
			}

			// neue Marker auf die ganze Platzgröße anpassen
			if (platzWechsel) {
				erisMarker.anzahlBelegteTeile = erisPlatzteil.platz.anzahlTeile;
				erisMarker.setBelegtePlatzteile();
				erisMarker.setMarkerWidth(ui);
			}

			// ragt, das Platzteil über den Platz hinaus?
			if (erisMarker.erstesBelegtesTeil + erisMarker.anzahlBelegteTeile > erisMarker.liegtAufPlatz.anzahlTeile) {
				erisMarker.anzahlBelegteTeile=erisMarker.liegtAufPlatz.anzahlTeile-erisMarker.erstesBelegtesTeil+1;
				erisMarker.setMarkerWidth(ui);
			}
			erisMarker.setBelegtePlatzteile();

			// ist der Marker zu lang?
			if (erisMarker.duration > (erisMarker.liegtAufPlatz.bis-erisMarker.liegtAufPlatz.von)*erisMinutenJeStunde) {
				erisMarker.duration = (erisMarker.liegtAufPlatz.bis-erisMarker.liegtAufPlatz.von)*erisMinutenJeStunde;
				erisMarker.setMarkerHeight(ui);
			}

					// angezeigtes Datum aus der Timeline
			erisMarker.dateStart[0] = erisPlatzteil.platz.timeline.angezeigtesDatum; 

			// Uhrzeit aus dem Platzteils, in das der Marker bewegt wurde
			erisMarker.dateStart[1] = erisPlatzteil.von;  

			// Datum + Uhrzeit kombiniert
			erisMarker.startTime = erisMarker.dateStart[0] + ' ' + erisPlatzteil.von;

			
			// Marker endDate setzen
			erisMarker.setMarkerDateEnd();
			
			// Marker-Position im Ziel = oben, links
			$(ui.draggable).css({
				'top': 0,
				'left': 0
			}); 

			// Marker ins Ziel-Platzteil ablegen
			$(ui.draggable)
				.appendTo($('#' + erisPlatzteil.platzteilNummer + erisPlatzteil.platz.innerPlatzName)); 

			// ToolTip aktualisieren
			erisMarker.jQueryQtipMarker();

			// Marker speichern
			erisMarker.store();

		} // end drop
	}); // end droppable

	// binde den Eventhandler für Klick an das Platzteil
	this.jQueryClickPlatzteil();

	// binde den Eventhandler für hover an das Platzteil
	this.jQueryHoverPlatzteil();

}; // end jQueryViewPlatzteil
  
	/**
* ready Event-Handler für das Platzteil erzeugen
*/
Platzteil.prototype.jQueryReadyPlatzteil = function() {
	
	erisTrace('jQueryReadyPlatzteil - ready');
};

/**
* click Event-Handler für das Platzteil erzeugen
*/
Platzteil.prototype.jQueryClickPlatzteil = function(){
	$('#'+ this.platzteilNummer + this.platz.innerPlatzName).click(function() {
		erisTrace('jQueryClickPlatzteil - klick');
		var erisPlatzteil = $(this).data('erisPlatzteil'); // ermittle Objekt
		erisPlatzteil.jQueryMarkerDialog();
	});
};


Platzteil.prototype.jQueryHoverPlatzteil = function(){
	$('#'+ this.platzteilNummer + this.platz.innerPlatzName).hover(function() {
		//	erisTrace('jQueryHoverPlatzteil - hover');
		$( this ).css( { 'background-color' : 'yellow' });
		}, function() {
			$( this ).css( { 'background-color' : '' });
		});
};

/**
* erzeugt einen Dialog zur Erfassung der Platzbelegung
*/
Platzteil.prototype.jQueryMarkerDialog = function(){
	$('#formbelegungsdatum').val(this.platz.timeline.angezeigtesDatum);
	$('#formplatzname').val(this.platz.platzName);
	$('#formvon').val(this.von);
	$('#formteam').val('');
	$('#formbeschreibung').val('Training');
	
	$('#dialog-form').dialog({
		modal: true,
		title: "Platzbelegung",
		width: '310',
		height: '320',
		open: function(event, ui) {
			erisTrace('jQueryMarkerDialog - open Dialog');	        	
		},
		buttons: {
			Ok: function() {
				
				// erisTrack
				if (erisTracking) erisTrack('send', {
					  hitType: 'event',
					  eventCategory: 'erisMarker',
					  eventAction: 'create',
					  eventLabel: 'new Event'
					});

				erisTrace('jQueryMarkerDialog - ok- close Dialog');
				var erisMarker = new ErisEvent({
					startTime : $('#formbelegungsdatum').val() + ' ' + $('#formvon').val() , 
					description : $('#formbeschreibung').val(), 
					team : $('#formteam').val(), 
					PlatzName : $('#formplatzname').val(), 
					markerNummer : 0
				});
				erisMarker.jQueryViewMarker(); // Marker anzeigen
				$(this).dialog("close");
				erisMarker.store(); // speichere die Belegung
			},
			Cancle: function() {
				
				// erisTrack
				if (erisTracking) erisTrack('send', {
					  hitType: 'event',
					  eventCategory: 'erisMarker',
					  eventAction: 'cancle',
					  eventLabel: 'cancle new Event'
					});

				erisTrace('jQueryMarkerDialog - cancle - close Dialog');
				$(this).dialog("close");
			}
		}
	}); //end dialog
	
}; // end jQueryMarkerDialog