/**
 * Adds zero in front of the number if the given number is less than 10
 * @param {Integer} number 
 */
 export function zeroPad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

/**
 * Returns hour with given display format. e.g. if displayFormat is "12h" and hours is "23", then result will be "11"
 * @param {String} displayFormat 
 * @param {Integer} hours 
 */
export function getHour(displayFormat, hours) {
  return displayFormat === "12h" ? (hours % 12 || 12) : hours; 
}

/**
 * Returns the name of the day with the given index. e.g. 0 returns PAZ.
 * @param {Integer} dayIndex 
 */
export function getDayName(dayIndex) {
  return _days[dayIndex];
}

/**
 * Returns the name of the month with the given index. e.g. 0 returns OCA.
 * @param {Integer} monthIndex 
 */
export function getMontName(monthIndex) {
  return _months[monthIndex];
}

const _days = {
  0: 'SUN',
  1: 'MON',
  2: 'TUE',
  3: 'WED',
  4: 'THU',
  5: 'FRI',
  6: 'SAT',
  default: 'ERR'
};

const _months = {
  0: 'JAN',
  1: 'FEB',
  2: 'MAR',
  3: 'APR',
  4: 'MAY',
  5: 'JUN',
  6: 'JUL',
  7: 'AUG',
  8: 'SEP',
  9: 'OCT',
  10: 'NOV',
  11: 'DEC',
  default: 'ERR'
}

/***taken from https://gist.github.com/endel/dfe6bb2fbe679781948c ---> get phase of moon for night display
*
* @param {integer} year
* @param {integer} month
* @param {integer} day
*/
export function getMoonPhase(year, month, day)
{

    var c = 0;
    var e = 0;
    var jd = 0;
    var b = 0;

    if (month < 3) {
        year--;
        month += 12;
    }

    ++month;
    c = 365.25 * year;

    e = 30.6 * month;

    jd = c + e + day - 694039.09; //jd is total days elapsed

    jd /= 29.5305882; //divide by the moon cycle

    b = parseInt(jd); //int(jd) -> b, take integer part of jd

    jd -= b; //subtract integer part to leave fractional part of original jd

    b = Math.round(jd * 8); //scale fraction from 0-8 and round

    if (b >= 8 ) {
        b = 0; //0 and 8 are the same so turn 8 into 0
    }

    // 0 => New Moon
    // 1 => Waxing Crescent Moon
    // 2 => Quarter Moon
    // 3 => Waxing Gibbous Moon
    // 4 => Full Moon
    // 5 => Waning Gibbous Moon
    // 6 => Last Quarter Moon
    // 7 => Waning Crescent Moon

  return b;

}