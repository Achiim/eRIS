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

class Platz {

	/**
   * @param name =
   *          Bezeichung des Platzes
   * @param teilbezeichung =
   *          Kurzbezeichung für Platzteile
   * @param anzahlteile =
   *          Anzahl der reservierbaren Platzteile
   * 
   * @description Konstruktor für ein Platzobjekt.
   * @example Aufrufbeispiel: var kunstrasen = new Platz('Kunstrasen', 'K', 2);
   */
  
  
	constructor(name, teilbezeichung, anzahlteile) {
		this.name = name;						        // Bezeichnung des Platzes
    this.pid = 0;                       // Nummerierung der Platzteile auf dem Platz
		this.teilbezeichung = teilbezeichung	
		this.anzahlteile  = anzahlteile;		// Anzahl der reservierbaren
                                        // Platzteile je Zeiteinheit
		this.PlatzWidth = 120;
		this.PlatzTeilMargin = 1;
    this.PlatzTeilWidth = 0;
    this.MarkerPadding = 5;
    this.MarkerMinWidth = 0;
    this.AnzahlPlatzteileJeStunde = 4;  // kleinstes Reservierungsraster 1/4-tel Stunde

    
		this.platzfarbe = 'green';				  // default Farbe des Platzes
    this.von = 8                        // Anzeige ab 8:00 Uhr
    this.bis = 22                       // Anzeige bis 22:00 Uhr
    this.achsenlaenge = 392;            // Pixel
    this.pixelStunde = Math.floor(this.achsenlaenge / (this.bis - this.von)); // Anzahl der Pixel je Stunde
    this.pixelViertelstunde = Math.floor(this.pixelStunde/4)-1; // Anzahl der Pixel je Viertelstunde
	}
	
  view(containerId, PlatzKopfId) {
		
    // Breiten für Platzteile und kleinste Marker bestimmen
    // ----------------------------------------------------
    this.PlatzTeilWidth = this.PlatzWidth / this.anzahlteile - this.PlatzTeilMargin; 
    this.MarkerMinWidth = this.PlatzTeilWidth - this.MarkerPadding; 
   
    /***********************************************************************
    * Platzkopfdaten = Platzname und Platzteilbezeichungen
    ***********************************************************************/
    
    // Container für Platzkopfbeschriftungen
    // ------------------------------------
    $('<div/>') // Container 1
      .attr('id', 'Kopf' + this.name)
      .addClass('Platzteile')
      .appendTo('#'+PlatzKopfId);
    
    // Beschriftung des Platzes
    // ------------------------
    $('<div/>')
      .addClass('Platzname')
      .attr('id', 'Platzname'+ this.name)
      .css('width', this.PlatzWidth)
      .html(this.name)
      .appendTo('#Kopf' + this.name);
    
    // Container für Platzteilbeschriftungen
    // ------------------------------------
    $('<div/>') // Container 2
      .attr('id', 'Platzteile' + this.name)
      .appendTo('#Kopf' + this.name);
    
    // Platzteilbeschriftungen
    // ------------------------------------
    for (var pl = 0; pl < this.anzahlteile; pl++) {
      var ptn = this.teilbezeichung;
  	  var pz=pl+1;
      $('<div>' + ptn + pz + '</div>') // neue Bezeichung der
                                        // Platzteile erzeugen
        .addClass('PlatzKopfTeil')
        .attr('id', 'PlatzKopfTeil' +  this.name)
        .css('width', this.PlatzTeilWidth)
        .appendTo('#Platzteile' +  this.name);
    }

		/***************************************************************************
     * Platz und Platzteile
     **************************************************************************/
    // Platz
    // ------------------------
    $('<div/>')
      .addClass('Platz')
      .attr('id', 'Platz'+ this.name)
      .appendTo('#'+containerId);

    // Breite des Platz-Containers festlegen
    // --------------------------------------
    $('#Platz' + this.name).width(this.PlatzWidth); // Breite der
                                                // Platz anpassen

    // erzeuge das Belegungsraster im Platz
    // ------------------------------------
    for (var uhr = this.von * this.AnzahlPlatzteileJeStunde; uhr < this.bis * this.AnzahlPlatzteileJeStunde; uhr++) {
      for (var pl = 0; pl < this.anzahlteile; pl++) {
        $('<div/>')
          .addClass('PlatzTeil')
          .attr('id', this.pid++ + this.name)
          .css({'width': this.PlatzTeilWidth,
               'height': this.pixelViertelstunde})
          .appendTo('#Platz' + this.name);
      }
    }
    
    // mache die erzeugten Platzteile droppable
    // ----------------------------------------
    this.droppable();
	} // end view
	
	droppable () {
    $('.PlatzTeil').droppable({
      tolerance: "pointer",   // Wirft den Marker in das PlatzTeil auf das der Mouse-Pointer zeigt

      drop: function(event, ui) { // Funktion, die beim droppen aufgerufen wird

        var Ziel = $(this).attr('id'); // ID des PlatzTeil in das gedroppt wird
        var suffix = Ziel.replace(/[0-9]/g, ''); // Ziffern entfernen
        Ziel = parseInt(Ziel, 10); // Platzteilnummer
  
        var MarkerID = $(ui.draggable).attr('id'); // ID des Markers der gedropped wird
        var erisEvent = $('#' + MarkerID).data('erisObject'); // Objekt des bewegten Markers
   
        $(ui.draggable)
          .appendTo($('#' + Ziel + suffix)); // im Ziel ablegen
  
        $(ui.draggable).css({
            'top': 0,
            'left': 0
        }); // Position im Ziel oben links
  
      } // end drop
    });

	} // end droppable

/*	
	store() {
    var msg = '';
    if (erisEvent.ID === undefined || erisEvent.ID === '') {
      msg = makeEventMessage(MarkerID);
      postEvent(msg, ui.draggable); // in DB speichern
    } else {
      msg = makeEventUpdateMessage(MarkerID);
      postEventUpdate(msg);
    }
    
    createEventAttributes(MarkerID, erisEvent); // erzeuge Objekt + .data aus Position und Größe des Marker
  } // end store
*/
	
} // end class