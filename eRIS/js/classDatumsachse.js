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
/* global jQuery */
/* global erisDatum2Wert */
/* global erisBerechneDatum */
/* global erisWert2Datum */
/* global erisPlatzArray */
/* global erisTrace */
/* global Timeline */
/* global ErisEvent */
/* global Platz */


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
		this.markerNummer = 0;                                // initialisiere die Nummerierung der Marker
		
		this.loadPlaetze(this);                               // lade alle Plätze und zeige diese an
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
  	    
  	    
  	    jQuery.each($('.Marker'), function( index ) {   
  	      delete $(this).data('erisEventMarker'); // Lösche das eris-Objekt zum Marker
  	      this.remove();   // Lösche das jQueryUI-Objekt zum Marker
  	     }); 

  	    $('.Platz').addClass('verschwommen');

  	    for (var a = 0; a < erisPlatzArray.length; a++ ) {
  	      erisTimeline.loadEvents(erisPlatzArray[a].platzName, erisTimeline.angezeigtesDatum);
  	    }
  	    

  	  }
		});
		
		$('#sliderView .ui-slider-handle')
      // Achtung: this verweist hier auf das Objekt Timeline
			.text(this.angezeigtesDatum) // Zeige aktuelles Datum im Schieber an
			.data('erisTimeline', this) // Referenz auf das Timeline-Objekt
			.css('width', '100')
			.css('text-align', 'center');
		

	} // end view
	
	loadEvents(field, datum) {
	  
    var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/event/field/' + field;
//    url += '/time/' + datum + '%2008%3A00/' + datum + '%2022%3A00';   // Funktion momentan in Überarbeitung
  
    $.ajax({ type: "GET", url: url, dataType: 'json'})
    .done(function( responseJson ) {
      console.log("ajax loadEvents done");
      console.log(url);
      
      $('.Platz').removeClass('verschwommen');

      if (typeof responseJson !== 'undefined' ) {
        console.log(responseJson);
        if (typeof responseJson.items !== 'undefined' && responseJson.items.length>0) {
          for (var a = 0; a < responseJson.items.length; a++) {
            var dat = responseJson.items[a].startTime.split(' ');
            if (dat[0] == Timeline.angezeigtesDatum) {
              Timeline.markerNummer++;  // nächste Markernummer
              new ErisEvent(responseJson.items[a].id, 
                            responseJson.items[a].startTime, 
                            responseJson.items[a].duration,
                            responseJson.items[a].description,
                            responseJson.items[a].team,
                            responseJson.items[a].match,
                            responseJson.items[a].partOfSeries,
                            responseJson.items[a].field,
                            responseJson.items[a].portion,
                            Timeline.markerNummer).view('#PlatzKunstrasen');
            }
          }
        }
      }
    });
	}

  loadPlaetze(timeline) {
    
    jQuery.each($('.Platz'), function( index ) {   
     this.remove();   // Lösche das jQueryUI-Objekt zum Platz
    }); 
    
    var url = 'https://1-dot-svn-rest.appspot.com/_ah/api/eventSystem/v1/field';
  
    $.ajax({ type: "GET", url: url, dataType: 'json'})
    .done(function( responseJson ) {
      console.log("ajax loadPlaetze done");
      console.log(url);
      if (typeof responseJson !== 'undefined' ) {
        console.log(responseJson);
        if (typeof responseJson.items != 'undefined' && responseJson.items.length>0) {
          for (var a = 0; a < responseJson.items.length; a++) {
           
            erisPlatzArray[a] = new Platz(timeline, 
                      responseJson.items[a].title, // lösche Blanks aus dem Namen 
                      responseJson.items[a].portionName,
                      responseJson.items[a].portions);
            erisPlatzArray[a].view('PlatzContainer', 'PlatzMitteKopf');
          }
        }
      }
    });
  }

} // end class
