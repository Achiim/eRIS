/**
 * 
     ****************************************
	* Sportstaetten-Reservierungs-System   *
	****************************************
	
	@author		Achim
	@version	2016
	@copyright 	alle Rechte vorbehalten

	@description
  	Definition der Klasse "Platz" mit allen Eigenschaften und Methoden.
*/


class Zeitachse {
	

	/**
	 * @param name = Bezeichung des Platzes
	 * @param teilbezeichung = Kurzbezeichung für Platzteile
	 * @param anzahlteile = Anzahl der reservierbaren Platzteile
	 * 
	 * @description
	 * Konstruktor für ein Platzobjekt. 
	 * @example
	 * Aufrufbeispiel: var kunstrasen = new Platz('Kunstrasen', 'K', 2); 
	 */

	constructor(art) {
		this.art = art;							// Links oder Rechts
	}

	view(containerId) {
				
	    $('<div/>') // Anzeige der Zeit links
        .addClass(this.art)
        .attr('id', 'Zeit'+this.art)
        .appendTo('#'+containerId);

	    // Linke Zeitskala erzeugen 8:00 - 22:00 Uhr
	    // --------------------------------------------------
	    for (var uhr = BeginnZeitLeiste; uhr < EndeZeitLeiste; uhr++) { // Zeitspalte links
	        $('<div>' + uhr + '<sup>00</sup></div>')
	            .addClass('Uhrzeit')
	            .attr('id', 'LU' + uhr)
	            .css({
	                'height': StundeInPixel - PlatzTeilMargin
	            })
	            .appendTo('#Zeit'+this.art);
	    }
	}
}