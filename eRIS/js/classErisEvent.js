/**
 * 
 * Sportstaetten-Reservierungs-System **********************************
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
/* global erisPlatzWidth */
/* global erisPlatzTeilMargin */
/* global erisMarkerPadding */
/* global erisMarkerHeightViertelstunde */


class ErisEvent {

	
	constructor(id, startTime, duration, description, team, match, partOfSeries, field, portion) {
		var leererPlatz = {                   // leerer Platz
		        timeline : null,              // keiner timeline zugeordnet (Datumsachse)
		        platzName : 'leerer Platz',   // Default
		        platzteilNummer : -1,         // keine gültige platzteilId
		        teilBezeichung : '?',         // Default 
		        anzahlTeile : 1,              // Marker besteht aus einem Platzteil
		        platzfarbe : 'green',         // nicht unterstützt
		        von : 8,                      // fixer Wert 8 Uhr
		        bis : 22,                     // fixer Wert 22 Uhr
		        PlatzTeilWidth : 120 / 1 -1,  // Default-Wert im Sammler
		};
		
		this.liegtAufPlatz = leererPlatz;
		this.ID = id; // interner Schlüssel
		this.start = startTime; // Datum und Uhrzeit des Beginns
		this.Dauer = duration; // Dauer in Minuten
		this.Beschreibung = description; // Beschreibung
		this.TeamID = team; // Team Kürzel
		this.Spiel = match; // Spiel J/N
		this.Serie = partOfSeries; // Teil einer Terminserie
		this.Platz = field; // Platz
		this.PlatzteilArray = portion; // Platzteile
		this.anzahlBelegteTeile = undefined; // Default-Wert, Markr liegt noch auf keinem Platz
		this.erstesBelegtesTeil = 1;  // Defaultwert
		if(this.startTime) 
		  this.dateStart  = startTime.split(' '); // Array [0] = Datum, [1]
		else
		  this.dateStart  = [];
                                            // = Zeit
		this.mid = 0; // Nummerierung der Marker
		
		if (this.start) {
  		var dateStart = this.start.split(' ');
  		var day = parseInt(dateStart[0].split('.')[0], 10);
  		var month = parseInt(dateStart[0].split('.')[1], 10);
  		var year = parseInt(dateStart[0].split('.')[2], 10);
  		var hour = parseInt(dateStart[1].split(':')[0], 10);
  		var minute = parseInt(dateStart[1].split(':')[1], 10);
		}

    // Platzkonstanten

    this.MarkerWidth = erisPlatzWidth - erisPlatzTeilMargin - erisMarkerPadding;
    this.innerMarkerHeight = 5; // abzgl. padding oben und unten und margin rechts
    this.MarkerMinHeight = this.innerMarkerHeight * 2 + erisPlatzTeilMargin;
    this.MarkerMinWidth = this.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
    this.MarkerMaxWidth = erisPlatzWidth - erisMarkerPadding - erisPlatzTeilMargin;
    this.MarkerMaxHeight = (this.liegtAufPlatz.bis - this.liegtAufPlatz.von) * 4 * erisMarkerHeightViertelstunde;

    this.MarkerHeightjePlatzteil=this.MarkerMinHeight;
	}
	
	view(containerId) {

	  this.mid++;
    this.jQueryShowMarker(); // zeige den Maker mit Query an
    this.jQueryDraggableMarker(); // mache den Marker beweglich
    this.jQueryResizeableMarker(); // mache den Marker in der Größe änderbar
    this.jQueryQtipMarker(); // verpasse dem Marker einen ToolTip

    
  } // end view
	
	jQueryShowMarker() {
	  
    var hoehe = this.minutesToPixel(this.Dauer);
    var breite = this.MarkerWidth;
    var markerID = this.TeamID + this.mid;

    $('<div>' + this.TeamID + '</div>')
    .addClass(this.altersKlasse(this.TeamID) + ' Marker')
    .attr('id', markerID)
    .height(hoehe)
    .width(breite)
    .data('erisEventMarker', this)
    .appendTo('#Container');
 	}
  
