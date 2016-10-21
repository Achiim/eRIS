/**
 * 	Fasst alle Routinen für Zeit, Datum und deren Manipulation zusammen
 */

// *********************************************************************
/** 
 * liefert das aktuelle Datum im Format TT.DD.JJJJ
 * 
 * @return heute
 */ 
function erisHeute() {
	var today = new Date();	// aktuelles Datum
	var tag = today.getDate();	// aktueller Tag
	var monat = today.getMonth()+1; // aktueller Monat
	var jahr = today.getFullYear(); // aktuelles Jahr
	var heute =  tag + '.' + monat + '.' + jahr; // Formatiere Rückgabe
	return heute;
}

//*********************************************************************

/**
 * 
 * rechnet mit Tagen
 * 
 * @param datum = dd.mm.jjjj
 * @param detlaTage = +/- Anzahl Tage zur Berechnung eines neuen Datums
 */
function erisBerechneDatum(datum,deltaTage) {
	var maxTageImMonat;
	var dd = datum.split('.');		// tt.mm.jjjj
	var tt = parseInt(dd[0]);
	var mm = parseInt(dd[1]);
	var jj = parseInt(dd[2]);
	
	// berechne neuen Tag
	// ------------------
	var nt = tt + deltaTage;
	var nd = new Date(jj,mm-1,nt);	// aktuelles Datum
	
	var tag = nd.getDate();	// aktueller Tag
	var monat = nd.getMonth()+1; // aktueller Monat
	var jahr = nd.getFullYear(); // aktuelles Jahr
	var neuDatum =  tag + '.' + monat + '.' + jahr; // Formatiere Rückgabe
	return neuDatum;
}
