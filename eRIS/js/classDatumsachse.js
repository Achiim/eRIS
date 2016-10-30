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


class Datumsachse {
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

	constructor(wert) {
		this.wert = wert;							// aktuelles Datum dd.mm.jjjj
	}
	
	view(containerId) {
		
		var dt_today = this.wert;
		var dt_from = erisBerechneDatum(this.wert,-7);
		var dt_to = erisBerechneDatum(this.wert, 7);

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
		    step: 24*3600,
		    value: tod_val,
		    
		    slide: function (e, ui) {
			       this.wert = erisWert2Datum(ui.value);
			       $(ui.handle).text(this.wert);			// neuer Datumswert im Schieber
			    },
			
			stop: function (e, ui) {
			    erisTrace('neuer Datumswert = ' + this.wert);

			    }
		});
		$('#sliderView .ui-slider-handle')
			.text(this.wert) // Zeige aktuelles Datum im Schieber an
			.css('width', '100')
			.css('text-align', 'center');
	}
	
}
