/**
  ****************************************
	* Sportstaetten-Reservierungs-System   *
	****************************************
	
	@author		Achim
	@version	2016
	@copyright 	alle Rechte vorbehalten

	@description

	Sammlung von Funktionen zum Aufbau des Layouts des Reservierungssystems
	
	Das Layout wird grundsätzlich nach folgenden Schema aufgebaut

	.Belegungsplan (TagesView)
	+-----------------------------------------------------------------------------------------------------------------+
	|  .Ortsleiste
	|  +--------------------------------+--------------------------------------+------------------------------+
	|  | .OrtLinks                      | .OrtMitte                            | .OrtRechts                   |
	|  +-----------------------------------------------------------------------+------------------------------+
	|  .Datumsleiste
	|  +--------------------------------+--------------------------------------+------------------------------+
	|  | .DatumLinks                    | .DatumMitte                          | .DatumRechts                 |
	|  +-----------------------------------------------------------------------+------------------------------+
	|  .Platzleiste
	|  +--------------------------------+--------------------------------------+------------------------------+
	|  | .PlatzLinks                    | .PlatzMitte                          | .PlatzRechts                 |
	|  +-----------------------------------------------------------------------+------------------------------+
	|  |                      			| .Platzname
	|  | #ganztags                      | .Platzganztags                       | #ganztags                    |
	|  |                                |  .Platzteil0  
	|  |                                |  .Platzteil1  
	|  |                                |  .Platzteil2  
	|  |                                |  .Platzteil3  
	|  +------------------------------------------------------------------------------------------------------+
	|  .Zeitleiste                     
	|  +--------------------------------+--------------------------------------+------------------------------+
	|  | .ZeitLinks                     | .ZeitMitte                           | .ZeitRechts                  |
	|  | .Uhrzeit                       | .Platz                               | .Uhrzeit                     |
	|  |  ...                           |   .PlatzTeil                         | 
	|  |  ...                           |   .PlatzTeil                         |
	|  |                                |   .PlatzTeil                         |
	|  |                                |                                      |
	|  +--------------------------------+--------------------------------------+------------------------------+
	+-----------------------------------------------------------------------------------------------------------------+
    .Buttonlist
	+---------------------------------------------------------------------------  
	|  +------------------------+
	|  | .Buttongroup           |
	|  | .Eventbutton           |
	|  +------------------------+
	+---------------------------------------------------------------------------	
    .Container
	+---------------------------------------------------------------------------  
	|  +------------------------+
	|  | .Sammeleimer           |
	|  | .Muelleimer            |
	|  +------------------------+
	+---------------------------------------------------------------------------	
	
*/
//*********************************************************************************
/**
 * @global
 */
"use strict";		// Verwendung des Strict-Modus zur Laufzeit


/*global $*/
/*global erisHeute*/
/*global erisTrace*/
/*global readAllEvents*/
/*global readAllFields*/
/*global readAllTeams*/
/*global readAllGroups*/
/*global postEvent*/
/*global postEventUpdate*/
/*global erisBerechneDatum*/



var erisTraceLevel = true; // true = Trace-Meldungen ausgeben

//	globale Variablen
var pid = 0; // Nummerierung für PlatzElemente
var mid = 0; // Nummerierung für Marker
var bid = 0; // Nummerierung für Buttons

var fieldAmount = 0; // Anzahl der Felder
var fieldTitle = []; // Array für Platzbezeichungen
var fieldPortions = []; // Anzahl der belegbaren Platzteile
var fieldPartTitle = []; // Array für Platzteilbezeichungen jedes Platzes [Platz][Platzteil]
var currentField = 0; // Pointer auf den aktuellen Platz

var Platzname = [];
Platzname[0] = 'a';
Platzname[1] = 'b';
Platzname[2] = 'c';
Platzname[3] = 'd';

var AnzahlPlatzTeile = 2; // aktuelle Anzahl der reservierbaren Platzteile
var currentDatum = erisHeute(); // aktuelles Datum in der Tagesanzeige

//*********************************************************************************
/**
 * @constant
 * 
 */
// 	Konstanten für Layout

// Platzkonstanten
const PlatzWidth = 120;
const PlatzTeilMargin = 1;
const PlatzTeilHeight = 10; // Height 
var PlatzTeilWidth = PlatzWidth / AnzahlPlatzTeile - PlatzTeilMargin; // Width = Width + Margin
const AnzahlPlatzteileJeStunde = 4; // kleinstes Reservierungsraster 1/4-tel Stunde

// Markerkostanten
const MarkerPadding = 5 + 5;
const innerMarkerHeight = 5; // abzgl. padding oben und unten und margin rechts
const MarkerMaxWidth = PlatzWidth - MarkerPadding - PlatzTeilMargin;
var MarkerMinWidth = PlatzTeilWidth - MarkerPadding;
const MarkerMinHeight = innerMarkerHeight * 2 + PlatzTeilMargin;
const MarkerHeightjePlatzteil = MarkerMinHeight;
var MarkerWidth = (PlatzTeilWidth + PlatzTeilMargin) * AnzahlPlatzTeile - PlatzTeilMargin - MarkerPadding;

// Zeitleistenkonstanten
const StundeInMinuten = 60; // eine Stunde hat 60 Minuten
const StundeInPixel = AnzahlPlatzteileJeStunde * (PlatzTeilHeight + PlatzTeilMargin); // eine Stunde hat z.B. 48 Pixel
const BeginnZeitLeiste = 8; // Zeitleiste beginnt um 8:00 Uhr
const EndeZeitLeiste = 22; // Zeitleiste endet um 22:00 Uhr
const AnzahlStunden = EndeZeitLeiste - BeginnZeitLeiste; // z.B. 14 h

