import clock from "clock";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { battery } from 'power';
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { geolocation } from "geolocation";
import {sunCalcLibrary} from "../common/sun";
import { listDirSync } from "fs";
import { rootCertificates } from "tls";
import { debug } from "console";
import * as fs from "fs";

// Update the clock every minute. This can be seconds, minutes, or hours
clock.granularity = "minutes";

// Get a handle on the <text> element
const _clock = document.getElementById("clock-label");
const _date = document.getElementById("date-label");
const _heartRate = document.getElementById("heart-rate-label");
const _batteryLevel = document.getElementById("battery-label");

const _moon = document.getElementById("moon");
const _sky = document.getElementById("sky");


let today = new Date();


// Update the <text> element every tick with the current time
clock.ontick = (evt) => {

  today = evt.date;

  updateHeartRateSensor();
  checkAndUpdateBatteryLevel();
  updateTime(today);
  updateDate(today);

  geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);

}


  function rotateSun(degs){
    try{
    let mooninstance = document.getElementById("mooninstance");
    let moongroup = mooninstance.getElementById("moongroup");
    
   moongroup.groupTransform.rotate.angle = degs;
   
   mooninstance.animate("enable");
    }
    catch (error)
    {
      console.log(error);
    }
 }


console.log("Confirm Library Import: " + sunCalcLibrary());
sunCalcLibrary();

// Create a new instance of the HeartRateSensor object
let _hrm = new HeartRateSensor();
_hrm.onreading = function() {
  // Peek the current sensor values
  _heartRate.text = _hrm.heartRate;
}

function updateHeartRateSensor() {
  // Begin monitoring the sensor
  _hrm.start();
}

function stopHeartRateSensor() {
  // Stop monitoring the sensor
  _hrm.stop();
}

display.addEventListener('change', function() {
  if (this.on) {
    updateHeartRateSensor();
    checkAndUpdateBatteryLevel();
  } else {
    stopHeartRateSensor();
  }
});

// Function that checks for a particular file
function file_exists(filename) {
    let dirIter = "";
    let listDir = listDirSync("");
    while((dirIter = listDir.next()) && !dirIter.done) if(dirIter.value===filename) return true;
    return false;
}

// Check to see if GPS cache files are in place
if(file_exists("utf8_lat.txt")) {
  console.log("GPS cache file exists, using cache");
  let utf8_read_lat = parseFloat(fs.readFileSync("utf8_lat.txt", "utf-8"));
  let utf8_read_long = parseFloat(fs.readFileSync("utf8_long.txt", "utf-8"));
  let cacheSunriseTime = new Date().sunrise(utf8_read_lat, utf8_read_long);
  let cacheSunsetTime = new Date().sunset(utf8_read_lat, utf8_read_long);
  updateSky(today,cacheSunriseTime, cacheSunsetTime);
} else {
  console.log("GPS cache file does not exist");
}


/**
 * Parses current datetime and sets into the date placeholder. e.g. Thu, 7 Jan
 * @param {Date} currentTime 
 */
function updateDate(currentTime) {

  let _dayIndex = currentTime.getDay();
  let _dayOfMonth = currentTime.getDate();
  let _monthIndex = currentTime.getMonth();
  // set the actual date to the placeholder
  _date.text = `${util.getDayName(_dayIndex)}, ${_dayOfMonth} ${util.getMontName(_monthIndex)}`;
}

/**
 * Parses current datetime and sets into the time placeholder in format HH:MM. e.g. 22:43
 * @param {Date} currentTime 
 */
function updateTime(currentTime) {

  let hours = util.getHour(preferences.clockDisplay, currentTime.getHours());
  hours = util.zeroPad(hours);
  let mins = util.zeroPad(currentTime.getMinutes());

  _clock.text = `${hours}:${mins}`;
  // updates the background after 18:00
}

/**
 * Updates the moon's phase depending on the given return result.
 * @param {Int} phase 
 */
