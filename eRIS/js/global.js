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
 * Alle global gültigen Komstanten werden hier definiert
 */

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
const erisPlatzTeilMargin = 1;                            // jedes Platzteil hat unten 1 Pixel Abstand zum nächsten

const erisAnzahlPlatzTeilejeStunde = 4                    // ein Platzteil repräsentiert 15 Minuten (1/4 Stunde)
const erisPlatzteilHeight = erisPixelViertelstunde - 1;   // 6 Pixel Höhe des Platzteils ( 1 Pixel für Margin unten abgezogen)

var erisPlatzArray = [];                                  // sammelt alle Objekte für Plätze
var Timeline = {};                                        // Objekt mit der Datumsachse