  jQueryDraggableMarker() {
    var markerID = this.TeamID + this.mid;
    $('#' + markerID)
    .draggable({ scroll: true })
    .draggable("option", "revert", "invalid")
    .draggable("option", "cursorAt", { left: 0, top: 0 });
  }
  
  jQueryResizeableMarker() {
    var markerID = this.TeamID + this.mid;
    
    $('#' + markerID)
    .resizable({
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
        
        if (hoehe !== aktHoehe) erisTrace('class ErisEvent - resize - neue Höhe = ' + hoehe + ' AnzRaster = ' + anzRaster);
        
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
        erisEventMarker.Dauer = erisEventMarker.pixelToMinutes(hoehe); // Minuten aus Pixel berechnet
        erisEventMarker.jQueryQtipMarker();

      } // end resize

    }); // resizeable
  } // end jQueryResizeableMarker
  
  jQueryQtipMarker() {
    // qTip für den Marker
    var markerID = this.TeamID + this.mid;
    var markup = this.erisToolTip();
    $('#'+markerID).qtip({ // Grab some elements to apply the tooltip to
        content: {
          title: this.TeamID,
          text: markup
        },
          position: {
            my: 'top left',
            at: 'bottom right'
        },
          style: {
            classes: 'qtip-blue qtip-shadow'
        }
    });

  } // end jQueryQtipMarker

  /**
   * berechnet die belegten Platzteile
   */
  setBelegtePlatzteile() {
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
	minutesToPixel(hh) {
	  const StundeInMinuten = 60;
	  const StundeInPixel = 28;
	  return (Math.round(hh / StundeInMinuten * StundeInPixel)) - 
          erisMarkerPadding - erisPlatzTeilMargin; 
	}
	
  /**
  *
  * rechnet Pixel in Minuten um
  */
  pixelToMinutes(hh) {
    const StundeInMinuten = 60;
    const StundeInPixel = 28;
    const PlatzTeilMargin = 1;
    var anzVirtelstunden = Math.round((hh + erisMarkerPadding + erisPlatzTeilMargin) / (erisMarkerHeightViertelstunde + 1)); // Stunden aus Pixel berechnet
    erisTrace('class ErisEvent - pixelToMinutes - Höhe = ' + hh + ' anzVirtelstunden = ' + anzVirtelstunden);
    return anzVirtelstunden*15;
  }

  setMarkerWidth(ui) {
    var breite = this.anzahlBelegteTeile * this.liegtAufPlatz.PlatzTeilWidth - erisMarkerPadding;
    breite += this.anzahlBelegteTeile * erisPlatzTeilMargin;
    $(ui.draggable).css({'width' : breite}); // ganze Markergröße setzen
  }
  
	erisToolTip() {
    erisTrace('erisToolTip - Beginn');
    var tt = '';
    if (this.Platz) tt += 'erisPlatz = ' + this.Platz + '<br\>';
    if (this.start) tt += 'erisStart = ' + this.start + '<br\>';
    if (this.Dauer) tt += 'erisDauer = ' + this.Dauer + ' Minuten<br\>';
    if (this.Beschreibung) tt += 'erisBeschreibung = ' + this.Beschreibung + '<br\>';
//    if (this.TeamID) tt += 'erisTeamID = ' + this.TeamID + '<br\>';
    if (this.Spiel) tt += 'erisSpiel = ' + this.Spiel + '<br\>';
    if (this.Serie) tt += 'erisSerie = ' + this.Serie + '<br\>';
    if (this.PlatzteilArray) tt += 'erisPlatzteil = ' + this.PlatzteilArray + '<br\>';
    if (this.anzahlBelegteTeile) tt += 'erisAnzahlBelegteTeile = ' + this.anzahlBelegteTeile + '<br\>'; 
    if (this.ID) tt += 'erisID = ' + this.ID + '<br\>';
//  if (this.dateStart) tt += 'erisDateStart = ' + this.dateStart;
    if (this.erstesBelegtesTeil) tt += 'erstesBelegtesTeil = ' + this.erstesBelegtesTeil;

    erisTrace('erisToolTip - Ende');
    return tt;
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