/**
 * 
     ****************************************
	* Sportstaetten-Reservierungs-System   *
	****************************************
	
	@author		Achim
	@version	2016
	@copyright 	alle Rechte vorbehalten

	@description
  	Definition der Klasse "Zeitachse" mit allen Eigenschaften und Methoden.
*/

/*global $*/
/*global BeginnZeitLeiste*/
/*global EndeZeitLeiste*/
/*global StundeInPixel*/
/*global PlatzTeilMargin*/


class Zeitachse {
	

	/**
	 * @param art = unterscheidet Links und Rechts dargestellte Zeitachsen
	 *				Der Wert von art wird als class dem generierten <div> zugeordnet
	 *				das ermöglicht eine Gestaltung per css.
	 * 
	 * @description
	 * Konstruktor für eine vertikale Zeitachse, die limks und/oder rechts angezeigt werden kann.
	 * Dazwischen soll sich einen Fläche befinden. 
	 * @example
	 * Aufrufbeispiel: var zeitleiste = new Zeitachse('Rechts'); 
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