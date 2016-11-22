/**
 * 
 * Sportstaetten-Reservierungs-System *
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 * 
 * @description Definition der Klasse "Zeitachse" mit allen Eigenschaften und
 *              Methoden.
 */

/* global $ */
/* global BeginnZeitLeiste */
/* global EndeZeitLeiste */
/* global StundeInPixel */
/* global erisPlatzTeilMargin */



	
	/**
   * @param art =
   *          unterscheidet Links und Rechts dargestellte Zeitachsen Der Wert
   *          von art wird als class dem generierten <div> zugeordnet das
   *          ermöglicht eine Gestaltung per css.
   * 
   * @description Konstruktor für eine vertikale Zeitachse, die limks und/oder
   *              rechts angezeigt werden kann. Dazwischen soll sich einen
   *              Fläche befinden.
   * @example Aufrufbeispiel: var zeitleiste = new Zeitachse('Rechts');
   */

var Zeitachse = function(art) {
	// Pruefe ob der Constructor mit new aufgerufen wurde
	if (!(this instanceof Zeitachse)) {
		return new Zeitachse(art);
	}

	this.art = art;							// Links oder Rechts
    this.von = 8                // Anzeige ab 8:00 Uhr
    this.bis = 22               // Anzeige bis 22:00 Uhr
    this.pixelStunde = Math.floor((erisZeitAchsenlaenge-14) /       // ??? 14 Pixel Abzug wegen 14 Stunden und Margin
            (this.bis - this.von)); // Anzahl der Pixel je Stunde

}

Zeitachse.prototype.jQueryViewZeit = function(containerId) {
	
			
	if (this.art == 'Links') {
		$('<div/>') // Anzeige der Zeit links
	    .addClass(this.art)
	    .attr('id', 'ZeitContainer'+this.art)
	    .prependTo('#'+containerId);

		$('<div/>') // Anzeige der Zeit links
	    .addClass(this.art)
	    .attr('id', 'Zeit'+this.art)
	    .prependTo('#ZeitContainer'+this.art);
	} else {
		$('<div/>') // Anzeige der Zeit links
	    .addClass(this.art)
	    .attr('id', 'ZeitContainer'+this.art)
	    .appendTo('#'+containerId);

		$('<div/>') // Anzeige der Zeit links
	    .addClass(this.art)
	    .attr('id', 'Zeit'+this.art)
	    .appendTo('#ZeitContainer'+this.art);
	}

    // Linke Zeitskala erzeugen 8:00 - 22:00 Uhr
    // --------------------------------------------------
    for (var uhr = this.von; uhr < this.bis; uhr++) { // Zeitspalte links
        $('<div>' + uhr + '<sup>00</sup></div>')
            .addClass('Uhrzeit')
            .attr('id', 'LU' + uhr)
            .css({
       // 'height': StundeInPixel - erisPlatzTeilMargin
            'height': this.pixelStunde
            })
            .appendTo('#Zeit'+this.art);
    }
}