//*********************************************************************************
/**
	Erzeugt alle Bestandteile des Layouts.
	@param:			none
 */
function doLayout() {
    erisTrace('doLayout - Beginn');
    $("#erisViews").tabs(); // Tabs erzeugen
    doTagesview(); // baue 1-Tages-View auf
    doPlatzview(); // baue 1-Platz-View auf
    doEventbutton(); // generiere die Knöpfe
    doFuss(); // zeige den "Default-Fuss" mit dem Sammler und Mülleimer

    $(document).ready(readAllEvents(fieldTitle[currentField], currentDatum)); // Zeige alle Events des aktuellen Platzes an

    $('#Container') // bewege Container für Sammler und Mülleimer in den View
        .appendTo('#Belegungsplan');
    erisTrace('doLayout - Ende');
}
//*********************************************************************************

/**
	Erzeugt alle Bestandteile des Layouts des Tagesbelegungsplans.
	@param:			none
 */
function doTagesview() {
    erisTrace('doTagesview - Beginn');

    doOrtsleiste();
    doDatumsleiste();
    doPlatzleiste();
    doZeitleiste();

    $('#Belegungsplan') // bewege den Belegungsplan in den View
        .appendTo('#Tagesplan');

    erisTrace('doTagesview - Ende');

}
//*********************************************************************************

/**
	Erzeugt alle Bestandteile des Layouts des Wochenbelegungsplans.
	@param:			none
 */
function doWochenplan() {
    erisTrace('doWochenplan - Beginn');

    $('#Belegungsplan') // bewege den Belegungsplan in den View
        .appendTo('#Wochenplan');

    erisTrace('doWochenplan - Ende');

}
//*********************************************************************************
/**
 * Erzeuge die Elemente in der Ortsleiste
 */

function doOrtsleiste() {
    erisTrace('doOrtsleiste - Beginn');
    // Ort
    // ---------------------------------------------------

    $('<div/>') // Erzeuge die Ortsleiste
        .addClass('Ortsleiste')
        .attr('id', 'Ortsleiste')
        .appendTo('#Belegungsplan');

    $('<div/>') // Navigation innerhalb von Orten
        .addClass('Links')
        .attr('id', 'OrtLinks')
        .appendTo('#Ortsleiste');

    $('<div>Sportplatz Nufringen</div>') // Anzeige von Orten
        .addClass('Mitte')
        .attr('id', 'OrtMitte')
        .appendTo('#Ortsleiste');

    $('<div/>') // Navigation innerhalb von Orten
        .addClass('Rechts')
        .attr('id', 'OrtRechts')
        .appendTo('#Ortsleiste');

    $('<div><</div>') // Ort nach links
        .addClass('Links')
        .attr('id', 'OrtButtonLinks')
        .button()
        .click(function(event) {
            event.preventDefault();
            prevOrt();
        })
        .appendTo('#OrtLinks');

    $('<div>></div>') // Ort nach rechts
        .addClass('Rechts')
        .attr('id', 'OrtButtonRechts')
        .button()
        .click(function(event) {
            event.preventDefault();
            nextOrt();
        })
        .appendTo('#OrtRechts');

    erisTrace('doOrtsleiste - Ende');
}

//*********************************************************************************
/**
 * Erzeuge die Elemente in der Datumsleiste
 */

function doDatumsleiste() {
    erisTrace('doDatumsleiste - Beginn');

    // Datum
    // ---------------------------------------------------

    $('<div/>') // Erzeuge die Datumsleiste
        .addClass('Datumsleiste')
        .attr('id', 'Datumsleiste')
        .appendTo('#Belegungsplan');

    $('<div/>') // Navigation links innerhalb von Datum
        .addClass('Links')
        .attr('id', 'DatumLinks')
        .appendTo('#Datumsleiste');

    $('<div>' + erisHeute() + '</div>') // Anzeige des aktuellen Datums
        .addClass('Mitte')
        .attr('id', 'DatumMitte')
        .appendTo('#Datumsleiste');

    $('<div/>') // Navigation rechts innerhalb von Datum
        .addClass('Rechts')
        .attr('id', 'DatumRechts')
        .appendTo('#Datumsleiste');

    $('<div><</div>') // Datum nach links
        .addClass('Links')
        .attr('id', 'DatumButtonLinks')
        .button()
        .click(function(event) {
            event.preventDefault();
            prevDatum();
        })
        .appendTo('#DatumLinks');

    $('<div>></div>') // Datum nach rechts
        .addClass('Rechts')
        .attr('id', 'DatumButtonRechts')
        .button()
        .click(function(event) {
            event.preventDefault();
            nextDatum();
        })
        .appendTo('#DatumRechts');

    erisTrace('doDatumsleiste - Ende');

}
//*********************************************************************************
/**
 * Erzeuge die Elemente in der Platzleiste
 */

function doPlatzleiste() {
    erisTrace('doPlatzleiste - Beginn');
    // Platz
    // ---------------------------------------------------

    $('<div/>') // Erzeuge die Platzleiste
        .addClass('Platzleiste')
        .attr('id', 'Platzleiste')
        .appendTo('#Belegungsplan');

    $('<div/>') // Navigation innerhalb von Plätzen
        .addClass('Links')
        .attr('id', 'PlatzLinks')
        .appendTo('#Platzleiste');

    $('<div/>') // Anzeige von Plätzen
        .addClass('Mitte')
        .attr('id', 'PlatzMitte')
        .appendTo('#Platzleiste');

    $('<div/>') // Navigation innerhalb von Plätzen
        .addClass('Rechts')
        .attr('id', 'PlatzRechts')
        .appendTo('#Platzleiste');

    $('<div><</div>') // Platz nach links
        .addClass('Links')
        .attr('id', 'PlatzButtonLinks')
        .button()
        .click(function(event) {
            event.preventDefault();
            prevField();
        })
        .appendTo('#PlatzLinks');

    $('<div>></div>') // Platz nach rechts
        .addClass('Rechts')
        .attr('id', 'PlatzButtonRechts')
        .button()
        .click(function(event) {
            event.preventDefault();
            nextField();
        })
        .appendTo('#PlatzRechts');

    erisTrace('doPlatzleiste - Ende');
}

