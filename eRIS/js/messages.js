/**
 * 
 * Sportstaetten-Reservierungs-System *
 * 
 * @author Achim
 * @version 2016
 * @copyright alle Rechte vorbehalten
 * 
 * @description Funktionen zur Ausgabe von Meldungen
 */
/* global $ */
/* global erisTraceLevel */

/*******************************************************************************
 * Funktion: erisLog Zweck: gibt eine formatierte Meldung aus
 */
function erisLog(msg) {

  console.log(erisTimestamp() + ': eRIS - ' + msg);
}

/*******************************************************************************
 * Funktion: erisError Zweck: gibt eine formatierte Fehlermeldung aus
 */
function erisError(msg) {

  console.error(erisTimestamp() + ': eRIS - ' + msg);
}

/*******************************************************************************
 * Funktion: erisTrace Zweck: gibt eine formatierte Meldung aus
 */
function erisTrace(msg) {

  if (erisTraceLevel) console.info(erisTimestamp() + ': eRIS - Trace: ' + msg);
}
/*******************************************************************************
 * Funktion: erisMessage Zweck: Ausgabe einer Meldung im sichtbaren Meldungsbereich
 */
function erisMessage(msg) {

	$( "#MeldungsContainer" ).append( "<li>" + erisTimestamp() + ': eRIS - ' + msg + "</li>" );
}
/*******************************************************************************
 * Funktion: erisClear Zweck: leere den sichtbaren Meldungsbereich
 */
function erisClear(msg) {

	$( "#MeldungsContainer li" ).remove();
}

