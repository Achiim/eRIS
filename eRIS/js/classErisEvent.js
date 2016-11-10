/**
 * 
 * Sportstaetten-Reservierungs-System 
 * **********************************
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 * 
 * @description Definition der Klasse "Datumsachse" mit allen Eigenschaften und
 *              Methoden.
 */

/* global $ */
/* global erisDatum2Wert */
/* global erisBerechneDatum */
/* global erisWert2Datum */
/* global erisTrace */

class ErisEvent {

	
	constructor(id, startTime, duration, description, team, match, partOfSeries, field, portion) {
		
		this.ID = id; // interner Schlüssel
		this.start = startTime; // Datum und Uhrzeit des Beginns
		this.Dauer = duration; // Dauer in Minuten
		this.Beschreibung = description; // Beschreibung
		this.TeamID = team; // Team Kürzel
		this.Spiel = match; // Spiel J/N
		this.Serie = partOfSeries; // Teil einer Terminserie
		this.Platz = field; // Platz
		this.Platzteil = portion; // Platzteile
		this.dateStart = startTime.split(' '); // Array [0] = Datum, [1]
                                            // = Zeit
		this.mid = 0; // Nummerierung der Marker
		
		var dateStart = this.start.split(' ');
		var day = parseInt(dateStart[0].split('.')[0], 10);
		var month = parseInt(dateStart[0].split('.')[1], 10);
		var year = parseInt(dateStart[0].split('.')[2], 10);
		var hour = parseInt(dateStart[1].split(':')[0], 10);
		var minute = parseInt(dateStart[1].split(':')[1], 10);
		

	}
	
	view(containerId) {
	  
	// Platzkonstanten
	  const PlatzWidth = 120;
	  const PlatzTeilMargin = 1;
	  const AnzahlPlatzTeile = 4;
	  const MarkerPadding = 2*5;
	  const PlatzTeilWidth = PlatzWidth / AnzahlPlatzTeile - PlatzTeilMargin; // Width = Width + Margin
    const MarkerWidth = PlatzWidth - PlatzTeilMargin - MarkerPadding;
    
    var hoehe = this.minutesToPixel(this.Dauer);
    var breite = MarkerWidth;
    var markerID = this.TeamID + this.mid++;
    
    $('<div>' + this.TeamID + '</div>')
      .addClass(this.altersKlasse(this.TeamID) + ' Marker')
      .attr('id', markerID)
      .height(hoehe)
      .width(breite)
      .appendTo('#Container')
      .draggable({
          scroll: true
      })
      .draggable("option", "revert", "invalid")
      .draggable("option", "cursorAt", {
          left: 0,
          top: 0
      })
      .data('erisObject', this);
      	 
	}
	
	/**
    rechnet Minuten in Pixel um
	 */
	minutesToPixel(hh) {
	  const StundeInMinuten = 60;
	  const StundeInPixel = 28;
	  const MarkerPadding = 5;
	  const PlatzTeilMargin = 1;
	  
	  erisTrace('minutesToPixel - Beginn/Ende');
  return (Math.round(hh / StundeInMinuten * StundeInPixel)) - MarkerPadding - PlatzTeilMargin; // Pixel aus Minuten berechnet
	}

	/**
	 * Hilfsfunktion, solange die Daten nicht aus der DB kommen
	 * 
	 * @param TeamID
	 * @returns Bezeichnung der Alterklasse
	 */
	altersKlasse(TeamID) {
	    erisTrace('altersKlasse - Beginn/Ende');

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

}