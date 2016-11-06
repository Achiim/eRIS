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

class Platz {
	

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

	constructor(name, teilbezeichung, anzahlteile) {
		this.name = name;						// Bezeichnung es Platzes
		this.teilbezeichung = teilbezeichung	// 
		this.anzahlteile  = anzahlteile;		// Anzahl der reservierbaren Plartteile je Zeiteinheit
		this.platzfarbe = 'green';				// default Farbe des Platzes
		this.reservierbarab = '08:00';			// Uhrzeit ab der Reservierungen möglich sind
		this.reservierbarbis = '22:00';			// Uhrzeit bis zu der Reservierungen möglich sind
	}
	
	view(containerId, PlatzKopfId) {
		
        // Breiten für Platzteile und Marker bestimmen
        // ------------------------------------------------
        PlatzTeilWidth = PlatzWidth / this.anzahlteile - PlatzTeilMargin; // Width = Width + Margin
        MarkerMinWidth = PlatzTeilWidth - MarkerPadding; // neue kleinste Markergröße
	
		/*******************************************
		Platzkopfdaten
			- Platzname
			- Platzteilbezeichungen
		********************************************/

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
        .css('width', PlatzWidth)
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
            $('<div>' + ptn + pz + '</div>') // neue Bezeichung der Platzteile erzeugen
                .addClass('PlatzKopfTeil')
                .attr('id', 'PlatzKopfTeil' +  this.name)
                .css('width', PlatzTeilWidth)
                .appendTo('#Platzteile' +  this.name);
        }
        
        

		/***************************************
		Platz
			- Platzteile
		****************************************/
        // Platzes
        // ------------------------
        $('<div/>')
        .addClass('Platz')
        .attr('id', 'Platz'+ this.name)
        .appendTo('#'+containerId);

	
        // Breite des Platz-Containers festlegen
        // --------------------------------------
        $('#Platz' + this.name).width(PlatzWidth); // Breite der Platz anpassen

        // erzeuge das Belegungsraster im Platz
        // ------------------------------------
        for (var uhr = BeginnZeitLeiste * AnzahlPlatzteileJeStunde; uhr < EndeZeitLeiste * AnzahlPlatzteileJeStunde; uhr++) {
            for (var pl = 0; pl < this.anzahlteile; pl++) {
                $('<div/>')
                    .addClass('PlatzTeil')
                    .attr('id', pid++ + this.name)
                    .css('width', PlatzTeilWidth)
                    .appendTo('#Platz' + this.name);
            }
        }
	
	
	}
}

