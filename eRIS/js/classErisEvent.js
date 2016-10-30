/**
 * 
     ****************************************
	* Sportstaetten-Reservierungs-System   *
	****************************************
	
	@author		Achim
	@version	2016
	@copyright 	alle Rechte vorbehalten

	@description
  	Definition der Klasse "Datumsachse" mit allen Eigenschaften und Methoden.
*/

/*global $*/
/*global erisDatum2Wert*/
/*global erisBerechneDatum*/
/*global erisWert2Datum*/
/*global erisTrace*/

class ErisEvent {

	
	constructor(id, startTime, duration, description, team, match, partOfSeries, field, portion) {
		
		this.ID = id; // interner Schlüssel
		this.start = startTime; // Datum und Uhrzeit des Beginns
		this.Dauer = duration; // Dauer in Minuten 
		this.Beschreibung = description; // Beschreibung
		this.TeamID = team; // Team Kürzel
		this.Spiel = match; // Team Kürzel
		this.Serie = partOfSeries; // Teil einer Terminserie
		this.Platz = field; // Platz
		this.Platzteil = portion; // Platzteile
		this.dateStart = startTime.split(' '); // Array [0] = Datum, [1] = Zeit

		var dateStart = this.start.split(' ');
		var day = parseInt(dateStart[0].split('.')[0], 10);
		var month = parseInt(dateStart[0].split('.')[1], 10);
		var year = parseInt(dateStart[0].split('.')[2], 10);
		var hour = parseInt(dateStart[1].split(':')[0], 10);
		var minute = parseInt(dateStart[1].split(':')[1], 10);


	}
	

}