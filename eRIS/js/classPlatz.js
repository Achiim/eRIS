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
  
  
	constructor(timeline, name, teilbezeichung, anzahlteile) {
	  this.timeline = timeline;           // Referenz auf den TimeSlider mit dem
                                        // aktuellen Datum
		this.name = name;						        // Bezeichnung des Platzes
    this.pid = 0;                       // Nummerierung der Platzteile auf dem
                                        // Platz
		this.teilbezeichung = teilbezeichung	
		this.anzahlteile  = anzahlteile;		// Anzahl der reservierbaren
                                        // Platzteile je Zeiteinheit
		this.PlatzWidth = 120;
		this.PlatzTeilMargin = 1;
    this.MarkerPadding = 5;
    this.AnzahlPlatzteileJeStunde = 4;  // kleinstes Reservierungsraster 1/4-tel
                                        // Stunde

		this.platzfarbe = 'green';				  // default Farbe des Platzes
    this.von = 8                        // Anzeige ab 8:00 Uhr
    this.bis = 22                       // Anzeige bis 22:00 Uhr
    this.achsenlaenge = 392;            // Pixel
    this.pixelStunde = Math.floor(this.achsenlaenge / (this.bis - this.von)); // Anzahl
                                                                              // der
                                                                              // Pixel
                                                                              // je
                                                                              // Stunde
    this.pixelViertelstunde = Math.floor(this.pixelStunde/4)-1; // Anzahl der
                                                                // Pixel je
                                                                // Viertelstunde
    // Breiten für Platzteile und kleinste Marker bestimmen
    // ----------------------------------------------------
    this.PlatzTeilWidth = this.PlatzWidth / this.anzahlteile - this.PlatzTeilMargin; 
    this.MarkerMinWidth = this.PlatzTeilWidth - this.MarkerPadding;
    

	
	} // end constructor
	
  view(containerId, PlatzKopfId) {
		
    // erzeuge die jQueryUI-Elemente für den Platzkopf
    // -----------------------------------------------
    this.jQueryUI_Platzkopf(PlatzKopfId);
   
    // erzeuge die jQueryUI-Elemente für den Platz und die Platzteile
    // -----------------------------
    this.jQueryUI_Platz(containerId);
   
  } // end view
/*
 * store() { var msg = ''; if (erisEvent.ID === undefined || erisEvent.ID ===
 * '') { msg = makeEventMessage(MarkerID); postEvent(msg, ui.draggable); // in
 * DB speichern } else { msg = makeEventUpdateMessage(MarkerID);
 * postEventUpdate(msg); } createEventAttributes(MarkerID, erisEvent); //
 * erzeuge Objekt + .data aus Position und Größe des Marker } // end store
 */
	
  jQueryUI_Platzkopf(PlatzKopfId) {
    /***************************************************************************
     * Platzkopfdaten = Platzname und Platzteilbezeichungen
     **************************************************************************/
      
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

  } // end jQueryUI_Platzkopf

  jQueryUI_Platz(containerId) {
    
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
    $('#Platz' + this.name).width(this.PlatzWidth); // Breite des
                                                // Platzes anpassen

    // erzeuge das Belegungsraster im Platz
    // ------------------------------------
    for (var uhr = this.von * this.AnzahlPlatzteileJeStunde; uhr < this.bis * this.AnzahlPlatzteileJeStunde; uhr++) {
      for (var pl = 0; pl < this.anzahlteile; pl++) {
        new Platzteil(this.pid++, this).view(); // erzeuge neues Platzteil und
                                                // zeige es an
      }
    }

  }
} // end class


class Platzteil {
  
  constructor (pid, platz) {
    this.pid = pid;             // Nummerierung der Platzteile
    this.platz = platz;         // Referenz auf das Platz-Objekt, zu dem das
                                // Platzteil gehört

    // start-Stunde
    var Stunde = pid / platz.anzahlteile / platz.AnzahlPlatzteileJeStunde + platz.von; 
    var vonStunde = Math.floor(Stunde); // volle Stunde aus Zeile berechnet
    vonStunde = ('00' + vonStunde).slice(-2); // mit führenden Nullen

    // start-Minute
    var Minute = (vonStunde - platz.von) * platz.anzahlteile * platz.AnzahlPlatzteileJeStunde;
    Minute = pid - Minute; // 0 - 15tes Platzteilraster innerhalb einer Stunde

    var vonMinute = Math.floor(Minute / platz.anzahlteile);
    if (vonMinute === 0) vonMinute = '00';
    if (vonMinute === 1) vonMinute = '15';
    if (vonMinute === 2) vonMinute = '30';
    if (vonMinute === 3) vonMinute = '45';

    this.von = vonStunde + ':' + vonMinute;
    
  } // end constructor
  
  
  view() {
    // erzeuge ein Platzteil mit Referenz auf den Platz
    // ------------------------------------------------
    $('<div/>')
      .addClass('PlatzTeil')
      .attr('id', this.pid + this.platz.name)             // Format:
                                                          // "99..99Platzname"
      .css({'width': this.platz.PlatzTeilWidth,           // zum Platz passende
                                                          // Breite der
                                                          // Platzteile
           'height': this.platz.pixelViertelstunde})      // zum Platz passende
                                                          // Höhe der Platzteile
      .data('erisPlatzteil', this)                        // Referenz auf das
                                                          // Platzteil-Objekt
      .appendTo('#Platz' + this.platz.name);

    // mache das erzeugte Platzteil droppable
    // --------------------------------------
    $('#'+ this.pid + this.platz.name).droppable({
      tolerance: "pointer",   // Wirft den Marker in das PlatzTeil auf das der
                              // Mouse-Pointer zeigt

      drop: function(event, ui) { // Marker wurde in ein Platzteil
                                  // fallengelassen
        
        // Achtung: this verweist hier auf das jQuery-Objekt 'Platzteil' in das
        // gedropped wurde
        
        var erisPlatzteil = $(this).data('erisPlatzteil'); // ermittle die
                                                            // Referenz auf das
                                                            // Platzteil-Objekt,
                                                            // in das gedroppt
                                                            // wurde
        var MarkerID = $(ui.draggable).attr('id'); // ID des Markers der
                                                    // gedropped wird
        var erisMarker = $('#' + MarkerID).data('erisObject'); // Objekt des
                                                                // bewegten
                                                                // Markers
        
        // Parameter im Marker-Objekt aktualisieren
        // ----------------------------------------
        
        // Name des Platzes, in das der Marker bewegt wurde
        erisMarker.Platz = erisPlatzteil.platz.name; 
        
        // angezeigtes Datum aus der Timeline
        erisMarker.dateStart[0] = erisPlatzteil.platz.timeline.angezeigtesDatum; 
        
        // Uhrzeit aus dem Platzteils, in das der Marker bewegt wurde
        erisMarker.dateStart[1] = erisPlatzteil.von;  

        // Datum + Uhrzeit kombiniert
        erisMarker.start = erisMarker.dateStart[0] + ' ' + erisPlatzteil.von;

        // Marker ins Ziel-Platzteil ablegen
        $(ui.draggable)
          .appendTo($('#' + erisPlatzteil.pid + erisPlatzteil.platz.name)); 
        
        // Marker-Position im Ziel = oben, links
        $(ui.draggable).css({
            'top': 0,
            'left': 0
        }); 
  
      } // end drop
    });
   
  } // end constructor
   
} // end class Platzteil
