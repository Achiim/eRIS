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
 * Alle global gültigen Konstanten und Variablen werden hier definiert
 */
// Trace
const erisTraceLevel = 0;									// 1 - Trace eingeschalten | 0 - Trace ausgeschalten

// ViewKonstanten
const erisMaxFieldsInView = 6;								// max. Anzahl der nebeneinander darstellbaren Plätze,  bevor gescrollt wird
	
// Zeitkonstanten
const erisPixelStunde = 28;                               // 28 Pixel repräsentieren eine Stunden
const erisPixelViertelstunde = erisPixelStunde/4;         // 7 Pixel je Viertelstunde
const erisZeitAchsenlaenge = 14*erisPixelStunde;          // 392 = 14h * 28 Pixel je Stunde

// Marker Konstanten
const erisMarkerPadding = 2*5;                            // Polsterung im Marker (5 Pixel nach oben, unten, links und rechts)
const erisMarkerHeightViertelstunde = erisPixelViertelstunde - 1;

// Platz Konstanten
const erisPlatzWidth = 120;                               // jeder Platz wird mit 120 Pixel in der Breite dargestellt
const erisPlatzHeight = erisZeitAchsenlaenge;             // jeder Platz ist so lange wie die Zeitachse
const erisPlatzTeilMargin = 0;                            // jedes Platzteil hat unten 1 Pixel Abstand zum nächsten

const erisAnzahlPlatzTeilejeStunde = 4                    // ein Platzteil repräsentiert 15 Minuten (1/4 Stunde)
const erisPlatzteilHeight = erisPixelViertelstunde;		  // 7 Pixel Höhe des Platzteils ( 1 Pixel für Margin unten abgezogen)

// globale Variablen
var erisPlatzArray = [];                                  // sammelt alle Objekte für Plätze
var Timeline = {};                                        // Objekt mit der Datumsachse