//*********************************************************************************
/**
 * Erzeuge die Elemente in der Zeitleiste
 */

function doZeitleiste() {

    erisTrace('doZeitleiste - Beginn');

    // Zeit
    // ---------------------------------------------------

    $('<div/>') // Erzeuge die Zeitleiste
        .addClass('Zeitleiste')
        .attr('id', 'Zeitleiste')
        .appendTo('#Belegungsplan');

    $('<div/>') // Anzeige der Zeit links
        .addClass('Links')
        .attr('id', 'ZeitLinks')
        .appendTo('#Zeitleiste');

    $('<div/>') // Anzeige von Plätzteilen
        .addClass('Mitte')
        .attr('id', 'ZeitMitte')
        .appendTo('#Zeitleiste');

    $('<div/>') // Anzeige der Zeit rechts
        .addClass('Rechts')
        .attr('id', 'ZeitRechts')
        .appendTo('#Zeitleiste');

    // ganztags
    // ---------------------------------------------------
    $('<div>ganz</div>') // Beschriftung links für ganztags-Ereignisse
        .addClass('Uhrzeit Rand')
        .attr('id', 'ganztags')
        .appendTo('#PlatzLinks');

    $('<div>Teil</div>') // Beschriftung links für Platzteile-Bezeichnung
        .addClass('Uhrzeit Rand')
        .attr('id', 'ganztags')
        .appendTo('#PlatzLinks');

    $('<div>ganz</div>') // Beschriftung rechts für ganztags-Ereignisse
        .addClass('Uhrzeit Rand')
        .attr('id', 'ganztags')
        .appendTo('#PlatzRechts');

    $('<div>Teil</div>') // Beschriftung rechts für Platzteile-Bezeichnung
        .addClass('Uhrzeit Rand')
        .attr('id', 'ganztags')
        .appendTo('#PlatzRechts');

    // Linke Zeitskala erzeugen 8:00 - 22:00 Uhr
    // --------------------------------------------------
    for (var uhr = BeginnZeitLeiste; uhr < EndeZeitLeiste; uhr++) { // Zeitspalte links
        $('<div>' + uhr + '<sup>00</sup></div>')
            .addClass('Uhrzeit')
            .attr('id', 'LU' + uhr)
            .css({
                'height': StundeInPixel - PlatzTeilMargin
            })
            .appendTo('#ZeitLinks');
    }

    // Rechte Zeitskala erzeugen 8:00 - 22:00 Uhr
    // --------------------------------------------------
    for (var uhr = BeginnZeitLeiste; uhr < EndeZeitLeiste; uhr++) { // Zeitspalte rechts
        $('<div>' + uhr + '<sup>00</sup></div>')
            .addClass('Uhrzeit')
            .attr('id', 'RU' + uhr)
            .css({
                'height': StundeInPixel - PlatzTeilMargin
            })
            .appendTo('#ZeitRechts');
    }


    // Bewege die Zeitskala ziemlich ans Ende
    // --------------------------------------------------
    $('#Zeitleiste').animate({
        scrollTop: 176
    }, 2000);

    erisTrace('doZeitleiste - Ende');
}

//*********************************************************************************
/**
 	Erzeugt einen Titel mit dem Platznamen über dem Tagesview für einen Platz.
	Liest alle Platznamen ein. Baut den Platz auf mit doPlatzteilview @function: doPlatzteilview 
	
	@param:				none
 */
function doPlatzview() {

    erisTrace('doPlatzview - Beginn');

    for (var pp = 0; pp < 3; pp++) {

        // Beschriftung des Platzes
        // ------------------------
        $('<div/>')
            .addClass('Platzname')
            .attr('id', 'Platzname' + Platzname[pp])
            .appendTo('#PlatzMitte');

    }

    for (pp = 0; pp < 3; pp++) {

        // Container für ganztags-Ereignisse
        // ---------------------------------
        $('<div/>') // ganztags
            .addClass('Platzganztags')
            .attr('id', 'Platzganztags' + Platzname[pp])
            .appendTo('#PlatzMitte');

    }

    for (pp = 0; pp < 3; pp++) {

        // Container für Platzteilbeschrifungen
        // ------------------------------------
        $('<div/>') // Platzteile
            .addClass('Platzteile')
            .attr('id', 'Platzteile' + Platzname[pp])
            .appendTo('#PlatzMitte');
    }



    $(document).ready(readAllFields()); // hier werden dann auch der Platzname und alle Platzteile angelegt

    for (pp = 0; pp < 3; pp++) {
        doPlatzteilview(Platzname[pp]); // Platzteile anzeigen
    }

    makePlatzDroppable();

    erisTrace('doPlatzview - Ende');
}
//*********************************************************************************

/**
	Erzeugt einen Kopf über dem Tagesview für einen Platz.
	@param: PlatzNummer = Nummer es anzuzeigenden Platzes
 */
