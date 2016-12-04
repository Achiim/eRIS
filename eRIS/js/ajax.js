/**
 *  ****************************************
 * * Sportstaetten-Reservierungs-System   *
 * ****************************************
 * 
 * @author   Achim
 * @version  2016
 * @copyright  alle Rechte vorbehalten
 *
 * @description
 * Funktionen für ajax-Aufrufe in die Google Cloud
 */

/*******************************************************************************
 * Funktion: erisCreateCORSRequest Zweck: Generiert einen Cross-Origin Ressource
 * Sharing Request, damit auf den Google-Cloud-Server zugegriffen werden kann.
 * 
 * Template from: https://www.html5rocks.com/en/tutorials/cors/
 */
function erisCreateCORSRequest(method, url) {

	erisTrace('erisCreateCORSRequest - Beginn: Parameter = ' + method + ', ' + url);
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		// XHR for Chrome/Firefox/Opera/Safari.
		// false = synchroner Aufruf der url
		// true = asynchroner Aufruf
		xhr.open(method, url, true);
	}
	else if (typeof XDomainRequest !== "undefined") {
		// XDomainRequest for IE.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// CORS not supported.
		xhr = null;
	}

	erisTrace('erisCreateCORSRequest - Ende');
	return xhr;
}

function erisAjaxGet(method, url, erisAjaxSucess, erisAjaxError) {
	// cross origin request definieren
	var erisGet = erisCreateCORSRequest('GET', url, true);
	if (typeof erisGet === undefined) {
		erisError('erisAjaxGet: CORS not supported for ' + url);
		erisAjaxError(erisGet);
		return;
	}

	erisGet.onreadystatechange = function() {

		    if (erisGet.readyState === 4 && erisGet.status === 200) {

		    	erisTrace('erisGet.onreadystatechange - abgeschlossen mit DONE und HTTP-Status OK:'
		              + erisGet.responseText); // erfolgreich abgeschlossen
		    	erisAjaxSucess(erisGet);
		    } else {
				erisError('erisGet.onreadystatechange - abgeschlossen mit Error und HTTP-Status: ' + erisGet.status);
//				erisAjaxError(erisGet);
		    }
	}; // Ende von erisGet.onreadystatechange
	
	erisGet.onerror = function() {
			erisError('erisGet.onerror - error occured');
			erisAjaxError(erisGet);
	};
	
	erisGet.send();

};