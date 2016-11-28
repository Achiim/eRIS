/**
 * 
 * Sportstaetten-Reservierungs-System *
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 *
 * @description
 *    Fasst alle Routinen für Zeit, Datum und deren Manipulation zusammen
 */
//*********************************************************************************
/**
 * @global
 */
"use strict"; // Verwendung des Strict-Modus zur Laufzeit

//*********************************************************************
/**
 * liefert das aktuelle Datum im Format TT.DD.JJJJ
 * 
 * @return heute
 */
function erisHeute() {
  var today = new Date(); // aktuelles Datum
  var tag = today.getDate(); // aktueller Tag
  var monat = today.getMonth() + 1; // aktueller Monat
  var jahr = today.getFullYear(); // aktuelles Jahr
  var heute = tag + '.' + monat + '.' + jahr; // Formatiere Rückgabe
  return heute;
}

// *********************************************************************

//*********************************************************************
/**
 * liefert das aktuelle Datum und Zeit im Format TT.DD.JJJJ hh:mm:ss
 * 
 * @return jetzt
 */
function erisJetzt() {
  var today = new Date(); // aktuelles Datum
  var tag = today.getDate(); // aktueller Tag
  var monat = today.getMonth() + 1; // aktueller Monat
  var jahr = today.getFullYear(); // aktuelles Jahr

  var stunde = today.getHours(); // aktuelle Stunden
  var minute = today.getMinutes(); // aktuelle Minuten
  var sekunde = today.getSeconds(); // aktuelle Sekunden

  var jetzt = tag + '.' + monat + '.' + jahr + ' ' + stunde + ':' + minute + ':' + sekunde; // Formatiere Rückgabe
  return jetzt;
}

// *********************************************************************

/**
 * 
 * rechnet mit Tagen
 * 
 * @param datum =
 *          dd.mm.jjjj
 * @param detlaTage =
 *          +/- Anzahl Tage zur Berechnung eines neuen Datums
 */
function erisBerechneDatum(datum, deltaTage) {
  var dd = datum.split('.'); // tt.mm.jjjj
  var tt = parseInt(dd[0], 10);
  var mm = parseInt(dd[1], 10);
  var jj = parseInt(dd[2], 10);

  // berechne neuen Tag
  // ------------------
  var nt = tt + deltaTage;
  var nd = new Date(jj, mm - 1, nt); // aktuelles Datum

  var tag = nd.getDate(); // aktueller Tag
  var monat = nd.getMonth() + 1; // aktueller Monat
  var jahr = nd.getFullYear(); // aktuelles Jahr
  var neuDatum = tag + '.' + monat + '.' + jahr; // Formatiere Rückgabe
  return neuDatum;
}

// *********************************************************************

/**
 * 
 * Wandelt Datum in die interne Darstellung
 * 
 * @param datum =
 *          dd.mm.jjjj
 * @returns interner Wert des Datums
 */
function erisDatum2Wert(datum) {
  var dd = datum.split('.'); // tt.mm.jjjj
  var tt = parseInt(dd[0], 10);
  var mm = parseInt(dd[1], 10);
  var jj = parseInt(dd[2], 10);
  var nd = new Date(jj, mm - 1, tt); // Datumswert, mit dem gerechnet werden
  // kann
  return nd.getTime();
}

// *********************************************************************

/**
 * 
 * Wandelt interne Darstellung in dd.mm.jjjj
 * 
 * @param wert =
 *          interner Wert des Datums
 * @retuns = dd.mm.jjjj
 */
function erisWert2Datum(wert) {
  var today = new Date(wert); // Datumswert, mit dem gerechnet werden kann
  var tag = today.getDate(); // aktueller Tag
  var monat = today.getMonth() + 1; // aktueller Monat
  var jahr = today.getFullYear(); // aktuelles Jahr
  var heute = tag + '.' + monat + '.' + jahr; // Formatiere Rückgabe
  return heute;
}

//*********************************************************************
/**
 * liefert das aktuelle Datum im Format TT.DD.JJJJ hh:mm:ss.ms
 * 
 * @return timestamp
 */
function erisTimestamp() {
  var today = new Date(); // aktuelles Datum
  var tag = today.getDate(); // aktueller Tag
  var monat = today.getMonth() + 1; // aktueller Monat
  var jahr = today.getFullYear(); // aktuelles Jahr
  var stunde = today.getHours();
  var minute = today.getMinutes();
  var sekunde = today.getSeconds();
  var millisekunde = ('00' + today.getMilliseconds())
        .slice(-3); // mit fuehrenden Nullen
  var timestamp = tag + '.' + monat + '.' + jahr + ' ' + stunde + ':' + minute
          + ':' + sekunde + '.' + millisekunde; // Formatiere Rückgabe
  return timestamp;
}

//*********************************************************************
/**
 * liefert zu einem Datum TT.MM.JJJJ den Monatsnamen
 * 
 * @return monatsname = Monatsname in deutsch
 */
function erisMonatsname(datum) {
	var dd = datum.split('.'); // tt.mm.jjjj
	var tt = parseInt(dd[0], 10);
	var mm = parseInt(dd[1], 10);
	var jj = parseInt(dd[2], 10);
	var monatsname = '';
	
	if (mm === 1) monatsname = 'Januar';
	if (mm === 2) monatsname = 'Februar';
	if (mm === 3) monatsname = 'März';
	if (mm === 4) monatsname = 'April';
	if (mm === 5) monatsname = 'Mai';
	if (mm === 6) monatsname = 'Juni';
	if (mm === 7) monatsname = 'Juli';
	if (mm === 8) monatsname = 'August';
	if (mm === 9) monatsname = 'September';
	if (mm === 10) monatsname = 'Oktober';
	if (mm === 11) monatsname = 'November';
	if (mm === 12) monatsname = 'Dezember';
	
	return monatsname;
}

//*********************************************************************
/**
 * liefert zu einem Datum TT.MM.JJJJ den Tagesnamen
 * 
 * @return tagesname = Tagesname in deutsch
 */
function erisTagesname(datum) {
	var dd = datum.split('.'); // tt.mm.jjjj
	var tt = parseInt(dd[0], 10);
	var mm = parseInt(dd[1], 10);
	var jj = parseInt(dd[2], 10);

	var td = new Date(jj, mm - 1, tt);
	var tn = td.getDay();
	var tagesname = '';
	
	if (tn === 0) tagesname = 'Sonntag';
	if (tn === 1) tagesname = 'Montag';
	if (tn === 2) tagesname = 'Dienstag';
	if (tn === 3) tagesname = 'Mitwoch';
	if (tn === 4) tagesname = 'Donnerstag';
	if (tn === 5) tagesname = 'Freitag';
	if (tn === 6) tagesname = 'Samstag';
	
	return tagesname;
}