function doPlatzteilview(PlatzNummer) {

    erisTrace('doPlatzteilview - Beginn');

    // Löschen alter Platzview-Komponenten
    // -----------------------------------
    //    $('.PlatzTeil').remove(); // Lösche alle Platzbestandteile
    //    $('.Platz').remove(); // Lösche alle Plätze

    pid = 0; // Nummerierung für Platzelemente 0..N

    // neue Breiten für Platzteile und Marker bestimmen
    // ------------------------------------------------
    PlatzTeilWidth = PlatzWidth / AnzahlPlatzTeile - PlatzTeilMargin; // Width = Width + Margin
    MarkerMinWidth = PlatzTeilWidth - MarkerPadding; // neue kleinste Markergröße

    // falls es noch keinen Container für den Platz gibt, diesen anlegen
    // -----------------------------------------------------------------
    var pk = '';
    pk = $('.Platz' + PlatzNummer).attr('id');
    if (pk === undefined)
    // Erzeuge Platz
        $('<div/>')
        .addClass('Platz')
        .attr('id', 'Platz' + PlatzNummer)
        .appendTo('#ZeitMitte');

    // Breite des Platz-Containers festlegen
    // --------------------------------------
    $('#Platz' + PlatzNummer).width(PlatzWidth); // Breite der Platz anpassen

    // erzeuge das Belegungsraster im Platz
    // ------------------------------------
    for (var uhr = BeginnZeitLeiste * AnzahlPlatzteileJeStunde; uhr < EndeZeitLeiste * AnzahlPlatzteileJeStunde; uhr++) {
        for (var pl = 0; pl < AnzahlPlatzTeile; pl++) {
            $('<div/>')
                .addClass('PlatzTeil')
                .attr('id', pid++ + PlatzNummer)
                .css('width', PlatzTeilWidth)
                .appendTo('#Platz' + PlatzNummer);
        }
    }

    erisTrace('doPlatzteilview - Ende');
}

//*********************************************************************************

/**
			Marker werden normalerweise in das Objekt gelegt, das unter der "Mitte" des Markers liegt.
			Diese Funktion liefert das Objekt unter der linken, oberen Ecke als return-Werk,
			damit der Marker dort abgelegt werden kann.
			
			
			@param	Ziel 	= lfd. Nummer des Objekts unter der Mitte des Markers
			@param	h		= Höhe des Markers, der abgelegt werden soll
			@param	w		= Breite des Markers, der abgelegt werden soll
			
			@return			= lfd. Nummer des Objekts unter der linken, oberen Ecke des Markers
							= -1, wenn unter der linken, oberen Ecke kein Objekt liegt
				
*/
//*********************************************************************************

function realZiel(Ziel, h, w) {

    erisTrace('realZiel - Beginn: Parameter = ' + Ziel + ',' + h + ',' + w);

    var zielRow = Math.floor(Ziel / AnzahlPlatzTeile);
    var zielCol = Ziel % AnzahlPlatzTeile;

    var markerH = (h + MarkerPadding + PlatzTeilMargin) / 2;
    var markerW = (w + MarkerPadding + PlatzTeilMargin) / 2;

    var markerRow = Math.floor(markerH / PlatzTeilHeight);
    var markerCol = Math.floor(markerW / PlatzTeilWidth);

    zielRow = zielRow - markerRow;
    zielCol = zielCol - markerCol;
    if (zielRow >= 0 && zielCol >= 0) {
        var ZielID = zielRow * AnzahlPlatzTeile + zielCol;
        erisTrace('realZiel - Ende: return = ' + ZielID);
        return ZielID;
    }
    else {
        erisTrace('realZiel - Ende: return = -1');
        return -1;
    }

}
//*********************************************************************************

/**
	mache die Platzhälften "droppable", damit Events darin abgelegt werden können
*/
function makePlatzDroppable() {

    erisTrace('makePlatzDroppable - Beginn');

    $('.PlatzTeil').droppable({
    	tolerance: "pointer",		// Wirft den Marker in das PlatzTeil auf das der Mouse-Pointer zeigt

    	drop: function(event, ui) { // Funktion, die beim droppen aufgerufen wird

            var Ziel = $(this).attr('id'); // ID des PlatzTeil in das gedroppt wird
            var suffix = Ziel.replace(/[0-9]/g, ''); // Ziffern entfernen
            Ziel = Ziel = parseInt(Ziel, 10); // Platzsuffix

            var MarkerID = $(ui.draggable).attr('id'); // ID des Markers der gedropped wird

            var erisEvent = new Object();
            readFromMarkerData(MarkerID, erisEvent); // übertrage .data -> Objekt

//            var ww = $(ui.draggable).css('width'); // Maße des gedroppten Marker
//            var hh = $(ui.draggable).css('height');
//            ww = parseInt(ww, 10);
//            hh = parseInt(hh, 10);

//            var real = realZiel(Ziel, hh, ww); // ermittle reales Ziel das unter der linken, oberen Ecke liegt

//            if (real >= 0) {

                $(ui.draggable).appendTo($('#' + Ziel + suffix)); // im Ziel ablegeb
                var msg = '';
                if (erisEvent.ID === undefined || erisEvent.ID === '') {
                    msg = makeEventMessage(MarkerID);
                    postEvent(msg, ui.draggable); // in DB speichern
                }
                else {
                    msg = makeEventUpdateMessage(MarkerID);
                    postEventUpdate(msg);
                }

                createEventAttributes(MarkerID, erisEvent); // erzeuge Objekt + .data aus Position und Größe des Marker
//            }

            $(ui.draggable).css({
                'top': 0,
                'left': 0
            }); // Position im Ziel oben links

        }

    });

    erisTrace('makePlatzDroppable - Ende');

}

//*********************************************************************************

/**

		erzeugt einen neuen Marker, entweder beim Lesen aus der DB oder bei betätigen eines Eventbutton
		@param: erisEvent
 */