function updateMoonPhase(phase) {
  
    // 0 => New Moon
    // 1 => Waxing Crescent Moon
    // 2 => Quarter Moon
    // 3 => Waxing Gibbous Moon
    // 4 => Full Moon
    // 5 => Waning Gibbous Moon
    // 6 => Last Quarter Moon
    // 7 => Waning Crescent Moon

  switch (phase)
  {
  case 0:
    _moon.href =  "images/moons/moonbm.png";
    break;
  case 1:
    _moon.href =  "images/moons/moonwxc.png";
    break;
  case 2:
    _moon.href =  "images/moons/moonfq.png";
    break;
  case 3:
    _moon.href =  "images/moons/moonwxg.png";
    break;
  case 4:
    _moon.href =  "images/moons/moonfull.png";
    break;
  case 5:
    _moon.href =  "images/moons/moonwng.png";
    break;
  case 6:
    _moon.href =  "images/moons/moonlq.png";
    break;
  case 7:
    _moon.href =  "images/moons/moonwnc.png";
    break;
  }
}

/** 
 * Updates the background image, and whether to use the sun or moon, depending on rise and set times.
 * 
*/
function updateSky(currentTime, sunriseTime, sunsetTime, lastSunsetTime, nextSunriseTime){
  
  let currentDay = currentTime.getDate();
  let currentMonth = currentTime.getMonth();
  let currentYear = currentTime.getUTCFullYear();
  let degrees = -105;



  if (currentTime <= sunsetTime && currentTime >= sunriseTime)
  {
  _sky.href = "images/sky/day.png";
  _moon.href = "images/moons/sun.png";
  _clock.style.fill = "#7ac8f1";
  _date.style.fill = "#ddfafe";

  let mins = ((currentTime-sunriseTime)*100) / (sunsetTime-sunriseTime);
  
  mins /=100; 
  degrees = ((mins * 210)-105);
  rotateSun(degrees);


  console.log("daytime set!");
  }
  else
  {
  _sky.href = "images/sky/night.png";
  updateMoonPhase(util.getMoonPhase(currentYear,currentMonth,currentDay)); 
  _clock.style.fill = "#1a2a31";
  _date.style.fill = "#364852";
  var mins = 0;
    if (currentDay == sunriseTime.getDate() && currentTime >= sunriseTime)
    {
      mins = ((nextSunriseTime-currentTime)*100) / (nextSunriseTime - sunsetTime);
      }
  else if (currentTime <= sunriseTime)
  {
    mins = ((sunriseTime - currentTime)*100) / (sunriseTime - lastSunsetTime);
  }
  
  mins /=100;
  mins=1-mins;
  degrees = ((mins * 210)-105);


  rotateSun(degrees);
  console.log("nighttime set!");  

//else console.log("SUNRISE ERROR");
  }

}

/**
 * Updates the battery level
 */
function checkAndUpdateBatteryLevel() {
  _batteryLevel.text = battery.chargeLevel;
}

function locationSuccess(position) {
  //Caching new GPS coords for future access
  let utf8_lat = position.coords.latitude.toString();
  let utf8_long = position.coords.longitude.toString();
  fs.writeFileSync("utf8_lat.txt", utf8_lat, "utf-8");
  fs.writeFileSync("utf8_long.txt", utf8_long, "utf-8");
  //debugging
  let utf8_read_lat = fs.readFileSync("utf8_lat.txt", "utf-8");
  console.log("UTF-8 Lat Data: " + utf8_read_lat);
  let utf8_read_long = fs.readFileSync("utf8_long.txt", "utf-8");
  console.log("UTF-8 Long Data: " + utf8_read_long);
  console.log("GPS Data refreshed, cache updated");
  let gpsSunriseTime = new Date().sunrise(position.coords.latitude, position.coords.longitude);
  let gpsSunsetTime = new Date().sunset(position.coords.latitude, position.coords.longitude);
  let lastSunsetTime = new Date().sunsetLast(position.coords.latitude, position.coords.longitude);
  let nextSunriseTime = new Date().sunriseNext(position.coords.latitude, position.coords.longitude);
  
  updateSky(today,gpsSunriseTime, gpsSunsetTime, lastSunsetTime, nextSunriseTime);
  

}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

// Add geo_options as 3rd argument to geolocation.getCurrentPosition() to tweak
// geolocation settings as defined here. Removed for debugging.
 var geo_options = {
   enableHighAccuracy: false, 
   maximumAge        : 0, 
   timeout           : Infinity,
 };


