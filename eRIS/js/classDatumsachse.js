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
/* global erisDatum2Wert */
/* global erisBerechneDatum */
/* global erisWert2Datum */
/* global erisTrace */


class Datumsachse {
	/**
   * @param angezeigtesDatum =
   *          aktuelles Datum
   * 
   * @description Konstruktor für eine Datumsachse mit Auswahl-Slider.
   * @example Aufrufbeispiel: var timeline = new Datumsachse('30.10.2016');
   */

	constructor(angezeigtesDatum) {
		this.angezeigtesDatum = angezeigtesDatum;							// aktuelles Datum
                                                          // dd.mm.jjjj
	}
	
	view(containerId) {
		
		var dt_today = this.angezeigtesDatum;
		var dt_from = erisBerechneDatum(this.angezeigtesDatum,-5);
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
        // Achtung: this verweist hier auf das jQuery-Objekt '#sliderView'
        var erisTimeline = $('#sliderView .ui-slider-handle').data('erisTimeline');  // Referenz
                                                                                      // auf
                                                                                      // das
                                                                                      // Objekt-Timeline
  	    $("#sliderView").slider( "option", "min", erisDatum2Wert(erisBerechneDatum(erisTimeline.angezeigtesDatum, -5)) );
  	    $("#sliderView").slider( "option", "max", erisDatum2Wert(erisBerechneDatum(erisTimeline.angezeigtesDatum, +7)) );
  	  }
		});
		
		$('#sliderView .ui-slider-handle')
      // Achtung: this verweist hier auf das Objekt Timeline
			.text(this.angezeigtesDatum) // Zeige aktuelles Datum im Schieber an
			.data('erisTimeline', this) // Referenz auf das Timeline-Objekt
			.css('width', '100')
			.css('text-align', 'center');

	} // end view
	
} // end class