function newEvent(erisEvent) {

    erisTrace('newEvent - Beginn: Parameter (erisID) = ' + erisEvent.ID);

    var marker = erisEvent.TeamID;
    var dauer = erisEvent.Dauer;
    var beginn = erisEvent.dateStart;

    var hoehe = minutesToPixel(dauer);
    var breite = MarkerWidth;
    var markerID = marker + mid++;

    $('<div>' + marker + '</div>')
        .addClass(altersKlasse(marker) + ' Marker')
        .attr('id', markerID)
        .height(hoehe)
        .width(breite)
        .appendTo('#Sammler')
        .draggable({
            scroll: true
        })
        .draggable("option", "revert", "invalid")
        .draggable("option", "cursorAt", {
            left: 0,
            top: 0
        })
        .draggable({
            start: function(event, ui) {
                startedDrag(event, ui)
            },
            stop: function(event, ui) {
                stoppedDrag(event, ui)
            }
        })

    .resizable({
            resize: function(event, ui) {
                var breite = (PlatzWidth / AnzahlPlatzTeile) - MarkerPadding;
                var anz = Math.round(ui.size.width / breite);
                breite = anz * PlatzTeilWidth - MarkerPadding;
                breite += anz * PlatzTeilMargin;

                if (breite < MarkerMinWidth)
                    ui.size.width = MarkerMinWidth;
                else
                    ui.size.width = breite;

                if (breite > MarkerMaxWidth)
                    ui.size.width = MarkerMaxWidth;
                else
                    ui.size.width = breite;

                ui.size.height = Math.round(ui.size.height / MarkerHeightjePlatzteil) * MarkerHeightjePlatzteil;

                var MarkerID = $(ui.element).attr('id');

                var eEvent = new Object();
                readFromMarkerData(MarkerID, eEvent);

                // belegte Platzteile ermitteln
                if (anz === 1) eEvent.Platzteil = [1];
                if (anz === 2) eEvent.Platzteil = [1, 2];
                if (anz === 3) eEvent.Platzteil = [1, 2, 3];
                if (anz === 4) eEvent.Platzteil = [1, 2, 3, 4];

                storeToMarkerData(MarkerID, eEvent);
            }
        })
        .resizable({
            stop: function(event, ui) {
                var MarkerID = $(ui.element).attr('id');

                var msg = '';
                var erisEvent = new Object();
                createEventAttributes(MarkerID, erisEvent);
                readFromMarkerData(MarkerID, erisEvent); // übertrage .data -> Objekt
                msg = makeEventUpdateMessage(MarkerID);
                postEventUpdate(msg);
            }
        })

    .resizable("option", "minWidth", MarkerMinWidth)
        .resizable("option", "maxWidth", MarkerMaxWidth)
        .resizable("option", "minHeight", MarkerMinHeight)

    .on({
        click: function() {
            var mmID = this.id;


            $('<div></div>').dialog({
                modal: true,
                title: "Event-Info",
                open: function(event, ui) {
                    var MarkerID = mmID;
                    var erisEvent = new Object();
                    createEventAttributes(MarkerID, erisEvent);
                    readFromMarkerData(MarkerID, erisEvent); // übertrage .data -> Objekt
                    var markup = erisToolTip(markerID, erisEvent);
                    $(this).html(markup);
                },
                buttons: {
                    Ok: function() {
                        $(this).dialog("close");
                    }
                }
            }); //end confirm dialog
        }

    });
    /*
        .hover(function() {
            var mmID = this.id;

            $('<div/>')
                .dialog({
                    modal: true,
                    title: "Event-Info",
                    open: function(event, ui) {
                        var MarkerID = mmID;
                        var erisEvent = new Object();
                        readFromMarkerData(MarkerID, erisEvent); // übertrage .data -> Objekt
                        var markup = erisToolTip(markerID, erisEvent);
                        $(this).html(markup);
                    }
                })
                .addClass('EventInfo');
        }, function() {
            $('.EventInfo').dialog("close");
        });
    */
    if (beginn.length > 0) {
        var hour = parseInt(beginn[1].split(':')[0], 10);
        var minute = parseInt(beginn[1].split(':')[1], 10);
        var zielID = (hour - BeginnZeitLeiste) * AnzahlPlatzteileJeStunde * AnzahlPlatzTeile + (minute / (StundeInMinuten / AnzahlPlatzteileJeStunde) * AnzahlPlatzTeile); // je Stunde x Raster; Beginn allerdings bei 8:00 Uhr (8*x Raster versetzt)
        if (zielID >= 0 && zielID < AnzahlPlatzteileJeStunde * AnzahlPlatzTeile * AnzahlStunden) {
            $('#' + markerID)
                .appendTo('#' + zielID + Platzname[currentField]);
        }
        else {
            alert('Event außerhalb des darstellbaren Bereiches ' + marker + ' ' + beginn);
        }
    }
    storeToMarkerData(markerID, erisEvent);

    // qTip für den Marker
    var markup = erisToolTip(markerID, erisEvent);
    $('#'+markerID).qtip({ // Grab some elements to apply the tooltip to
        content: {
        	title: erisEvent.TeamID,
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
    
    erisTrace('newEvent - Ende');
}

//*********************************************************************************
function startedDrag(event, ui) {

    erisTrace('startedDrag - Beginn');

    if (event.shiftKey)
        $('#Zeitleiste').css({
            overflow: 'visible'
        });
    else
        $('#Zeitleiste').css({
            overflow: 'auto'
        });

    erisTrace('startedDrag - Ende');
}
//*********************************************************************************
function stoppedDrag(event, ui) {

    erisTrace('stoppedDrag - Beginn');

    $('#Zeitleiste').css({
        overflow: 'auto'
    });
    erisTrace('stoppedDrag - Ende');
}
//*********************************************************************************

//*********************************************************************************

/**
	storeToMarkerData: 
	Überträgt die Eigenschaften eines Event in .data des jQuery-Elements
	
	@param	erisID 			= 	Event.ID 			= interner Schlüssel
	@param	erisStart		= 	Event.start			= Datum und Uhrzeit des Beginns
	@param	erisDauer		=	Event.Dauer 		= Dauer in Minuten 
	@param	erisBeschreibung=	Event.Beschreibung	= Beschreibung des Termins
	@param	erisTeamID		=	Event.TeamID 		= Team Kürzel
	@param	erisSpiel		=	Event.Spiel			= Spiel j/n
	@param	erisSerie		=	Event.Serie			= Teil einer Terminserie j/n
	@param	erisPlatz		=	Event.Platz			= Platz
	@param	erisPlatzteil	=	Event.Platzteil		= Platzteile Array [1,2,3,4]
	@param	erisDateStart	=	Event.dateStart		= Array [0] = Datum, [1] = Zeit

 */
function storeToMarkerData(mID, eEvent) {

    erisTrace('storeToMarkerData - Beginn');

    if (eEvent.ID.length === 0) {
        eEvent.ID = undefined;
        eEvent.start = undefined;
        eEvent.spiel = undefined;
        eEvent.serie = undefined;
        eEvent.Platz = undefined;
        eEvent.Platzteil = undefined;
        eEvent.dateStart = undefined;
    }

    $('#' + mID)
        .data('erisID', eEvent.ID)
        .data('erisStart', eEvent.start)
        .data('erisDauer', eEvent.Dauer)
        .data('erisBeschreibung', eEvent.Beschreibung)
        .data('erisTeamID', eEvent.TeamID)
        .data('erisSpiel', eEvent.Spiel)
        .data('erisSerie', eEvent.Serie)
        .data('erisPlatz', eEvent.Platz)
        .data('erisPlatzteil', eEvent.Platzteil)
        //	.data('erisGroup', eEvent.Team)
        .data('erisDateStart', eEvent.dateStart);

    erisTrace('storeToMarkerData - Ende');
}
//*********************************************************************************

/**

		Überträgt die .data-Eigenschaften des jQuery-Elements in Variablen.
*/
function readFromMarkerData(mID, eEvent) {

    erisTrace('readFromMarkerData - Beginn');

    eEvent.ID = $('#' + mID).data('erisID');
    eEvent.start = $('#' + mID).data('erisStart');
    eEvent.Dauer = $('#' + mID).data('erisDauer');
    eEvent.Beschreibung = $('#' + mID).data('erisBeschreibung');
    eEvent.TeamID = $('#' + mID).data('erisTeamID');
    eEvent.Spiel = $('#' + mID).data('erisSpiel');
    eEvent.Serie = $('#' + mID).data('erisSerie');
    eEvent.Platz = $('#' + mID).data('erisPlatz');
    eEvent.Platzteil = $('#' + mID).data('erisPlatzteil');
    //	eEvent.Team = $('#'+mID).data('erisGroup');
    eEvent.dateStart = $('#' + mID).data('erisDateStart');

    erisTrace('readFromMarkerData - Ende');
}
//*********************************************************************************

/**
	Berechnet aus der Position und der Länge/Breite eines Marker die Eigenschaften des erisElements
	
	@param mID 		= css-id des Marker
	@param eEvent 	= erzeutes Objekt mit Eigenschaften des Marker 
 */
function createEventAttributes(mID, eEvent) {

    erisTrace('createEventAttributes - Beginn');

    var real = $('#' + mID).parent().attr('id');
    var suffix = real.replace(/[0-9]/g, ''); // Ziffern entfernen
    real = parseInt(real, 10);

    // ID
    eEvent.ID = $('#' + mID).data('erisID');

    // TeamId
    eEvent.TeamId = $('#' + mID).text();

    // Dauer
    var ww = $('#' + mID).css('width'); // Maße des gedroppten Marker
    var hh = $('#' + mID).css('height');
    ww = parseInt(ww, 10);
    hh = parseInt(hh, 10);
    eEvent.Dauer = pixelToMinutes(hh); // Minuten aus Pixel berechnet

    // start
    var Stunde = real / AnzahlPlatzTeile / AnzahlPlatzteileJeStunde + BeginnZeitLeiste; // volle Stunde aus Zeile berechnet 
    var StundeString = Math.floor(Stunde); // volle Stunde aus Zeile berechnet 

    var xxx = (StundeString - BeginnZeitLeiste) * AnzahlPlatzTeile * AnzahlPlatzteileJeStunde;
    xxx = real - xxx; // 0 - 15tes Platzteilraster innerhalb einer Stunde

    var MinuteString = Math.floor(xxx / AnzahlPlatzTeile);
    if (MinuteString === 0) MinuteString = '00';
    if (MinuteString === 1) MinuteString = '15';
    if (MinuteString === 2) MinuteString = '30';
    if (MinuteString === 3) MinuteString = '45';

    var DatumString = $('#DatumMitte').text(); // Datum aus der Anzeige

    eEvent.start = DatumString + " " + StundeString + ":" + MinuteString;

    // startDate
    var dd = [];
    dd[0] = DatumString;
    dd[1] = StundeString + ":" + MinuteString;
    eEvent.startDate = dd;

    // Platz
    eEvent.Platz = $('#Platzname' + suffix).text();



    // description
    eEvent.description = "Training";

    $('#' + mID)
        .data('erisID', eEvent.ID)
        .data('erisStart', eEvent.start)
        .data('erisDauer', eEvent.Dauer)
        .data('erisBeschreibung', eEvent.Beschreibung)
        .data('erisTeamID', eEvent.TeamID)
        .data('erisSpiel', eEvent.Spiel)
        .data('erisSerie', eEvent.Serie)
        .data('erisPlatz', eEvent.Platz)
        .data('erisPlatzteil', eEvent.Platzteil)
        //	.data('erisGroup', eEvent.Team)
        .data('erisDateStart', eEvent.dateStart);

    erisTrace('createEventAttributes - Ende');
}
//*********************************************************************************

/**
		Liest die Gruppen und Teams aus der DB und legt für jedes Team einen "Button" an.
		Die "Button" werden gruppiert dargestellt.
		
		@reference		readAllGroups, readAllTeams
 */
function doEventbutton() {

    erisTrace('doEventbutton - Beginn');

    doClearEventbuttons();
    $(document).ready(readAllGroups());
    $(document).ready(readAllTeams());

    erisTrace('doEventbutton - Ende');
}
//*********************************************************************************
/**
 * Hilfsfunktion, solange die Daten nicht aus der DB kommen
 * 
 * @param TeamID
 * @returns Bezeichnung der Alterklasse
 */
function altersKlasse(TeamID) {
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
//*********************************************************************************

/**

	Erzeugt eine Fußzeile im Belegungsplan.
*/
function doFuss() {

    erisTrace('doFuss - Beginn');

    $('<div/>')
        .addClass('foot')
        .appendTo('#Container');

    $('<div>Sammeleimer</div>')
        .addClass('Sammeleimer')
        .attr('id', 'Eimertitel')
        .appendTo('#Container');

    $('<div>Mülleimer</div>')
        .addClass('Muelleimer')
        .attr('id', 'Sammlertitel')
        .appendTo('#Container');

    $('<div/>')
        .addClass('Sammeleimer')
        .attr('id', 'Sammler')
        .appendTo('#Container');

    $('<div/>')
        .addClass('Muelleimer')
        .attr('id', 'Eimer')
        .appendTo('#Container');

    $('#Sammler').droppable({
        drop: function(event, ui) { // Funktion, die beim droppen aufgerufen wird

            $(ui.draggable).appendTo($(this)) // im Ziel ablegeb
                .css({
                    'top': 0,
                    'left': 0
                }); // Position im Ziel oben links
        }
    });

    erisTrace('doFuss - Ende');
}
//*********************************************************************************

/**
		Blättern der Anzeige für Datum
*/
function prevDatum() {
    erisTrace('prevDatum - Beginn');

    var aktDat = $('#DatumMitte').text();
    currentDatum = erisBerechneDatum(aktDat, -1);
    $('#DatumMitte').text(currentDatum);
    doClearMarker(); // alle Events von der Anzeige entfernen
    $(document).ready(readAllEvents(fieldTitle[currentField], currentDatum)); // alle Events des neuen Datums anzeigen

    erisTrace('prevDatum - Ende');
}
//*********************************************************************************

/**
		Blättern der Anzeige für Datum
*/
function nextDatum() {
    erisTrace('nextDatum - Beginn');

    var aktDat = $('#DatumMitte').text();
    currentDatum = erisBerechneDatum(aktDat, +1);
    $('#DatumMitte').text(currentDatum);
    doClearMarker(); // alle Events von der Anzeige entfernen
    $(document).ready(readAllEvents(fieldTitle[currentField], currentDatum)); // alle Events des neuen Datums anzeigen

    erisTrace('nextDatum - End');
}
//*********************************************************************************

/**
		Blättern der Anzeige für Plätze
*/
function prevField() {
    currentField--;
    currentDatum = $('#DatumMitte').text(); // Datum aus der Anzeige
    if (currentField < 0) currentField = fieldAmount - 1; // In Kreis blättern
    if (AnzahlPlatzTeile !== fieldPortions[currentField]) { // falls Platzteileanzahl abweicht, muss der Platz neu aufgebaut werden
        AnzahlPlatzTeile = fieldPortions[currentField]; // neu Platzportionierung merken
        doPlatzteilview(Platzname[currentField]); // Platzeile neu aufbauen
    }

    doClearMarker(); // alle Events von der Anzeige entfernen
    $('#Platzname').text(fieldTitle[currentField]); // neuen Platznamen in den Titel
    setFieldPartTitle(currentField); // neue Bezeichnung der Platzteile
    $(document).ready(readAllEvents(fieldTitle[currentField], currentDatum)); // alle Events des neuen Platzes anzeigen
}
//*********************************************************************************

/**

	Blättern der Anzeige für Plätze
*/
function nextField() {
    currentField++;
    currentDatum = $('#DatumMitte').text(); // Datum aus der Anzeige
    if (currentField >= fieldAmount) currentField = 0; // In Kreis blättern
    if (AnzahlPlatzTeile !== fieldPortions[currentField]) { // falls Platzteileanzahl abweicht, muss der Platz neu aufgebaut werden
        AnzahlPlatzTeile = fieldPortions[currentField]; // neu Platzportionierung merken
        doPlatzteilview(Platzname[currentField]); // Platzeile neu aufbauen
    }

    doClearMarker(); // alle Events von der Anzeige entfernen
    $('#Platzname').text(fieldTitle[currentField]); // neuen Platznamen in den Titel
    setFieldPartTitle(currentField); // neue Bezeichnung der Platzteile
    $(document).ready(readAllEvents(fieldTitle[currentField], currentDatum)); // alle Events des neuen Platzes anzeigen
}
//*********************************************************************************

/**

		setzt die Platzteile-Bezeichung für einen Platz
*/
function setFieldPartTitle(a) {
    erisTrace('setFieldPartTitle - End: Parameter = ' + a);

    var suffix = Platzname[a];

    for (var pl = 0; pl < fieldPortions[a]; pl++) {
        var ptn = fieldPartTitle[a][pl];
        $('<div>' + ptn + '</div>') // neue Bezeichung der Platzteile erzeugen
            .addClass('Platzteil')
            .attr('id', 'Platzteil' + pl + suffix)
            .css('width', PlatzTeilWidth)
            .appendTo('#Platzteile' + suffix);
    }

    erisTrace('setFieldPartTitle - Ende');
}
//*********************************************************************************

/**
		generiert die Message für das xmlHTTP-POST (GET)
*/

function makeEventMessage(id) {
    erisTrace('makeEventMessage - Beginn: Parameter = ' + id);

    var erisEvent = new Object();
    createEventAttributes(id, erisEvent);
    var ff = erisEvent.Platz;
    ff = ff.replace(/\s/g, '%20'); // maskiere Blank durch %20

    var dd = erisEvent.start;
    dd = dd.replace(/\./g, '%2E'); // maskiere . durch %2E
    dd = dd.replace(/\s/g, '%20'); // maskiere Blank durch %20
    dd = dd.replace(/\:/g, '%3A'); // maskiere : durch %3A

    var msg = erisEvent.description + '/' + dd + '/' + erisEvent.Dauer + '/' + erisEvent.TeamId + '/' + ff + '/' + "1%2B2";

    erisTrace('makeEventMessage - Ende');

    return msg;
}
//*********************************************************************************

/**
		generiert die Message für das xmlHTTP-POST (GET)

		msg = /12.10.2016%2017%3A00/90/Kunstrasen'
*/

function makeEventUpdateMessage(id) {
    erisTrace('makeEventUpdateMessage - Beginn: Parameter = ' + id);
    var erisEvent = new Object();
    createEventAttributes(id, erisEvent);
    var ff = erisEvent.Platz;
    ff = ff.replace(/\s/g, '%20'); // maskiere Blank durch %20

    var dd = erisEvent.start;
    dd = dd.replace(/\./g, '%2E'); // maskiere . durch %2E
    dd = dd.replace(/\s/g, '%20'); // maskiere Blank durch %20
    dd = dd.replace(/\:/g, '%3A'); // maskiere : durch %3A

    var msg = erisEvent.ID + '/' + dd + '/' + erisEvent.Dauer + '/' + ff + '/' + "1%2B2";

    erisTrace('makeEventUpdateMessage - Ende');
    return msg;
}
//*********************************************************************************

/*********************************************************************************
		Entfernt alle Eventmarker aus der Ansicht
 */
function doClearMarker() {
    erisTrace('doClearMarker - Beginn');
    $('.Marker').remove();
    erisTrace('doClearMarker - Ende');
}
//*********************************************************************************

/*********************************************************************************

		Entfernt alle Eventbutton aus der Ansicht
 */
function doClearEventbuttons() {
    erisTrace('doClearEventbuttons - Beginn');
    $('.Eventbutton').remove();
    $('.Buttongroup').remove();
    erisTrace('doClearEventbuttons - Ende');
}
//*********************************************************************************

/**

	rechnet Pixel in Minuten um
 */
function pixelToMinutes(hh) {
    erisTrace('pixelToMinutes - Beginn/Ende');

    return Math.round((hh + MarkerPadding + PlatzTeilMargin) / StundeInPixel * StundeInMinuten); // Minuten aus Pixel berechnet
}
//*********************************************************************************

/**
		rechnet Minuten in Pixel um
 */
function minutesToPixel(hh) {
    erisTrace('minutesToPixel - Beginn/Ende');

    return (Math.round(hh / StundeInMinuten * StundeInPixel)) - MarkerPadding - PlatzTeilMargin; // Pixel aus Minuten berechnet
}
//*********************************************************************************

/**
	generiert den ToolTip-Inhalt

	@param erisID 			= 	Event.ID 			= interner Schlüssel
	@param erisStart		= 	Event.start			= Datum und Uhrzeit des Beginns
	@param erisDauer		=	Event.Dauer 		= Dauer in Minuten 
	@param erisBeschreibung=	Event.Beschreibung	= Beschreibung des Termins
	@param erisTeamID		=	Event.TeamID 		= Team Kürzel
	@param erisSpiel		=	Event.Spiel			= Spiel j/n
	@param erisSerie		=	Event.Serie			= Teil einer Terminserie j/n
	@param erisPlatz		=	Event.Platz			= Platz
	@param erisPlatzteil	=	Event.Platzteil		= Platzteile Array [1,2,3,4]
	@param erisDateStart	=	Event.dateStart		= Array [0] = Datum, [1] = Zeit

 */
function erisToolTip(markerID, erisEvent) {
    erisTrace('erisToolTip - Beginn');
    var tt = 'erisID = ' + erisEvent.ID + '<br\>';
    tt += 'erisStart = ' + erisEvent.start + '<br\>';
    tt += 'erisDauer = ' + erisEvent.Dauer + '<br\>';
    tt += 'erisBeschreibung = ' + erisEvent.Beschreibung + '<br\>';
    tt += 'erisTeamID = ' + erisEvent.TeamID + '<br\>';
    tt += 'erisSpiel = ' + erisEvent.Spiel + '<br\>';
    tt += 'erisSerie = ' + erisEvent.Serie + '<br\>';
    tt += 'erisPlatz = ' + erisEvent.Platz + '<br\>';
    tt += 'erisPlatzteil = ' + erisEvent.Platzteil + '<br\>';
    tt += 'erisDateStart = ' + erisEvent.dateStart;

    erisTrace('erisToolTip - Ende');
    return tt;
}
