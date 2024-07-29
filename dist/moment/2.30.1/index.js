(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["moment"] = factory();
	else
		root["moment"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 239:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ createDate),
/* harmony export */   P: () => (/* binding */ createUTCDate)
/* harmony export */ });
function createDate(y, m, d, h, M, s, ms) {
  // can't just apply() to create a date:
  // https://stackoverflow.com/q/181348
  var date;
  // the date constructor remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    date = new Date(y + 400, m, d, h, M, s, ms);
    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m, d, h, M, s, ms);
  }
  return date;
}
function createUTCDate(y) {
  var date, args;
  // the Date.UTC function remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    args = Array.prototype.slice.call(arguments);
    // preserve leap years using a full 400 year cycle, then reset
    args[0] = y + 400;
    date = new Date(Date.UTC.apply(null, args));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(null, arguments));
  }
  return date;
}

/***/ }),

/***/ 950:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  x: () => (/* binding */ createLocalOrUTC),
  E: () => (/* binding */ prepareConfig)
});

// EXTERNAL MODULE: ./src/lib/utils/is-array.js
var is_array = __webpack_require__(261);
// EXTERNAL MODULE: ./src/lib/utils/is-object.js
var is_object = __webpack_require__(945);
// EXTERNAL MODULE: ./src/lib/utils/is-object-empty.js
var is_object_empty = __webpack_require__(133);
// EXTERNAL MODULE: ./src/lib/utils/is-undefined.js
var is_undefined = __webpack_require__(420);
// EXTERNAL MODULE: ./src/lib/utils/is-number.js
var is_number = __webpack_require__(523);
// EXTERNAL MODULE: ./src/lib/utils/is-date.js
var is_date = __webpack_require__(238);
;// CONCATENATED MODULE: ./src/lib/utils/map.js
function map(arr, fn) {
  var res = [],
    i,
    arrLen = arr.length;
  for (i = 0; i < arrLen; ++i) {
    res.push(fn(arr[i], i));
  }
  return res;
}
// EXTERNAL MODULE: ./src/lib/create/valid.js + 1 modules
var valid = __webpack_require__(794);
// EXTERNAL MODULE: ./src/lib/moment/constructor.js
var moment_constructor = __webpack_require__(916);
// EXTERNAL MODULE: ./src/lib/locale/locales.js + 2 modules
var locales = __webpack_require__(35);
// EXTERNAL MODULE: ./src/lib/utils/hooks.js
var hooks = __webpack_require__(581);
// EXTERNAL MODULE: ./src/lib/units/month.js + 1 modules
var month = __webpack_require__(942);
// EXTERNAL MODULE: ./src/lib/units/constants.js
var constants = __webpack_require__(282);
// EXTERNAL MODULE: ./src/lib/create/parsing-flags.js
var parsing_flags = __webpack_require__(810);
;// CONCATENATED MODULE: ./src/lib/create/check-overflow.js



function checkOverflow(m) {
  var overflow,
    a = m._a;
  if (a && (0,parsing_flags/* default */.A)(m).overflow === -2) {
    overflow = a[constants/* MONTH */.Lp] < 0 || a[constants/* MONTH */.Lp] > 11 ? constants/* MONTH */.Lp : a[constants/* DATE */.vH] < 1 || a[constants/* DATE */.vH] > (0,month/* daysInMonth */.L3)(a[constants/* YEAR */.UX], a[constants/* MONTH */.Lp]) ? constants/* DATE */.vH : a[constants/* HOUR */.dp] < 0 || a[constants/* HOUR */.dp] > 24 || a[constants/* HOUR */.dp] === 24 && (a[constants/* MINUTE */.pY] !== 0 || a[constants/* SECOND */.Z2] !== 0 || a[constants/* MILLISECOND */.oG] !== 0) ? constants/* HOUR */.dp : a[constants/* MINUTE */.pY] < 0 || a[constants/* MINUTE */.pY] > 59 ? constants/* MINUTE */.pY : a[constants/* SECOND */.Z2] < 0 || a[constants/* SECOND */.Z2] > 59 ? constants/* SECOND */.Z2 : a[constants/* MILLISECOND */.oG] < 0 || a[constants/* MILLISECOND */.oG] > 999 ? constants/* MILLISECOND */.oG : -1;
    if ((0,parsing_flags/* default */.A)(m)._overflowDayOfYear && (overflow < constants/* YEAR */.UX || overflow > constants/* DATE */.vH)) {
      overflow = constants/* DATE */.vH;
    }
    if ((0,parsing_flags/* default */.A)(m)._overflowWeeks && overflow === -1) {
      overflow = constants/* WEEK */.V8;
    }
    if ((0,parsing_flags/* default */.A)(m)._overflowWeekday && overflow === -1) {
      overflow = constants/* WEEKDAY */.DJ;
    }
    (0,parsing_flags/* default */.A)(m).overflow = overflow;
  }
  return m;
}
// EXTERNAL MODULE: ./src/lib/create/date-from-array.js
var date_from_array = __webpack_require__(239);
// EXTERNAL MODULE: ./src/lib/utils/deprecate.js
var deprecate = __webpack_require__(182);
// EXTERNAL MODULE: ./src/lib/units/day-of-week.js
var day_of_week = __webpack_require__(928);
;// CONCATENATED MODULE: ./src/lib/create/from-string.js








// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
  basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
  tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
  isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/], ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/], ['YYYYMM', /\d{6}/, false], ['YYYY', /\d{4}/, false]],
  // iso time formats and regexes
  isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]],
  aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
  // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
  rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
  obsOffsets = {
    UT: 0,
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
  };

// date from iso format
function configFromISO(config) {
  var i,
    l,
    string = config._i,
    match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
    allowTime,
    dateFormat,
    timeFormat,
    tzFormat,
    isoDatesLen = isoDates.length,
    isoTimesLen = isoTimes.length;
  if (match) {
    (0,parsing_flags/* default */.A)(config).iso = true;
    for (i = 0, l = isoDatesLen; i < l; i++) {
      if (isoDates[i][1].exec(match[1])) {
        dateFormat = isoDates[i][0];
        allowTime = isoDates[i][2] !== false;
        break;
      }
    }
    if (dateFormat == null) {
      config._isValid = false;
      return;
    }
    if (match[3]) {
      for (i = 0, l = isoTimesLen; i < l; i++) {
        if (isoTimes[i][1].exec(match[3])) {
          // match[2] should be 'T' or space
          timeFormat = (match[2] || ' ') + isoTimes[i][0];
          break;
        }
      }
      if (timeFormat == null) {
        config._isValid = false;
        return;
      }
    }
    if (!allowTime && timeFormat != null) {
      config._isValid = false;
      return;
    }
    if (match[4]) {
      if (tzRegex.exec(match[4])) {
        tzFormat = 'Z';
      } else {
        config._isValid = false;
        return;
      }
    }
    config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
    configFromStringAndFormat(config);
  } else {
    config._isValid = false;
  }
}
function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  var result = [untruncateYear(yearStr), month/* defaultLocaleMonthsShort */.vu.indexOf(monthStr), parseInt(dayStr, 10), parseInt(hourStr, 10), parseInt(minuteStr, 10)];
  if (secondStr) {
    result.push(parseInt(secondStr, 10));
  }
  return result;
}
function untruncateYear(yearStr) {
  var year = parseInt(yearStr, 10);
  if (year <= 49) {
    return 2000 + year;
  } else if (year <= 999) {
    return 1900 + year;
  }
  return year;
}
function preprocessRFC2822(s) {
  // Remove comments and folding whitespace and replace multiple-spaces with a single space
  return s.replace(/\([^()]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
function checkWeekday(weekdayStr, parsedInput, config) {
  if (weekdayStr) {
    // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
    var weekdayProvided = day_of_week/* defaultLocaleWeekdaysShort */.VP.indexOf(weekdayStr),
      weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
    if (weekdayProvided !== weekdayActual) {
      (0,parsing_flags/* default */.A)(config).weekdayMismatch = true;
      config._isValid = false;
      return false;
    }
  }
  return true;
}
function calculateOffset(obsOffset, militaryOffset, numOffset) {
  if (obsOffset) {
    return obsOffsets[obsOffset];
  } else if (militaryOffset) {
    // the only allowed military tz is Z
    return 0;
  } else {
    var hm = parseInt(numOffset, 10),
      m = hm % 100,
      h = (hm - m) / 100;
    return h * 60 + m;
  }
}

// date and time from ref 2822 format
function configFromRFC2822(config) {
  var match = rfc2822.exec(preprocessRFC2822(config._i)),
    parsedArray;
  if (match) {
    parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
    if (!checkWeekday(match[1], parsedArray, config)) {
      return;
    }
    config._a = parsedArray;
    config._tzm = calculateOffset(match[8], match[9], match[10]);
    config._d = date_from_array/* createUTCDate */.P.apply(null, config._a);
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    (0,parsing_flags/* default */.A)(config).rfc2822 = true;
  } else {
    config._isValid = false;
  }
}

// date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
function configFromString(config) {
  var matched = aspNetJsonRegex.exec(config._i);
  if (matched !== null) {
    config._d = new Date(+matched[1]);
    return;
  }
  configFromISO(config);
  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }
  configFromRFC2822(config);
  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }
  if (config._strict) {
    config._isValid = false;
  } else {
    // Final attempt, use Input Fallback
    hooks/* hooks */.J.createFromInputFallback(config);
  }
}
hooks/* hooks */.J.createFromInputFallback = (0,deprecate/* deprecate */.C)('value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' + 'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.', function (config) {
  config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
});
// EXTERNAL MODULE: ./src/lib/units/year.js
var year = __webpack_require__(502);
// EXTERNAL MODULE: ./src/lib/units/week-calendar-utils.js
var week_calendar_utils = __webpack_require__(294);
// EXTERNAL MODULE: ./src/lib/create/local.js
var local = __webpack_require__(671);
;// CONCATENATED MODULE: ./src/lib/utils/defaults.js
// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
  if (a != null) {
    return a;
  }
  if (b != null) {
    return b;
  }
  return c;
}
;// CONCATENATED MODULE: ./src/lib/create/from-array.js








function currentDateArray(config) {
  // hooks is actually the exported moment object
  var nowValue = new Date(hooks/* hooks */.J.now());
  if (config._useUTC) {
    return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
  }
  return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray(config) {
  var i,
    date,
    input = [],
    currentDate,
    expectedWeekday,
    yearToUse;
  if (config._d) {
    return;
  }
  currentDate = currentDateArray(config);

  //compute day of the year from weeks and weekdays
  if (config._w && config._a[constants/* DATE */.vH] == null && config._a[constants/* MONTH */.Lp] == null) {
    dayOfYearFromWeekInfo(config);
  }

  //if the day of the year is set, figure out what it is
  if (config._dayOfYear != null) {
    yearToUse = defaults(config._a[constants/* YEAR */.UX], currentDate[constants/* YEAR */.UX]);
    if (config._dayOfYear > (0,year/* daysInYear */.Ki)(yearToUse) || config._dayOfYear === 0) {
      (0,parsing_flags/* default */.A)(config)._overflowDayOfYear = true;
    }
    date = (0,date_from_array/* createUTCDate */.P)(yearToUse, 0, config._dayOfYear);
    config._a[constants/* MONTH */.Lp] = date.getUTCMonth();
    config._a[constants/* DATE */.vH] = date.getUTCDate();
  }

  // Default to current date.
  // * if no year, month, day of month are given, default to today
  // * if day of month is given, default month and year
  // * if month is given, default only year
  // * if year is given, don't default anything
  for (i = 0; i < 3 && config._a[i] == null; ++i) {
    config._a[i] = input[i] = currentDate[i];
  }

  // Zero out whatever was not defaulted, including time
  for (; i < 7; i++) {
    config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
  }

  // Check for 24:00:00.000
  if (config._a[constants/* HOUR */.dp] === 24 && config._a[constants/* MINUTE */.pY] === 0 && config._a[constants/* SECOND */.Z2] === 0 && config._a[constants/* MILLISECOND */.oG] === 0) {
    config._nextDay = true;
    config._a[constants/* HOUR */.dp] = 0;
  }
  config._d = (config._useUTC ? date_from_array/* createUTCDate */.P : date_from_array/* createDate */.J).apply(null, input);
  expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

  // Apply timezone offset from input. The actual utcOffset can be changed
  // with parseZone.
  if (config._tzm != null) {
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
  }
  if (config._nextDay) {
    config._a[constants/* HOUR */.dp] = 24;
  }

  // check for mismatching day of week
  if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
    (0,parsing_flags/* default */.A)(config).weekdayMismatch = true;
  }
}
function dayOfYearFromWeekInfo(config) {
  var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
  w = config._w;
  if (w.GG != null || w.W != null || w.E != null) {
    dow = 1;
    doy = 4;

    // TODO: We need to take the current isoWeekYear, but that depends on
    // how we interpret now (local, utc, fixed offset). So create
    // a now version of current config (take local/utc/offset flags, and
    // create now).
    weekYear = defaults(w.GG, config._a[constants/* YEAR */.UX], (0,week_calendar_utils/* weekOfYear */.zR)((0,local/* createLocal */.o)(), 1, 4).year);
    week = defaults(w.W, 1);
    weekday = defaults(w.E, 1);
    if (weekday < 1 || weekday > 7) {
      weekdayOverflow = true;
    }
  } else {
    dow = config._locale._week.dow;
    doy = config._locale._week.doy;
    curWeek = (0,week_calendar_utils/* weekOfYear */.zR)((0,local/* createLocal */.o)(), dow, doy);
    weekYear = defaults(w.gg, config._a[constants/* YEAR */.UX], curWeek.year);

    // Default to current week.
    week = defaults(w.w, curWeek.week);
    if (w.d != null) {
      // weekday -- low day numbers are considered next week
      weekday = w.d;
      if (weekday < 0 || weekday > 6) {
        weekdayOverflow = true;
      }
    } else if (w.e != null) {
      // local weekday -- counting starts from beginning of week
      weekday = w.e + dow;
      if (w.e < 0 || w.e > 6) {
        weekdayOverflow = true;
      }
    } else {
      // default to beginning of week
      weekday = dow;
    }
  }
  if (week < 1 || week > (0,week_calendar_utils/* weeksInYear */.cB)(weekYear, dow, doy)) {
    (0,parsing_flags/* default */.A)(config)._overflowWeeks = true;
  } else if (weekdayOverflow != null) {
    (0,parsing_flags/* default */.A)(config)._overflowWeekday = true;
  } else {
    temp = (0,week_calendar_utils/* dayOfYearFromWeeks */.ip)(weekYear, week, weekday, dow, doy);
    config._a[constants/* YEAR */.UX] = temp.year;
    config._dayOfYear = temp.dayOfYear;
  }
}
// EXTERNAL MODULE: ./src/lib/parse/regex.js
var regex = __webpack_require__(560);
// EXTERNAL MODULE: ./src/lib/parse/token.js
var parse_token = __webpack_require__(218);
// EXTERNAL MODULE: ./src/lib/format/format.js
var format = __webpack_require__(592);
;// CONCATENATED MODULE: ./src/lib/create/from-string-and-format.js










// constant that refers to the ISO standard
hooks/* hooks */.J.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks/* hooks */.J.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
  // TODO: Move this to another part of the creation flow to prevent circular deps
  if (config._f === hooks/* hooks */.J.ISO_8601) {
    configFromISO(config);
    return;
  }
  if (config._f === hooks/* hooks */.J.RFC_2822) {
    configFromRFC2822(config);
    return;
  }
  config._a = [];
  (0,parsing_flags/* default */.A)(config).empty = true;

  // This array is used to make a Date, either with `new Date` or `Date.UTC`
  var string = '' + config._i,
    i,
    parsedInput,
    tokens,
    token,
    skipped,
    stringLength = string.length,
    totalParsedInputLength = 0,
    era,
    tokenLen;
  tokens = (0,format/* expandFormat */.cS)(config._f, config._locale).match(format/* formattingTokens */.cr) || [];
  tokenLen = tokens.length;
  for (i = 0; i < tokenLen; i++) {
    token = tokens[i];
    parsedInput = (string.match((0,regex/* getParseRegexForToken */.Zs)(token, config)) || [])[0];
    if (parsedInput) {
      skipped = string.substr(0, string.indexOf(parsedInput));
      if (skipped.length > 0) {
        (0,parsing_flags/* default */.A)(config).unusedInput.push(skipped);
      }
      string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
      totalParsedInputLength += parsedInput.length;
    }
    // don't parse if it's not a known token
    if (format/* formatTokenFunctions */.Mn[token]) {
      if (parsedInput) {
        (0,parsing_flags/* default */.A)(config).empty = false;
      } else {
        (0,parsing_flags/* default */.A)(config).unusedTokens.push(token);
      }
      (0,parse_token/* addTimeToArrayFromToken */.Q8)(token, parsedInput, config);
    } else if (config._strict && !parsedInput) {
      (0,parsing_flags/* default */.A)(config).unusedTokens.push(token);
    }
  }

  // add remaining unparsed input length to the string
  (0,parsing_flags/* default */.A)(config).charsLeftOver = stringLength - totalParsedInputLength;
  if (string.length > 0) {
    (0,parsing_flags/* default */.A)(config).unusedInput.push(string);
  }

  // clear _12h flag if hour is <= 12
  if (config._a[constants/* HOUR */.dp] <= 12 && (0,parsing_flags/* default */.A)(config).bigHour === true && config._a[constants/* HOUR */.dp] > 0) {
    (0,parsing_flags/* default */.A)(config).bigHour = undefined;
  }
  (0,parsing_flags/* default */.A)(config).parsedDateParts = config._a.slice(0);
  (0,parsing_flags/* default */.A)(config).meridiem = config._meridiem;
  // handle meridiem
  config._a[constants/* HOUR */.dp] = meridiemFixWrap(config._locale, config._a[constants/* HOUR */.dp], config._meridiem);

  // handle era
  era = (0,parsing_flags/* default */.A)(config).era;
  if (era !== null) {
    config._a[constants/* YEAR */.UX] = config._locale.erasConvertYear(era, config._a[constants/* YEAR */.UX]);
  }
  configFromArray(config);
  checkOverflow(config);
}
function meridiemFixWrap(locale, hour, meridiem) {
  var isPm;
  if (meridiem == null) {
    // nothing to do
    return hour;
  }
  if (locale.meridiemHour != null) {
    return locale.meridiemHour(hour, meridiem);
  } else if (locale.isPM != null) {
    // Fallback
    isPm = locale.isPM(meridiem);
    if (isPm && hour < 12) {
      hour += 12;
    }
    if (!isPm && hour === 12) {
      hour = 0;
    }
    return hour;
  } else {
    // this is not supposed to happen
    return hour;
  }
}
// EXTERNAL MODULE: ./src/lib/utils/extend.js
var extend = __webpack_require__(193);
;// CONCATENATED MODULE: ./src/lib/create/from-string-and-array.js






// date from string and array of format strings
function configFromStringAndArray(config) {
  var tempConfig,
    bestMoment,
    scoreToBeat,
    i,
    currentScore,
    validFormatFound,
    bestFormatIsValid = false,
    configfLen = config._f.length;
  if (configfLen === 0) {
    (0,parsing_flags/* default */.A)(config).invalidFormat = true;
    config._d = new Date(NaN);
    return;
  }
  for (i = 0; i < configfLen; i++) {
    currentScore = 0;
    validFormatFound = false;
    tempConfig = (0,moment_constructor/* copyConfig */.om)({}, config);
    if (config._useUTC != null) {
      tempConfig._useUTC = config._useUTC;
    }
    tempConfig._f = config._f[i];
    configFromStringAndFormat(tempConfig);
    if ((0,valid/* isValid */.f)(tempConfig)) {
      validFormatFound = true;
    }

    // if there is any input that was not parsed add a penalty for that format
    currentScore += (0,parsing_flags/* default */.A)(tempConfig).charsLeftOver;

    //or tokens
    currentScore += (0,parsing_flags/* default */.A)(tempConfig).unusedTokens.length * 10;
    (0,parsing_flags/* default */.A)(tempConfig).score = currentScore;
    if (!bestFormatIsValid) {
      if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
        if (validFormatFound) {
          bestFormatIsValid = true;
        }
      }
    } else {
      if (currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }
  }
  (0,extend/* default */.A)(config, bestMoment || tempConfig);
}
// EXTERNAL MODULE: ./src/lib/units/aliases.js
var aliases = __webpack_require__(155);
;// CONCATENATED MODULE: ./src/lib/create/from-object.js



function configFromObject(config) {
  if (config._d) {
    return;
  }
  var i = (0,aliases/* normalizeObjectUnits */.M)(config._i),
    dayOrDate = i.day === undefined ? i.date : i.day;
  config._a = map([i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond], function (obj) {
    return obj && parseInt(obj, 10);
  });
  configFromArray(config);
}
;// CONCATENATED MODULE: ./src/lib/create/from-anything.js


















function createFromConfig(config) {
  var res = new moment_constructor/* Moment */["do"](checkOverflow(prepareConfig(config)));
  if (res._nextDay) {
    // Adding is smart enough around DST
    res.add(1, 'd');
    res._nextDay = undefined;
  }
  return res;
}
function prepareConfig(config) {
  var input = config._i,
    format = config._f;
  config._locale = config._locale || (0,locales/* getLocale */.JK)(config._l);
  if (input === null || format === undefined && input === '') {
    return (0,valid/* createInvalid */.q)({
      nullInput: true
    });
  }
  if (typeof input === 'string') {
    config._i = input = config._locale.preparse(input);
  }
  if ((0,moment_constructor/* isMoment */.t_)(input)) {
    return new moment_constructor/* Moment */["do"](checkOverflow(input));
  } else if ((0,is_date/* default */.A)(input)) {
    config._d = input;
  } else if ((0,is_array/* default */.A)(format)) {
    configFromStringAndArray(config);
  } else if (format) {
    configFromStringAndFormat(config);
  } else {
    configFromInput(config);
  }
  if (!(0,valid/* isValid */.f)(config)) {
    config._d = null;
  }
  return config;
}
function configFromInput(config) {
  var input = config._i;
  if ((0,is_undefined/* default */.A)(input)) {
    config._d = new Date(hooks/* hooks */.J.now());
  } else if ((0,is_date/* default */.A)(input)) {
    config._d = new Date(input.valueOf());
  } else if (typeof input === 'string') {
    configFromString(config);
  } else if ((0,is_array/* default */.A)(input)) {
    config._a = map(input.slice(0), function (obj) {
      return parseInt(obj, 10);
    });
    configFromArray(config);
  } else if ((0,is_object/* default */.A)(input)) {
    configFromObject(config);
  } else if ((0,is_number/* default */.A)(input)) {
    // from milliseconds
    config._d = new Date(input);
  } else {
    hooks/* hooks */.J.createFromInputFallback(config);
  }
}
function createLocalOrUTC(input, format, locale, strict, isUTC) {
  var c = {};
  if (format === true || format === false) {
    strict = format;
    format = undefined;
  }
  if (locale === true || locale === false) {
    strict = locale;
    locale = undefined;
  }
  if ((0,is_object/* default */.A)(input) && (0,is_object_empty/* default */.A)(input) || (0,is_array/* default */.A)(input) && input.length === 0) {
    input = undefined;
  }
  // object construction must be done this way.
  // https://github.com/moment/moment/issues/1423
  c._isAMomentObject = true;
  c._useUTC = c._isUTC = isUTC;
  c._l = locale;
  c._i = input;
  c._f = format;
  c._strict = strict;
  return createFromConfig(c);
}

/***/ }),

/***/ 671:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ createLocal)
/* harmony export */ });
/* harmony import */ var _from_anything__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(950);

function createLocal(input, format, locale, strict) {
  return (0,_from_anything__WEBPACK_IMPORTED_MODULE_0__/* .createLocalOrUTC */ .x)(input, format, locale, strict, false);
}

/***/ }),

/***/ 810:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ getParsingFlags)
/* harmony export */ });
function defaultParsingFlags() {
  // We need to deep clone this object.
  return {
    empty: false,
    unusedTokens: [],
    unusedInput: [],
    overflow: -2,
    charsLeftOver: 0,
    nullInput: false,
    invalidEra: null,
    invalidMonth: null,
    invalidFormat: false,
    userInvalidated: false,
    iso: false,
    parsedDateParts: [],
    era: null,
    meridiem: null,
    rfc2822: false,
    weekdayMismatch: false
  };
}
function getParsingFlags(m) {
  if (m._pf == null) {
    m._pf = defaultParsingFlags();
  }
  return m._pf;
}

/***/ }),

/***/ 990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ createUTC)
/* harmony export */ });
/* harmony import */ var _from_anything__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(950);

function createUTC(input, format, locale, strict) {
  return (0,_from_anything__WEBPACK_IMPORTED_MODULE_0__/* .createLocalOrUTC */ .x)(input, format, locale, strict, true).utc();
}

/***/ }),

/***/ 794:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  q: () => (/* binding */ createInvalid),
  f: () => (/* binding */ isValid)
});

// EXTERNAL MODULE: ./src/lib/utils/extend.js
var extend = __webpack_require__(193);
// EXTERNAL MODULE: ./src/lib/create/utc.js
var utc = __webpack_require__(990);
// EXTERNAL MODULE: ./src/lib/create/parsing-flags.js
var parsing_flags = __webpack_require__(810);
;// CONCATENATED MODULE: ./src/lib/utils/some.js
var some;
if (Array.prototype.some) {
  some = Array.prototype.some;
} else {
  some = function (fun) {
    var t = Object(this),
      len = t.length >>> 0,
      i;
    for (i = 0; i < len; i++) {
      if (i in t && fun.call(this, t[i], i, t)) {
        return true;
      }
    }
    return false;
  };
}

;// CONCATENATED MODULE: ./src/lib/create/valid.js




function isValid(m) {
  var flags = null,
    parsedParts = false,
    isNowValid = m._d && !isNaN(m._d.getTime());
  if (isNowValid) {
    flags = (0,parsing_flags/* default */.A)(m);
    parsedParts = some.call(flags.parsedDateParts, function (i) {
      return i != null;
    });
    isNowValid = flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
    if (m._strict) {
      isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
    }
  }
  if (Object.isFrozen == null || !Object.isFrozen(m)) {
    m._isValid = isNowValid;
  } else {
    return isNowValid;
  }
  return m._isValid;
}
function createInvalid(flags) {
  var m = (0,utc/* createUTC */.X)(NaN);
  if (flags != null) {
    (0,extend/* default */.A)((0,parsing_flags/* default */.A)(m), flags);
  } else {
    (0,parsing_flags/* default */.A)(m).userInvalidated = true;
  }
  return m;
}

/***/ }),

/***/ 592:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K9: () => (/* binding */ formatMoment),
/* harmony export */   Mn: () => (/* binding */ formatTokenFunctions),
/* harmony export */   Se: () => (/* binding */ addFormatToken),
/* harmony export */   cS: () => (/* binding */ expandFormat),
/* harmony export */   cr: () => (/* binding */ formattingTokens)
/* harmony export */ });
/* harmony import */ var _utils_zero_fill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(825);
/* harmony import */ var _utils_is_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(654);


var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
  localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
  formatFunctions = {},
  formatTokenFunctions = {};


// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken(token, padded, ordinal, callback) {
  var func = callback;
  if (typeof callback === 'string') {
    func = function () {
      return this[callback]();
    };
  }
  if (token) {
    formatTokenFunctions[token] = func;
  }
  if (padded) {
    formatTokenFunctions[padded[0]] = function () {
      return (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(func.apply(this, arguments), padded[1], padded[2]);
    };
  }
  if (ordinal) {
    formatTokenFunctions[ordinal] = function () {
      return this.localeData().ordinal(func.apply(this, arguments), token);
    };
  }
}
function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, '');
  }
  return input.replace(/\\/g, '');
}
function makeFormatFunction(format) {
  var array = format.match(formattingTokens),
    i,
    length;
  for (i = 0, length = array.length; i < length; i++) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]];
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }
  return function (mom) {
    var output = '',
      i;
    for (i = 0; i < length; i++) {
      output += (0,_utils_is_function__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(array[i]) ? array[i].call(mom, format) : array[i];
    }
    return output;
  };
}

// format date using native date object
function formatMoment(m, format) {
  if (!m.isValid()) {
    return m.localeData().invalidDate();
  }
  format = expandFormat(format, m.localeData());
  formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
  return formatFunctions[format](m);
}
function expandFormat(format, locale) {
  var i = 5;
  function replaceLongDateFormatTokens(input) {
    return locale.longDateFormat(input) || input;
  }
  localFormattingTokens.lastIndex = 0;
  while (i >= 0 && localFormattingTokens.test(format)) {
    format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
    localFormattingTokens.lastIndex = 0;
    i -= 1;
  }
  return format;
}

/***/ }),

/***/ 642:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ calendar),
/* harmony export */   M: () => (/* binding */ defaultCalendar)
/* harmony export */ });
/* harmony import */ var _utils_is_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(654);
var defaultCalendar = {
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  lastDay: '[Yesterday at] LT',
  lastWeek: '[Last] dddd [at] LT',
  sameElse: 'L'
};

function calendar(key, mom, now) {
  var output = this._calendar[key] || this._calendar['sameElse'];
  return (0,_utils_is_function__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(output) ? output.call(mom, now) : output;
}

/***/ }),

/***/ 154:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ Locale)
/* harmony export */ });
function Locale(config) {
  if (config != null) {
    this.set(config);
  }
}

/***/ }),

/***/ 910:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ longDateFormat),
/* harmony export */   r: () => (/* binding */ defaultLongDateFormat)
/* harmony export */ });
/* harmony import */ var _format_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(592);

var defaultLongDateFormat = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A'
};
function longDateFormat(key) {
  var format = this._longDateFormat[key],
    formatUpper = this._longDateFormat[key.toUpperCase()];
  if (format || !formatUpper) {
    return format;
  }
  this._longDateFormat[key] = formatUpper.match(_format_format__WEBPACK_IMPORTED_MODULE_0__/* .formattingTokens */ .cr).map(function (tok) {
    if (tok === 'MMMM' || tok === 'MM' || tok === 'DD' || tok === 'dddd') {
      return tok.slice(1);
    }
    return tok;
  }).join('');
  return this._longDateFormat[key];
}

/***/ }),

/***/ 613:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ invalidDate),
/* harmony export */   t: () => (/* binding */ defaultInvalidDate)
/* harmony export */ });
var defaultInvalidDate = 'Invalid date';
function invalidDate() {
  return this._invalidDate;
}

/***/ }),

/***/ 35:
/***/ ((module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  mO: () => (/* binding */ defineLocale),
  JK: () => (/* binding */ getLocale),
  Sc: () => (/* binding */ getSetGlobalLocale),
  qi: () => (/* binding */ listLocales),
  cu: () => (/* binding */ updateLocale)
});

// EXTERNAL MODULE: ./src/lib/utils/is-array.js
var is_array = __webpack_require__(261);
// EXTERNAL MODULE: ./src/lib/utils/is-undefined.js
var is_undefined = __webpack_require__(420);
// EXTERNAL MODULE: ./src/lib/utils/deprecate.js
var deprecate = __webpack_require__(182);
// EXTERNAL MODULE: ./src/lib/locale/set.js
var set = __webpack_require__(418);
// EXTERNAL MODULE: ./src/lib/locale/constructor.js
var locale_constructor = __webpack_require__(154);
// EXTERNAL MODULE: ./src/lib/utils/has-own-prop.js
var has_own_prop = __webpack_require__(396);
;// CONCATENATED MODULE: ./src/lib/utils/keys.js

var keys;
if (Object.keys) {
  keys = Object.keys;
} else {
  keys = function (obj) {
    var i,
      res = [];
    for (i in obj) {
      if ((0,has_own_prop/* default */.A)(obj, i)) {
        res.push(i);
      }
    }
    return res;
  };
}

// EXTERNAL MODULE: ./src/lib/locale/calendar.js
var calendar = __webpack_require__(642);
// EXTERNAL MODULE: ./src/lib/locale/formats.js
var formats = __webpack_require__(910);
// EXTERNAL MODULE: ./src/lib/locale/invalid.js
var invalid = __webpack_require__(613);
// EXTERNAL MODULE: ./src/lib/locale/ordinal.js
var ordinal = __webpack_require__(255);
// EXTERNAL MODULE: ./src/lib/locale/relative.js
var relative = __webpack_require__(640);
// EXTERNAL MODULE: ./src/lib/units/month.js + 1 modules
var month = __webpack_require__(942);
// EXTERNAL MODULE: ./src/lib/units/week.js
var week = __webpack_require__(407);
// EXTERNAL MODULE: ./src/lib/units/day-of-week.js
var day_of_week = __webpack_require__(928);
// EXTERNAL MODULE: ./src/lib/units/hour.js
var hour = __webpack_require__(53);
;// CONCATENATED MODULE: ./src/lib/locale/base-config.js






// months


// week


// weekdays


// meridiem

var baseConfig = {
  calendar: calendar/* defaultCalendar */.M,
  longDateFormat: formats/* defaultLongDateFormat */.r,
  invalidDate: invalid/* defaultInvalidDate */.t,
  ordinal: ordinal/* defaultOrdinal */.hR,
  dayOfMonthOrdinalParse: ordinal/* defaultDayOfMonthOrdinalParse */.L7,
  relativeTime: relative/* defaultRelativeTime */.$0,
  months: month/* defaultLocaleMonths */.HU,
  monthsShort: month/* defaultLocaleMonthsShort */.vu,
  week: week/* defaultLocaleWeek */.qM,
  weekdays: day_of_week/* defaultLocaleWeekdays */.HY,
  weekdaysMin: day_of_week/* defaultLocaleWeekdaysMin */.PR,
  weekdaysShort: day_of_week/* defaultLocaleWeekdaysShort */.VP,
  meridiemParse: hour/* defaultLocaleMeridiemParse */.PN
};
;// CONCATENATED MODULE: ./src/lib/locale/locales.js
/* module decorator */ module = __webpack_require__.hmd(module);








// internal storage for locale config files
var locales = {},
  localeFamilies = {},
  globalLocale;
function commonPrefix(arr1, arr2) {
  var i,
    minl = Math.min(arr1.length, arr2.length);
  for (i = 0; i < minl; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }
  return minl;
}
function normalizeLocale(key) {
  return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
  var i = 0,
    j,
    next,
    locale,
    split;
  while (i < names.length) {
    split = normalizeLocale(names[i]).split('-');
    j = split.length;
    next = normalizeLocale(names[i + 1]);
    next = next ? next.split('-') : null;
    while (j > 0) {
      locale = loadLocale(split.slice(0, j).join('-'));
      if (locale) {
        return locale;
      }
      if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
        //the next array item is better than a shallower substring of this one
        break;
      }
      j--;
    }
    i++;
  }
  return globalLocale;
}
function isLocaleNameSane(name) {
  // Prevent names that look like filesystem paths, i.e contain '/' or '\'
  // Ensure name is available and function returns boolean
  return !!(name && name.match('^[^/\\\\]*$'));
}
function loadLocale(name) {
  var oldLocale = null,
    aliasedRequire;
  // TODO: Find a better way to register and load all the locales in Node
  if (locales[name] === undefined && "object" !== 'undefined' && module && module.exports && isLocaleNameSane(name)) {
    try {
      oldLocale = globalLocale._abbr;
      aliasedRequire = undefined;
      Object(function webpackMissingModule() { var e = new Error("Cannot find module 'undefined'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      getSetGlobalLocale(oldLocale);
    } catch (e) {
      // mark as not found to avoid repeating expensive file require call causing high CPU
      // when trying to find en-US, en_US, en-us for every format call
      locales[name] = null; // null means not found
    }
  }
  return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale(key, values) {
  var data;
  if (key) {
    if ((0,is_undefined/* default */.A)(values)) {
      data = getLocale(key);
    } else {
      data = defineLocale(key, values);
    }
    if (data) {
      // moment.duration._locale = moment._locale = data;
      globalLocale = data;
    } else {
      if (typeof console !== 'undefined' && console.warn) {
        //warn user if arguments are passed but the locale could not be set
        console.warn('Locale ' + key + ' not found. Did you forget to load it?');
      }
    }
  }
  return globalLocale._abbr;
}
function defineLocale(name, config) {
  if (config !== null) {
    var locale,
      parentConfig = baseConfig;
    config.abbr = name;
    if (locales[name] != null) {
      (0,deprecate/* deprecateSimple */.e)('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
      if (locales[config.parentLocale] != null) {
        parentConfig = locales[config.parentLocale]._config;
      } else {
        locale = loadLocale(config.parentLocale);
        if (locale != null) {
          parentConfig = locale._config;
        } else {
          if (!localeFamilies[config.parentLocale]) {
            localeFamilies[config.parentLocale] = [];
          }
          localeFamilies[config.parentLocale].push({
            name: name,
            config: config
          });
          return null;
        }
      }
    }
    locales[name] = new locale_constructor/* Locale */.h((0,set/* mergeConfigs */.S)(parentConfig, config));
    if (localeFamilies[name]) {
      localeFamilies[name].forEach(function (x) {
        defineLocale(x.name, x.config);
      });
    }

    // backwards compat for now: also set the locale
    // make sure we set the locale AFTER all child locales have been
    // created, so we won't end up with the child locale set.
    getSetGlobalLocale(name);
    return locales[name];
  } else {
    // useful for testing
    delete locales[name];
    return null;
  }
}
function updateLocale(name, config) {
  if (config != null) {
    var locale,
      tmpLocale,
      parentConfig = baseConfig;
    if (locales[name] != null && locales[name].parentLocale != null) {
      // Update existing child locale in-place to avoid memory-leaks
      locales[name].set((0,set/* mergeConfigs */.S)(locales[name]._config, config));
    } else {
      // MERGE
      tmpLocale = loadLocale(name);
      if (tmpLocale != null) {
        parentConfig = tmpLocale._config;
      }
      config = (0,set/* mergeConfigs */.S)(parentConfig, config);
      if (tmpLocale == null) {
        // updateLocale is called for creating a new locale
        // Set abbr so it will have a name (getters return
        // undefined otherwise).
        config.abbr = name;
      }
      locale = new locale_constructor/* Locale */.h(config);
      locale.parentLocale = locales[name];
      locales[name] = locale;
    }

    // backwards compat for now: also set the locale
    getSetGlobalLocale(name);
  } else {
    // pass null for config to unupdate, useful for tests
    if (locales[name] != null) {
      if (locales[name].parentLocale != null) {
        locales[name] = locales[name].parentLocale;
        if (name === getSetGlobalLocale()) {
          getSetGlobalLocale(name);
        }
      } else if (locales[name] != null) {
        delete locales[name];
      }
    }
  }
  return locales[name];
}

// returns locale data
function getLocale(key) {
  var locale;
  if (key && key._locale && key._locale._abbr) {
    key = key._locale._abbr;
  }
  if (!key) {
    return globalLocale;
  }
  if (!(0,is_array/* default */.A)(key)) {
    //short-circuit everything else
    locale = loadLocale(key);
    if (locale) {
      return locale;
    }
    key = [key];
  }
  return chooseLocale(key);
}
function listLocales() {
  return keys(locales);
}

/***/ }),

/***/ 255:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IE: () => (/* binding */ ordinal),
/* harmony export */   L7: () => (/* binding */ defaultDayOfMonthOrdinalParse),
/* harmony export */   hR: () => (/* binding */ defaultOrdinal)
/* harmony export */ });
var defaultOrdinal = '%d',
  defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal(number) {
  return this._ordinal.replace('%d', number);
}

/***/ }),

/***/ 640:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $0: () => (/* binding */ defaultRelativeTime),
/* harmony export */   KW: () => (/* binding */ relativeTime),
/* harmony export */   gE: () => (/* binding */ pastFuture)
/* harmony export */ });
/* harmony import */ var _utils_is_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(654);
var defaultRelativeTime = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  w: 'a week',
  ww: '%d weeks',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years'
};

function relativeTime(number, withoutSuffix, string, isFuture) {
  var output = this._relativeTime[string];
  return (0,_utils_is_function__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
}
function pastFuture(diff, output) {
  var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
  return (0,_utils_is_function__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(format) ? format(output) : format.replace(/%s/i, output);
}

/***/ }),

/***/ 418:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ mergeConfigs),
/* harmony export */   h: () => (/* binding */ set)
/* harmony export */ });
/* harmony import */ var _utils_is_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(654);
/* harmony import */ var _utils_extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(193);
/* harmony import */ var _utils_is_object__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(945);
/* harmony import */ var _utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(396);




function set(config) {
  var prop, i;
  for (i in config) {
    if ((0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(config, i)) {
      prop = config[i];
      if ((0,_utils_is_function__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(prop)) {
        this[i] = prop;
      } else {
        this['_' + i] = prop;
      }
    }
  }
  this._config = config;
  // Lenient ordinal parsing accepts just a number in addition to
  // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
  // TODO: Remove "ordinalParse" fallback in next major release.
  this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
}
function mergeConfigs(parentConfig, childConfig) {
  var res = (0,_utils_extend__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)({}, parentConfig),
    prop;
  for (prop in childConfig) {
    if ((0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(childConfig, prop)) {
      if ((0,_utils_is_object__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(parentConfig[prop]) && (0,_utils_is_object__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(childConfig[prop])) {
        res[prop] = {};
        (0,_utils_extend__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(res[prop], parentConfig[prop]);
        (0,_utils_extend__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(res[prop], childConfig[prop]);
      } else if (childConfig[prop] != null) {
        res[prop] = childConfig[prop];
      } else {
        delete res[prop];
      }
    }
  }
  for (prop in parentConfig) {
    if ((0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(parentConfig, prop) && !(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(childConfig, prop) && (0,_utils_is_object__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(parentConfig[prop])) {
      // make sure changes to properties don't modify parent config
      res[prop] = (0,_utils_extend__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)({}, res[prop]);
    }
  }
  return res;
}

/***/ }),

/***/ 916:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "do": () => (/* binding */ Moment),
/* harmony export */   om: () => (/* binding */ copyConfig),
/* harmony export */   t_: () => (/* binding */ isMoment)
/* harmony export */ });
/* harmony import */ var _utils_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(581);
/* harmony import */ var _utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(420);
/* harmony import */ var _create_parsing_flags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(810);




// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = _utils_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.momentProperties = [],
  updateInProgress = false;
function copyConfig(to, from) {
  var i,
    prop,
    val,
    momentPropertiesLen = momentProperties.length;
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._isAMomentObject)) {
    to._isAMomentObject = from._isAMomentObject;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._i)) {
    to._i = from._i;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._f)) {
    to._f = from._f;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._l)) {
    to._l = from._l;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._strict)) {
    to._strict = from._strict;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._tzm)) {
    to._tzm = from._tzm;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._isUTC)) {
    to._isUTC = from._isUTC;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._offset)) {
    to._offset = from._offset;
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._pf)) {
    to._pf = (0,_create_parsing_flags__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(from);
  }
  if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(from._locale)) {
    to._locale = from._locale;
  }
  if (momentPropertiesLen > 0) {
    for (i = 0; i < momentPropertiesLen; i++) {
      prop = momentProperties[i];
      val = from[prop];
      if (!(0,_utils_is_undefined__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(val)) {
        to[prop] = val;
      }
    }
  }
  return to;
}

// Moment prototype object
function Moment(config) {
  copyConfig(this, config);
  this._d = new Date(config._d != null ? config._d.getTime() : NaN);
  if (!this.isValid()) {
    this._d = new Date(NaN);
  }
  // Prevent infinite loop in case updateOffset creates new moment
  // objects.
  if (updateInProgress === false) {
    updateInProgress = true;
    _utils_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.updateOffset(this);
    updateInProgress = false;
  }
}
function isMoment(obj) {
  return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
}

/***/ }),

/***/ 197:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Jt: () => (/* binding */ get),
  F9: () => (/* binding */ makeGetSet),
  hZ: () => (/* binding */ set),
  IN: () => (/* binding */ stringGet),
  O4: () => (/* binding */ stringSet)
});

// EXTERNAL MODULE: ./src/lib/units/aliases.js
var aliases = __webpack_require__(155);
// EXTERNAL MODULE: ./src/lib/utils/has-own-prop.js
var has_own_prop = __webpack_require__(396);
;// CONCATENATED MODULE: ./src/lib/units/priorities.js

var priorities = {
  date: 9,
  day: 11,
  weekday: 11,
  isoWeekday: 11,
  dayOfYear: 4,
  hour: 13,
  millisecond: 16,
  minute: 14,
  month: 8,
  quarter: 7,
  second: 15,
  weekYear: 1,
  isoWeekYear: 1,
  week: 5,
  isoWeek: 5,
  year: 1
};
function getPrioritizedUnits(unitsObj) {
  var units = [],
    u;
  for (u in unitsObj) {
    if ((0,has_own_prop/* default */.A)(unitsObj, u)) {
      units.push({
        unit: u,
        priority: priorities[u]
      });
    }
  }
  units.sort(function (a, b) {
    return a.priority - b.priority;
  });
  return units;
}
// EXTERNAL MODULE: ./src/lib/utils/hooks.js
var hooks = __webpack_require__(581);
// EXTERNAL MODULE: ./src/lib/utils/is-function.js
var is_function = __webpack_require__(654);
// EXTERNAL MODULE: ./src/lib/units/year.js
var units_year = __webpack_require__(502);
;// CONCATENATED MODULE: ./src/lib/moment/get-set.js





function makeGetSet(unit, keepTime) {
  return function (value) {
    if (value != null) {
      set(this, unit, value);
      hooks/* hooks */.J.updateOffset(this, keepTime);
      return this;
    } else {
      return get(this, unit);
    }
  };
}
function get(mom, unit) {
  if (!mom.isValid()) {
    return NaN;
  }
  var d = mom._d,
    isUTC = mom._isUTC;
  switch (unit) {
    case 'Milliseconds':
      return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();
    case 'Seconds':
      return isUTC ? d.getUTCSeconds() : d.getSeconds();
    case 'Minutes':
      return isUTC ? d.getUTCMinutes() : d.getMinutes();
    case 'Hours':
      return isUTC ? d.getUTCHours() : d.getHours();
    case 'Date':
      return isUTC ? d.getUTCDate() : d.getDate();
    case 'Day':
      return isUTC ? d.getUTCDay() : d.getDay();
    case 'Month':
      return isUTC ? d.getUTCMonth() : d.getMonth();
    case 'FullYear':
      return isUTC ? d.getUTCFullYear() : d.getFullYear();
    default:
      return NaN;
    // Just in case
  }
}
function set(mom, unit, value) {
  var d, isUTC, year, month, date;
  if (!mom.isValid() || isNaN(value)) {
    return;
  }
  d = mom._d;
  isUTC = mom._isUTC;
  switch (unit) {
    case 'Milliseconds':
      return void (isUTC ? d.setUTCMilliseconds(value) : d.setMilliseconds(value));
    case 'Seconds':
      return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));
    case 'Minutes':
      return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));
    case 'Hours':
      return void (isUTC ? d.setUTCHours(value) : d.setHours(value));
    case 'Date':
      return void (isUTC ? d.setUTCDate(value) : d.setDate(value));
    // case 'Day': // Not real
    //    return void (isUTC ? d.setUTCDay(value) : d.setDay(value));
    // case 'Month': // Not used because we need to pass two variables
    //     return void (isUTC ? d.setUTCMonth(value) : d.setMonth(value));
    case 'FullYear':
      break;
    // See below ...
    default:
      return;
    // Just in case
  }
  year = value;
  month = mom.month();
  date = mom.date();
  date = date === 29 && month === 1 && !(0,units_year/* isLeapYear */.U_)(year) ? 28 : date;
  void (isUTC ? d.setUTCFullYear(year, month, date) : d.setFullYear(year, month, date));
}

// MOMENTS

function stringGet(units) {
  units = (0,aliases/* normalizeUnits */.F)(units);
  if ((0,is_function/* default */.A)(this[units])) {
    return this[units]();
  }
  return this;
}
function stringSet(units, value) {
  if (typeof units === 'object') {
    units = (0,aliases/* normalizeObjectUnits */.M)(units);
    var prioritized = getPrioritizedUnits(units),
      i,
      prioritizedLen = prioritized.length;
    for (i = 0; i < prioritizedLen; i++) {
      this[prioritized[i].unit](units[prioritized[i].unit]);
    }
  } else {
    units = (0,aliases/* normalizeUnits */.F)(units);
    if ((0,is_function/* default */.A)(this[units])) {
      return this[units](value);
    }
  }
  return this;
}

/***/ }),

/***/ 560:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $3: () => (/* binding */ match1),
/* harmony export */   A6: () => (/* binding */ matchWord),
/* harmony export */   H1: () => (/* binding */ matchUnsigned),
/* harmony export */   MZ: () => (/* binding */ match1to2HasZero),
/* harmony export */   NH: () => (/* binding */ match3),
/* harmony export */   OF: () => (/* binding */ match1to6),
/* harmony export */   Ot: () => (/* binding */ matchTimestamp),
/* harmony export */   P: () => (/* binding */ match1to2NoLeadingZero),
/* harmony export */   U4: () => (/* binding */ match5to6),
/* harmony export */   Uj: () => (/* binding */ match2),
/* harmony export */   V4: () => (/* binding */ match1to3),
/* harmony export */   Z: () => (/* binding */ matchOffset),
/* harmony export */   ZX: () => (/* binding */ matchShortOffset),
/* harmony export */   Zs: () => (/* binding */ getParseRegexForToken),
/* harmony export */   aH: () => (/* binding */ match1to2),
/* harmony export */   aW: () => (/* binding */ match1to4),
/* harmony export */   gA: () => (/* binding */ match4),
/* harmony export */   gV: () => (/* binding */ match6),
/* harmony export */   q9: () => (/* binding */ match3to4),
/* harmony export */   uJ: () => (/* binding */ matchSigned),
/* harmony export */   uk: () => (/* binding */ addRegexToken),
/* harmony export */   vQ: () => (/* binding */ regexEscape)
/* harmony export */ });
/* harmony import */ var _utils_has_own_prop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(396);
/* harmony import */ var _utils_is_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(654);
var match1 = /\d/,
  //       0 - 9
  match2 = /\d\d/,
  //      00 - 99
  match3 = /\d{3}/,
  //     000 - 999
  match4 = /\d{4}/,
  //    0000 - 9999
  match6 = /[+-]?\d{6}/,
  // -999999 - 999999
  match1to2 = /\d\d?/,
  //       0 - 99
  match3to4 = /\d\d\d\d?/,
  //     999 - 9999
  match5to6 = /\d\d\d\d\d\d?/,
  //   99999 - 999999
  match1to3 = /\d{1,3}/,
  //       0 - 999
  match1to4 = /\d{1,4}/,
  //       0 - 9999
  match1to6 = /[+-]?\d{1,6}/,
  // -999999 - 999999
  matchUnsigned = /\d+/,
  //       0 - inf
  matchSigned = /[+-]?\d+/,
  //    -inf - inf
  matchOffset = /Z|[+-]\d\d:?\d\d/gi,
  // +00:00 -00:00 +0000 -0000 or Z
  matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi,
  // +00 -00 +00:00 -00:00 +0000 -0000 or Z
  matchTimestamp = /[+-]?\d+(\.\d{1,3})?/,
  // 123456789 123456789.123
  // any word (or two) characters or numbers including two/three word month in arabic.
  // includes scottish gaelic two word and hyphenated months
  matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
  match1to2NoLeadingZero = /^[1-9]\d?/,
  //         1-99
  match1to2HasZero = /^([1-9]\d|\d)/,
  //           0-99
  regexes;



regexes = {};
function addRegexToken(token, regex, strictRegex) {
  regexes[token] = (0,_utils_is_function__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(regex) ? regex : function (isStrict, localeData) {
    return isStrict && strictRegex ? strictRegex : regex;
  };
}
function getParseRegexForToken(token, config) {
  if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(regexes, token)) {
    return new RegExp(unescapeFormat(token));
  }
  return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
  return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
    return p1 || p2 || p3 || p4;
  }));
}
function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/***/ }),

/***/ 218:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q8: () => (/* binding */ addTimeToArrayFromToken),
/* harmony export */   Y1: () => (/* binding */ addParseToken),
/* harmony export */   qw: () => (/* binding */ addWeekParseToken)
/* harmony export */ });
/* harmony import */ var _utils_has_own_prop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(396);
/* harmony import */ var _utils_is_number__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(523);
/* harmony import */ var _utils_to_int__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(596);



var tokens = {};
function addParseToken(token, callback) {
  var i,
    func = callback,
    tokenLen;
  if (typeof token === 'string') {
    token = [token];
  }
  if ((0,_utils_is_number__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(callback)) {
    func = function (input, array) {
      array[callback] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(input);
    };
  }
  tokenLen = token.length;
  for (i = 0; i < tokenLen; i++) {
    tokens[token[i]] = func;
  }
}
function addWeekParseToken(token, callback) {
  addParseToken(token, function (input, array, config, token) {
    config._w = config._w || {};
    callback(input, config._w, config, token);
  });
}
function addTimeToArrayFromToken(token, input, config) {
  if (input != null && (0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(tokens, token)) {
    tokens[token](input, config._a, config, token);
  }
}

/***/ }),

/***/ 155:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ normalizeUnits),
/* harmony export */   M: () => (/* binding */ normalizeObjectUnits)
/* harmony export */ });
/* harmony import */ var _utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(396);

var aliases = {
  D: 'date',
  dates: 'date',
  date: 'date',
  d: 'day',
  days: 'day',
  day: 'day',
  e: 'weekday',
  weekdays: 'weekday',
  weekday: 'weekday',
  E: 'isoWeekday',
  isoweekdays: 'isoWeekday',
  isoweekday: 'isoWeekday',
  DDD: 'dayOfYear',
  dayofyears: 'dayOfYear',
  dayofyear: 'dayOfYear',
  h: 'hour',
  hours: 'hour',
  hour: 'hour',
  ms: 'millisecond',
  milliseconds: 'millisecond',
  millisecond: 'millisecond',
  m: 'minute',
  minutes: 'minute',
  minute: 'minute',
  M: 'month',
  months: 'month',
  month: 'month',
  Q: 'quarter',
  quarters: 'quarter',
  quarter: 'quarter',
  s: 'second',
  seconds: 'second',
  second: 'second',
  gg: 'weekYear',
  weekyears: 'weekYear',
  weekyear: 'weekYear',
  GG: 'isoWeekYear',
  isoweekyears: 'isoWeekYear',
  isoweekyear: 'isoWeekYear',
  w: 'week',
  weeks: 'week',
  week: 'week',
  W: 'isoWeek',
  isoweeks: 'isoWeek',
  isoweek: 'isoWeek',
  y: 'year',
  years: 'year',
  year: 'year'
};
function normalizeUnits(units) {
  return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}
function normalizeObjectUnits(inputObject) {
  var normalizedInput = {},
    normalizedProp,
    prop;
  for (prop in inputObject) {
    if ((0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(inputObject, prop)) {
      normalizedProp = normalizeUnits(prop);
      if (normalizedProp) {
        normalizedInput[normalizedProp] = inputObject[prop];
      }
    }
  }
  return normalizedInput;
}

/***/ }),

/***/ 282:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DJ: () => (/* binding */ WEEKDAY),
/* harmony export */   Lp: () => (/* binding */ MONTH),
/* harmony export */   UX: () => (/* binding */ YEAR),
/* harmony export */   V8: () => (/* binding */ WEEK),
/* harmony export */   Z2: () => (/* binding */ SECOND),
/* harmony export */   dp: () => (/* binding */ HOUR),
/* harmony export */   oG: () => (/* binding */ MILLISECOND),
/* harmony export */   pY: () => (/* binding */ MINUTE),
/* harmony export */   vH: () => (/* binding */ DATE)
/* harmony export */ });
var YEAR = 0,
  MONTH = 1,
  DATE = 2,
  HOUR = 3,
  MINUTE = 4,
  SECOND = 5,
  MILLISECOND = 6,
  WEEK = 7,
  WEEKDAY = 8;

/***/ }),

/***/ 928:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fz: () => (/* binding */ localeWeekdaysParse),
/* harmony export */   HY: () => (/* binding */ defaultLocaleWeekdays),
/* harmony export */   I_: () => (/* binding */ getSetLocaleDayOfWeek),
/* harmony export */   Jo: () => (/* binding */ weekdaysRegex),
/* harmony export */   NQ: () => (/* binding */ weekdaysMinRegex),
/* harmony export */   PR: () => (/* binding */ defaultLocaleWeekdaysMin),
/* harmony export */   Qo: () => (/* binding */ localeWeekdaysShort),
/* harmony export */   VP: () => (/* binding */ defaultLocaleWeekdaysShort),
/* harmony export */   iE: () => (/* binding */ getSetDayOfWeek),
/* harmony export */   j1: () => (/* binding */ getSetISODayOfWeek),
/* harmony export */   q6: () => (/* binding */ localeWeekdaysMin),
/* harmony export */   q8: () => (/* binding */ localeWeekdays),
/* harmony export */   xB: () => (/* binding */ weekdaysShortRegex)
/* harmony export */ });
/* harmony import */ var _moment_get_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);
/* harmony import */ var _format_format__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(592);
/* harmony import */ var _parse_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(560);
/* harmony import */ var _parse_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(218);
/* harmony import */ var _utils_to_int__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(596);
/* harmony import */ var _utils_is_array__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(261);
/* harmony import */ var _utils_index_of__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(219);
/* harmony import */ var _utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(396);
/* harmony import */ var _create_utc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(990);
/* harmony import */ var _create_parsing_flags__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(810);











// FORMATTING

(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('d', 0, 'do', 'day');
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('dd', 0, 0, function (format) {
  return this.localeData().weekdaysMin(this, format);
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('ddd', 0, 0, function (format) {
  return this.localeData().weekdaysShort(this, format);
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('dddd', 0, 0, function (format) {
  return this.localeData().weekdays(this, format);
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('e', 0, 0, 'weekday');
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('E', 0, 0, 'isoWeekday');

// PARSING

(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('d', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('e', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('E', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('dd', function (isStrict, locale) {
  return locale.weekdaysMinRegex(isStrict);
});
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('ddd', function (isStrict, locale) {
  return locale.weekdaysShortRegex(isStrict);
});
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('dddd', function (isStrict, locale) {
  return locale.weekdaysRegex(isStrict);
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addWeekParseToken */ .qw)(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
  var weekday = config._locale.weekdaysParse(input, token, config._strict);
  // if we didn't get a weekday name, mark the date as invalid
  if (weekday != null) {
    week.d = weekday;
  } else {
    (0,_create_parsing_flags__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(config).invalidWeekday = input;
  }
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addWeekParseToken */ .qw)(['d', 'e', 'E'], function (input, week, config, token) {
  week[token] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(input);
});

// HELPERS

function parseWeekday(input, locale) {
  if (typeof input !== 'string') {
    return input;
  }
  if (!isNaN(input)) {
    return parseInt(input, 10);
  }
  input = locale.weekdaysParse(input);
  if (typeof input === 'number') {
    return input;
  }
  return null;
}
function parseIsoWeekday(input, locale) {
  if (typeof input === 'string') {
    return locale.weekdaysParse(input) % 7 || 7;
  }
  return isNaN(input) ? null : input;
}

// LOCALES
function shiftWeekdays(ws, n) {
  return ws.slice(n, 7).concat(ws.slice(0, n));
}
var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  defaultWeekdaysRegex = _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .matchWord */ .A6,
  defaultWeekdaysShortRegex = _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .matchWord */ .A6,
  defaultWeekdaysMinRegex = _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .matchWord */ .A6;

function localeWeekdays(m, format) {
  var weekdays = (0,_utils_is_array__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A)(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format) ? 'format' : 'standalone'];
  return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
}
function localeWeekdaysShort(m) {
  return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}
function localeWeekdaysMin(m) {
  return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}
function handleStrictParse(weekdayName, format, strict) {
  var i,
    ii,
    mom,
    llc = weekdayName.toLocaleLowerCase();
  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._minWeekdaysParse = [];
    for (i = 0; i < 7; ++i) {
      mom = (0,_create_utc__WEBPACK_IMPORTED_MODULE_5__/* .createUTC */ .X)([2000, 1]).day(i);
      this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
      this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
      this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
    }
  }
  if (strict) {
    if (format === 'dddd') {
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._weekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'dddd') {
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._shortWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._minWeekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._weekdaysParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = _utils_index_of__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}
function localeWeekdaysParse(weekdayName, format, strict) {
  var i, mom, regex;
  if (this._weekdaysParseExact) {
    return handleStrictParse.call(this, weekdayName, format, strict);
  }
  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._minWeekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._fullWeekdaysParse = [];
  }
  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already

    mom = (0,_create_utc__WEBPACK_IMPORTED_MODULE_5__/* .createUTC */ .X)([2000, 1]).day(i);
    if (strict && !this._fullWeekdaysParse[i]) {
      this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
      this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
      this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
    }
    if (!this._weekdaysParse[i]) {
      regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
      this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
    }
    // test the regex
    if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
      return i;
    }
  }
}

// MOMENTS

function getSetDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  var day = (0,_moment_get_set__WEBPACK_IMPORTED_MODULE_0__/* .get */ .Jt)(this, 'Day');
  if (input != null) {
    input = parseWeekday(input, this.localeData());
    return this.add(input - day, 'd');
  } else {
    return day;
  }
}
function getSetLocaleDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
  return input == null ? weekday : this.add(input - weekday, 'd');
}
function getSetISODayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }

  // behaves the same as moment#day except
  // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
  // as a setter, sunday should belong to the previous week.

  if (input != null) {
    var weekday = parseIsoWeekday(input, this.localeData());
    return this.day(this.day() % 7 ? weekday : weekday - 7);
  } else {
    return this.day() || 7;
  }
}
function weekdaysRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysStrictRegex;
    } else {
      return this._weekdaysRegex;
    }
  } else {
    if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this, '_weekdaysRegex')) {
      this._weekdaysRegex = defaultWeekdaysRegex;
    }
    return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
  }
}
function weekdaysShortRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysShortStrictRegex;
    } else {
      return this._weekdaysShortRegex;
    }
  } else {
    if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this, '_weekdaysShortRegex')) {
      this._weekdaysShortRegex = defaultWeekdaysShortRegex;
    }
    return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
  }
}
function weekdaysMinRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }
    if (isStrict) {
      return this._weekdaysMinStrictRegex;
    } else {
      return this._weekdaysMinRegex;
    }
  } else {
    if (!(0,_utils_has_own_prop__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)(this, '_weekdaysMinRegex')) {
      this._weekdaysMinRegex = defaultWeekdaysMinRegex;
    }
    return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
  }
}
function computeWeekdaysParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }
  var minPieces = [],
    shortPieces = [],
    longPieces = [],
    mixedPieces = [],
    i,
    mom,
    minp,
    shortp,
    longp;
  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already
    mom = (0,_create_utc__WEBPACK_IMPORTED_MODULE_5__/* .createUTC */ .X)([2000, 1]).day(i);
    minp = (0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .regexEscape */ .vQ)(this.weekdaysMin(mom, ''));
    shortp = (0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .regexEscape */ .vQ)(this.weekdaysShort(mom, ''));
    longp = (0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .regexEscape */ .vQ)(this.weekdays(mom, ''));
    minPieces.push(minp);
    shortPieces.push(shortp);
    longPieces.push(longp);
    mixedPieces.push(minp);
    mixedPieces.push(shortp);
    mixedPieces.push(longp);
  }
  // Sorting makes sure if one weekday (or abbr) is a prefix of another it
  // will match the longer piece.
  minPieces.sort(cmpLenRev);
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._weekdaysShortRegex = this._weekdaysRegex;
  this._weekdaysMinRegex = this._weekdaysRegex;
  this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
  this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ku: () => (/* binding */ localeIsPM),
/* harmony export */   PN: () => (/* binding */ defaultLocaleMeridiemParse),
/* harmony export */   dK: () => (/* binding */ localeMeridiem),
/* harmony export */   r_: () => (/* binding */ getSetHour)
/* harmony export */ });
/* harmony import */ var _moment_get_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);
/* harmony import */ var _format_format__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(592);
/* harmony import */ var _parse_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(560);
/* harmony import */ var _parse_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(218);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(282);
/* harmony import */ var _utils_to_int__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(596);
/* harmony import */ var _utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(825);
/* harmony import */ var _create_parsing_flags__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(810);









// FORMATTING

function hFormat() {
  return this.hours() % 12 || 12;
}
function kFormat() {
  return this.hours() || 24;
}
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('H', ['HH', 2], 0, 'hour');
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('h', ['hh', 2], 0, hFormat);
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('k', ['kk', 2], 0, kFormat);
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('hmm', 0, 0, function () {
  return '' + hFormat.apply(this) + (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this.minutes(), 2);
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('hmmss', 0, 0, function () {
  return '' + hFormat.apply(this) + (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this.minutes(), 2) + (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this.seconds(), 2);
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('Hmm', 0, 0, function () {
  return '' + this.hours() + (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this.minutes(), 2);
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('Hmmss', 0, 0, function () {
  return '' + this.hours() + (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this.minutes(), 2) + (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(this.seconds(), 2);
});
function meridiem(token, lowercase) {
  (0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)(token, 0, 0, function () {
    return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
  });
}
meridiem('a', true);
meridiem('A', false);

// PARSING

function matchMeridiem(isStrict, locale) {
  return locale._meridiemParse;
}
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('a', matchMeridiem);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('A', matchMeridiem);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('H', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2HasZero */ .MZ);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('h', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2NoLeadingZero */ .P);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('k', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2NoLeadingZero */ .P);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('HH', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match2 */ .Uj);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('hh', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match2 */ .Uj);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('kk', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match2 */ .Uj);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('hmm', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match3to4 */ .q9);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('hmmss', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match5to6 */ .U4);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('Hmm', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match3to4 */ .q9);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('Hmmss', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match5to6 */ .U4);
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)(['H', 'HH'], _constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp);
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)(['k', 'kk'], function (input, array, config) {
  var kInput = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input);
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp] = kInput === 24 ? 0 : kInput;
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)(['a', 'A'], function (input, array, config) {
  config._isPm = config._locale.isPM(input);
  config._meridiem = input;
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)(['h', 'hh'], function (input, array, config) {
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input);
  (0,_create_parsing_flags__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(config).bigHour = true;
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('hmm', function (input, array, config) {
  var pos = input.length - 2;
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(0, pos));
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .MINUTE */ .pY] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(pos));
  (0,_create_parsing_flags__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(config).bigHour = true;
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('hmmss', function (input, array, config) {
  var pos1 = input.length - 4,
    pos2 = input.length - 2;
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(0, pos1));
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .MINUTE */ .pY] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(pos1, 2));
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .SECOND */ .Z2] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(pos2));
  (0,_create_parsing_flags__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(config).bigHour = true;
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('Hmm', function (input, array, config) {
  var pos = input.length - 2;
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(0, pos));
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .MINUTE */ .pY] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(pos));
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('Hmmss', function (input, array, config) {
  var pos1 = input.length - 4,
    pos2 = input.length - 2;
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .HOUR */ .dp] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(0, pos1));
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .MINUTE */ .pY] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(pos1, 2));
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .SECOND */ .Z2] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A)(input.substr(pos2));
});

// LOCALES

function localeIsPM(input) {
  // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
  // Using charAt should be more compatible.
  return (input + '').toLowerCase().charAt(0) === 'p';
}
var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
  // Setting the hour should keep the time, because the user explicitly
  // specified which hour they want. So trying to maintain the same hour (in
  // a new timezone) makes sense. Adding/subtracting hours does not follow
  // this rule.
  getSetHour = (0,_moment_get_set__WEBPACK_IMPORTED_MODULE_0__/* .makeGetSet */ .F9)('Hours', true);
function localeMeridiem(hours, minutes, isLower) {
  if (hours > 11) {
    return isLower ? 'pm' : 'PM';
  } else {
    return isLower ? 'am' : 'AM';
  }
}

/***/ }),

/***/ 942:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  L3: () => (/* binding */ daysInMonth),
  HU: () => (/* binding */ defaultLocaleMonths),
  vu: () => (/* binding */ defaultLocaleMonthsShort),
  PK: () => (/* binding */ getDaysInMonth),
  Hr: () => (/* binding */ getSetMonth),
  EB: () => (/* binding */ localeMonths),
  D4: () => (/* binding */ localeMonthsParse),
  cw: () => (/* binding */ localeMonthsShort),
  Nq: () => (/* binding */ monthsRegex),
  vw: () => (/* binding */ monthsShortRegex),
  ZJ: () => (/* binding */ setMonth)
});

// EXTERNAL MODULE: ./src/lib/moment/get-set.js + 1 modules
var get_set = __webpack_require__(197);
// EXTERNAL MODULE: ./src/lib/utils/has-own-prop.js
var has_own_prop = __webpack_require__(396);
// EXTERNAL MODULE: ./src/lib/format/format.js
var format = __webpack_require__(592);
// EXTERNAL MODULE: ./src/lib/parse/regex.js
var regex = __webpack_require__(560);
// EXTERNAL MODULE: ./src/lib/parse/token.js
var token = __webpack_require__(218);
// EXTERNAL MODULE: ./src/lib/utils/hooks.js
var hooks = __webpack_require__(581);
// EXTERNAL MODULE: ./src/lib/units/constants.js
var constants = __webpack_require__(282);
// EXTERNAL MODULE: ./src/lib/utils/to-int.js
var to_int = __webpack_require__(596);
// EXTERNAL MODULE: ./src/lib/utils/is-array.js
var is_array = __webpack_require__(261);
// EXTERNAL MODULE: ./src/lib/utils/is-number.js
var is_number = __webpack_require__(523);
;// CONCATENATED MODULE: ./src/lib/utils/mod.js
function mod(n, x) {
  return (n % x + x) % x;
}
// EXTERNAL MODULE: ./src/lib/utils/index-of.js
var index_of = __webpack_require__(219);
// EXTERNAL MODULE: ./src/lib/create/utc.js
var utc = __webpack_require__(990);
// EXTERNAL MODULE: ./src/lib/create/parsing-flags.js
var parsing_flags = __webpack_require__(810);
// EXTERNAL MODULE: ./src/lib/utils/is-leap-year.js
var is_leap_year = __webpack_require__(432);
;// CONCATENATED MODULE: ./src/lib/units/month.js















function daysInMonth(year, month) {
  if (isNaN(year) || isNaN(month)) {
    return NaN;
  }
  var modMonth = mod(month, 12);
  year += (month - modMonth) / 12;
  return modMonth === 1 ? (0,is_leap_year/* isLeapYear */.U)(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
}

// FORMATTING

(0,format/* addFormatToken */.Se)('M', ['MM', 2], 'Mo', function () {
  return this.month() + 1;
});
(0,format/* addFormatToken */.Se)('MMM', 0, 0, function (format) {
  return this.localeData().monthsShort(this, format);
});
(0,format/* addFormatToken */.Se)('MMMM', 0, 0, function (format) {
  return this.localeData().months(this, format);
});

// PARSING

(0,regex/* addRegexToken */.uk)('M', regex/* match1to2 */.aH, regex/* match1to2NoLeadingZero */.P);
(0,regex/* addRegexToken */.uk)('MM', regex/* match1to2 */.aH, regex/* match2 */.Uj);
(0,regex/* addRegexToken */.uk)('MMM', function (isStrict, locale) {
  return locale.monthsShortRegex(isStrict);
});
(0,regex/* addRegexToken */.uk)('MMMM', function (isStrict, locale) {
  return locale.monthsRegex(isStrict);
});
(0,token/* addParseToken */.Y1)(['M', 'MM'], function (input, array) {
  array[constants/* MONTH */.Lp] = (0,to_int/* default */.A)(input) - 1;
});
(0,token/* addParseToken */.Y1)(['MMM', 'MMMM'], function (input, array, config, token) {
  var month = config._locale.monthsParse(input, token, config._strict);
  // if we didn't find a month name, mark the date as invalid.
  if (month != null) {
    array[constants/* MONTH */.Lp] = month;
  } else {
    (0,parsing_flags/* default */.A)(config).invalidMonth = input;
  }
});

// LOCALES

var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
  MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
  defaultMonthsShortRegex = regex/* matchWord */.A6,
  defaultMonthsRegex = regex/* matchWord */.A6;

function localeMonths(m, format) {
  if (!m) {
    return (0,is_array/* default */.A)(this._months) ? this._months : this._months['standalone'];
  }
  return (0,is_array/* default */.A)(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}
function localeMonthsShort(m, format) {
  if (!m) {
    return (0,is_array/* default */.A)(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
  }
  return (0,is_array/* default */.A)(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}
function handleStrictParse(monthName, format, strict) {
  var i,
    ii,
    mom,
    llc = monthName.toLocaleLowerCase();
  if (!this._monthsParse) {
    // this is not used
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
    for (i = 0; i < 12; ++i) {
      mom = (0,utc/* createUTC */.X)([2000, i]);
      this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
      this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
    }
  }
  if (strict) {
    if (format === 'MMM') {
      ii = index_of/* default */.A.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = index_of/* default */.A.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'MMM') {
      ii = index_of/* default */.A.call(this._shortMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = index_of/* default */.A.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = index_of/* default */.A.call(this._longMonthsParse, llc);
      if (ii !== -1) {
        return ii;
      }
      ii = index_of/* default */.A.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}
function localeMonthsParse(monthName, format, strict) {
  var i, mom, regex;
  if (this._monthsParseExact) {
    return handleStrictParse.call(this, monthName, format, strict);
  }
  if (!this._monthsParse) {
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
  }

  // TODO: add sorting
  // Sorting makes sure if one month (or abbr) is a prefix of another
  // see sorting in computeMonthsParse
  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = (0,utc/* createUTC */.X)([2000, i]);
    if (strict && !this._longMonthsParse[i]) {
      this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
      this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
    }
    if (!strict && !this._monthsParse[i]) {
      regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
      this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
    }
    // test the regex
    if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
      return i;
    } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
      return i;
    } else if (!strict && this._monthsParse[i].test(monthName)) {
      return i;
    }
  }
}

// MOMENTS

function setMonth(mom, value) {
  if (!mom.isValid()) {
    // No op
    return mom;
  }
  if (typeof value === 'string') {
    if (/^\d+$/.test(value)) {
      value = (0,to_int/* default */.A)(value);
    } else {
      value = mom.localeData().monthsParse(value);
      // TODO: Another silent failure?
      if (!(0,is_number/* default */.A)(value)) {
        return mom;
      }
    }
  }
  var month = value,
    date = mom.date();
  date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
  void (mom._isUTC ? mom._d.setUTCMonth(month, date) : mom._d.setMonth(month, date));
  return mom;
}
function getSetMonth(value) {
  if (value != null) {
    setMonth(this, value);
    hooks/* hooks */.J.updateOffset(this, true);
    return this;
  } else {
    return (0,get_set/* get */.Jt)(this, 'Month');
  }
}
function getDaysInMonth() {
  return daysInMonth(this.year(), this.month());
}
function monthsShortRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!(0,has_own_prop/* default */.A)(this, '_monthsRegex')) {
      computeMonthsParse.call(this);
    }
    if (isStrict) {
      return this._monthsShortStrictRegex;
    } else {
      return this._monthsShortRegex;
    }
  } else {
    if (!(0,has_own_prop/* default */.A)(this, '_monthsShortRegex')) {
      this._monthsShortRegex = defaultMonthsShortRegex;
    }
    return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
  }
}
function monthsRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!(0,has_own_prop/* default */.A)(this, '_monthsRegex')) {
      computeMonthsParse.call(this);
    }
    if (isStrict) {
      return this._monthsStrictRegex;
    } else {
      return this._monthsRegex;
    }
  } else {
    if (!(0,has_own_prop/* default */.A)(this, '_monthsRegex')) {
      this._monthsRegex = defaultMonthsRegex;
    }
    return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
  }
}
function computeMonthsParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }
  var shortPieces = [],
    longPieces = [],
    mixedPieces = [],
    i,
    mom,
    shortP,
    longP;
  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = (0,utc/* createUTC */.X)([2000, i]);
    shortP = (0,regex/* regexEscape */.vQ)(this.monthsShort(mom, ''));
    longP = (0,regex/* regexEscape */.vQ)(this.months(mom, ''));
    shortPieces.push(shortP);
    longPieces.push(longP);
    mixedPieces.push(longP);
    mixedPieces.push(shortP);
  }
  // Sorting makes sure if one month (or abbr) is a prefix of another it
  // will match the longer piece.
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._monthsShortRegex = this._monthsRegex;
  this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

/***/ }),

/***/ 294:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cB: () => (/* binding */ weeksInYear),
/* harmony export */   ip: () => (/* binding */ dayOfYearFromWeeks),
/* harmony export */   zR: () => (/* binding */ weekOfYear)
/* harmony export */ });
/* harmony import */ var _year__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(502);
/* harmony import */ var _create_date_from_array__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(239);



// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
  var
    // first-week day -- which january is always in the first week (4 for iso, 1 for other)
    fwd = 7 + dow - doy,
    // first-week day local weekday -- which local weekday is fwd
    fwdlw = (7 + (0,_create_date_from_array__WEBPACK_IMPORTED_MODULE_1__/* .createUTCDate */ .P)(year, 0, fwd).getUTCDay() - dow) % 7;
  return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
  var localWeekday = (7 + weekday - dow) % 7,
    weekOffset = firstWeekOffset(year, dow, doy),
    dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
    resYear,
    resDayOfYear;
  if (dayOfYear <= 0) {
    resYear = year - 1;
    resDayOfYear = (0,_year__WEBPACK_IMPORTED_MODULE_0__/* .daysInYear */ .Ki)(resYear) + dayOfYear;
  } else if (dayOfYear > (0,_year__WEBPACK_IMPORTED_MODULE_0__/* .daysInYear */ .Ki)(year)) {
    resYear = year + 1;
    resDayOfYear = dayOfYear - (0,_year__WEBPACK_IMPORTED_MODULE_0__/* .daysInYear */ .Ki)(year);
  } else {
    resYear = year;
    resDayOfYear = dayOfYear;
  }
  return {
    year: resYear,
    dayOfYear: resDayOfYear
  };
}
function weekOfYear(mom, dow, doy) {
  var weekOffset = firstWeekOffset(mom.year(), dow, doy),
    week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
    resWeek,
    resYear;
  if (week < 1) {
    resYear = mom.year() - 1;
    resWeek = week + weeksInYear(resYear, dow, doy);
  } else if (week > weeksInYear(mom.year(), dow, doy)) {
    resWeek = week - weeksInYear(mom.year(), dow, doy);
    resYear = mom.year() + 1;
  } else {
    resYear = mom.year();
    resWeek = week;
  }
  return {
    week: resWeek,
    year: resYear
  };
}
function weeksInYear(year, dow, doy) {
  var weekOffset = firstWeekOffset(year, dow, doy),
    weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return ((0,_year__WEBPACK_IMPORTED_MODULE_0__/* .daysInYear */ .Ki)(year) - weekOffset + weekOffsetNext) / 7;
}

/***/ }),

/***/ 407:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $V: () => (/* binding */ getSetWeek),
/* harmony export */   Mw: () => (/* binding */ localeFirstDayOfWeek),
/* harmony export */   Rl: () => (/* binding */ localeWeek),
/* harmony export */   Wv: () => (/* binding */ getSetISOWeek),
/* harmony export */   qM: () => (/* binding */ defaultLocaleWeek),
/* harmony export */   rc: () => (/* binding */ localeFirstDayOfYear)
/* harmony export */ });
/* harmony import */ var _format_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(592);
/* harmony import */ var _parse_regex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(560);
/* harmony import */ var _parse_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(218);
/* harmony import */ var _utils_to_int__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(596);
/* harmony import */ var _week_calendar_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(294);






// FORMATTING

(0,_format_format__WEBPACK_IMPORTED_MODULE_0__/* .addFormatToken */ .Se)('w', ['ww', 2], 'wo', 'week');
(0,_format_format__WEBPACK_IMPORTED_MODULE_0__/* .addFormatToken */ .Se)('W', ['WW', 2], 'Wo', 'isoWeek');

// PARSING

(0,_parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .addRegexToken */ .uk)('w', _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match1to2NoLeadingZero */ .P);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .addRegexToken */ .uk)('ww', _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match2 */ .Uj);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .addRegexToken */ .uk)('W', _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match1to2NoLeadingZero */ .P);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .addRegexToken */ .uk)('WW', _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_1__/* .match2 */ .Uj);
(0,_parse_token__WEBPACK_IMPORTED_MODULE_2__/* .addWeekParseToken */ .qw)(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
  week[token.substr(0, 1)] = (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(input);
});

// HELPERS

// LOCALES

function localeWeek(mom) {
  return (0,_week_calendar_utils__WEBPACK_IMPORTED_MODULE_3__/* .weekOfYear */ .zR)(mom, this._week.dow, this._week.doy).week;
}
var defaultLocaleWeek = {
  dow: 0,
  // Sunday is the first day of the week.
  doy: 6 // The week that contains Jan 6th is the first week of the year.
};
function localeFirstDayOfWeek() {
  return this._week.dow;
}
function localeFirstDayOfYear() {
  return this._week.doy;
}

// MOMENTS

function getSetWeek(input) {
  var week = this.localeData().week(this);
  return input == null ? week : this.add((input - week) * 7, 'd');
}
function getSetISOWeek(input) {
  var week = (0,_week_calendar_utils__WEBPACK_IMPORTED_MODULE_3__/* .weekOfYear */ .zR)(this, 1, 4).week;
  return input == null ? week : this.add((input - week) * 7, 'd');
}

/***/ }),

/***/ 502:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ki: () => (/* binding */ daysInYear),
/* harmony export */   U_: () => (/* reexport safe */ _utils_is_leap_year__WEBPACK_IMPORTED_MODULE_8__.U),
/* harmony export */   cr: () => (/* binding */ getIsLeapYear),
/* harmony export */   ue: () => (/* binding */ getSetYear)
/* harmony export */ });
/* harmony import */ var _moment_get_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);
/* harmony import */ var _format_format__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(592);
/* harmony import */ var _parse_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(560);
/* harmony import */ var _parse_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(218);
/* harmony import */ var _utils_is_leap_year__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(432);
/* harmony import */ var _utils_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(581);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(282);
/* harmony import */ var _utils_to_int__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(596);
/* harmony import */ var _utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(825);










// FORMATTING

(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)('Y', 0, 0, function () {
  var y = this.year();
  return y <= 9999 ? (0,_utils_zero_fill__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(y, 4) : '+' + y;
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)(0, ['YY', 2], 0, function () {
  return this.year() % 100;
});
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)(0, ['YYYY', 4], 0, 'year');
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)(0, ['YYYYY', 5], 0, 'year');
(0,_format_format__WEBPACK_IMPORTED_MODULE_1__/* .addFormatToken */ .Se)(0, ['YYYYYY', 6, true], 0, 'year');

// PARSING

(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('Y', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .matchSigned */ .uJ);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('YY', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to2 */ .aH, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match2 */ .Uj);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('YYYY', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to4 */ .aW, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match4 */ .gA);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('YYYYY', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to6 */ .OF, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match6 */ .gV);
(0,_parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .addRegexToken */ .uk)('YYYYYY', _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match1to6 */ .OF, _parse_regex__WEBPACK_IMPORTED_MODULE_2__/* .match6 */ .gV);
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)(['YYYYY', 'YYYYYY'], _constants__WEBPACK_IMPORTED_MODULE_5__/* .YEAR */ .UX);
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('YYYY', function (input, array) {
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .YEAR */ .UX] = input.length === 2 ? _utils_hooks__WEBPACK_IMPORTED_MODULE_6__/* .hooks */ .J.parseTwoDigitYear(input) : (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(input);
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('YY', function (input, array) {
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .YEAR */ .UX] = _utils_hooks__WEBPACK_IMPORTED_MODULE_6__/* .hooks */ .J.parseTwoDigitYear(input);
});
(0,_parse_token__WEBPACK_IMPORTED_MODULE_3__/* .addParseToken */ .Y1)('Y', function (input, array) {
  array[_constants__WEBPACK_IMPORTED_MODULE_5__/* .YEAR */ .UX] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
  return (0,_utils_is_leap_year__WEBPACK_IMPORTED_MODULE_8__/* .isLeapYear */ .U)(year) ? 366 : 365;
}


// HOOKS

_utils_hooks__WEBPACK_IMPORTED_MODULE_6__/* .hooks */ .J.parseTwoDigitYear = function (input) {
  return (0,_utils_to_int__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(input) + ((0,_utils_to_int__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A)(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = (0,_moment_get_set__WEBPACK_IMPORTED_MODULE_0__/* .makeGetSet */ .F9)('FullYear', true);
function getIsLeapYear() {
  return (0,_utils_is_leap_year__WEBPACK_IMPORTED_MODULE_8__/* .isLeapYear */ .U)(this.year());
}

/***/ }),

/***/ 938:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ absFloor)
/* harmony export */ });
function absFloor(number) {
  if (number < 0) {
    // -0 -> 0
    return Math.ceil(number) || 0;
  } else {
    return Math.floor(number);
  }
}

/***/ }),

/***/ 182:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ deprecate),
/* harmony export */   e: () => (/* binding */ deprecateSimple)
/* harmony export */ });
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(193);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(581);
/* harmony import */ var _has_own_prop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(396);



function warn(msg) {
  if (_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
    console.warn('Deprecation warning: ' + msg);
  }
}
function deprecate(msg, fn) {
  var firstTime = true;
  return (0,_extend__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(function () {
    if (_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.deprecationHandler != null) {
      _hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.deprecationHandler(null, msg);
    }
    if (firstTime) {
      var args = [],
        arg,
        i,
        key,
        argLen = arguments.length;
      for (i = 0; i < argLen; i++) {
        arg = '';
        if (typeof arguments[i] === 'object') {
          arg += '\n[' + i + '] ';
          for (key in arguments[0]) {
            if ((0,_has_own_prop__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(arguments[0], key)) {
              arg += key + ': ' + arguments[0][key] + ', ';
            }
          }
          arg = arg.slice(0, -2); // Remove trailing comma and space
        } else {
          arg = arguments[i];
        }
        args.push(arg);
      }
      warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + new Error().stack);
      firstTime = false;
    }
    return fn.apply(this, arguments);
  }, fn);
}
var deprecations = {};
function deprecateSimple(name, msg) {
  if (_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.deprecationHandler != null) {
    _hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.deprecationHandler(name, msg);
  }
  if (!deprecations[name]) {
    warn(msg);
    deprecations[name] = true;
  }
}
_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.suppressDeprecationWarnings = false;
_hooks__WEBPACK_IMPORTED_MODULE_0__/* .hooks */ .J.deprecationHandler = null;

/***/ }),

/***/ 193:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ extend)
/* harmony export */ });
/* harmony import */ var _has_own_prop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(396);

function extend(a, b) {
  for (var i in b) {
    if ((0,_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(b, i)) {
      a[i] = b[i];
    }
  }
  if ((0,_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(b, 'toString')) {
    a.toString = b.toString;
  }
  if ((0,_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(b, 'valueOf')) {
    a.valueOf = b.valueOf;
  }
  return a;
}

/***/ }),

/***/ 396:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ hasOwnProp)
/* harmony export */ });
function hasOwnProp(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}

/***/ }),

/***/ 581:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ hooks),
/* harmony export */   j: () => (/* binding */ setHookCallback)
/* harmony export */ });

var hookCallback;
function hooks() {
  return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback(callback) {
  hookCallback = callback;
}

/***/ }),

/***/ 219:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ indexOf)
/* harmony export */ });
var indexOf;
if (Array.prototype.indexOf) {
  indexOf = Array.prototype.indexOf;
} else {
  indexOf = function (o) {
    // I know
    var i;
    for (i = 0; i < this.length; ++i) {
      if (this[i] === o) {
        return i;
      }
    }
    return -1;
  };
}


/***/ }),

/***/ 261:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isArray)
/* harmony export */ });
function isArray(input) {
  return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

/***/ }),

/***/ 238:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isDate)
/* harmony export */ });
function isDate(input) {
  return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

/***/ }),

/***/ 654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isFunction)
/* harmony export */ });
function isFunction(input) {
  return typeof Function !== 'undefined' && input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

/***/ }),

/***/ 432:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ isLeapYear)
/* harmony export */ });
function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}

/***/ }),

/***/ 523:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isNumber)
/* harmony export */ });
function isNumber(input) {
  return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

/***/ }),

/***/ 133:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isObjectEmpty)
/* harmony export */ });
/* harmony import */ var _has_own_prop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(396);

function isObjectEmpty(obj) {
  if (Object.getOwnPropertyNames) {
    return Object.getOwnPropertyNames(obj).length === 0;
  } else {
    var k;
    for (k in obj) {
      if ((0,_has_own_prop__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(obj, k)) {
        return false;
      }
    }
    return true;
  }
}

/***/ }),

/***/ 945:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isObject)
/* harmony export */ });
function isObject(input) {
  // IE8 will treat undefined and null as object if it wasn't for
  // input != null
  return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

/***/ }),

/***/ 420:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ isUndefined)
/* harmony export */ });
function isUndefined(input) {
  return input === void 0;
}

/***/ }),

/***/ 596:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ toInt)
/* harmony export */ });
/* harmony import */ var _abs_floor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(938);

function toInt(argumentForCoercion) {
  var coercedNumber = +argumentForCoercion,
    value = 0;
  if (coercedNumber !== 0 && isFinite(coercedNumber)) {
    value = (0,_abs_floor__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)(coercedNumber);
  }
  return value;
}

/***/ }),

/***/ 825:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ zeroFill)
/* harmony export */ });
function zeroFill(number, targetLength, forceSign) {
  var absNumber = '' + Math.abs(number),
    zerosToFill = targetLength - absNumber.length,
    sign = number >= 0;
  return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ moment)
});

// EXTERNAL MODULE: ./src/lib/utils/hooks.js
var hooks = __webpack_require__(581);
// EXTERNAL MODULE: ./src/lib/create/local.js
var local = __webpack_require__(671);
// EXTERNAL MODULE: ./src/lib/create/utc.js
var create_utc = __webpack_require__(990);
// EXTERNAL MODULE: ./src/lib/create/valid.js + 1 modules
var valid = __webpack_require__(794);
// EXTERNAL MODULE: ./src/lib/moment/constructor.js
var moment_constructor = __webpack_require__(916);
// EXTERNAL MODULE: ./src/lib/utils/deprecate.js
var deprecate = __webpack_require__(182);
// EXTERNAL MODULE: ./src/lib/utils/is-array.js
var is_array = __webpack_require__(261);
;// CONCATENATED MODULE: ./src/lib/moment/min-max.js




var prototypeMin = (0,deprecate/* deprecate */.C)('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
    var other = local/* createLocal */.o.apply(null, arguments);
    if (this.isValid() && other.isValid()) {
      return other < this ? this : other;
    } else {
      return (0,valid/* createInvalid */.q)();
    }
  }),
  prototypeMax = (0,deprecate/* deprecate */.C)('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
    var other = local/* createLocal */.o.apply(null, arguments);
    if (this.isValid() && other.isValid()) {
      return other > this ? this : other;
    } else {
      return (0,valid/* createInvalid */.q)();
    }
  });

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
  var res, i;
  if (moments.length === 1 && (0,is_array/* default */.A)(moments[0])) {
    moments = moments[0];
  }
  if (!moments.length) {
    return (0,local/* createLocal */.o)();
  }
  res = moments[0];
  for (i = 1; i < moments.length; ++i) {
    if (!moments[i].isValid() || moments[i][fn](res)) {
      res = moments[i];
    }
  }
  return res;
}

// TODO: Use [].sort instead?
function min() {
  var args = [].slice.call(arguments, 0);
  return pickBy('isBefore', args);
}
function max() {
  var args = [].slice.call(arguments, 0);
  return pickBy('isAfter', args);
}
;// CONCATENATED MODULE: ./src/lib/moment/now.js
var now = function () {
  return Date.now ? Date.now() : +new Date();
};
// EXTERNAL MODULE: ./src/lib/moment/get-set.js + 1 modules
var get_set = __webpack_require__(197);
// EXTERNAL MODULE: ./src/lib/units/month.js + 1 modules
var month = __webpack_require__(942);
// EXTERNAL MODULE: ./src/lib/units/aliases.js
var aliases = __webpack_require__(155);
// EXTERNAL MODULE: ./src/lib/locale/locales.js + 2 modules
var locales = __webpack_require__(35);
// EXTERNAL MODULE: ./src/lib/utils/has-own-prop.js
var has_own_prop = __webpack_require__(396);
// EXTERNAL MODULE: ./src/lib/utils/to-int.js
var to_int = __webpack_require__(596);
// EXTERNAL MODULE: ./src/lib/utils/index-of.js
var index_of = __webpack_require__(219);
;// CONCATENATED MODULE: ./src/lib/duration/valid.js




var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];
function isDurationValid(m) {
  var key,
    unitHasDecimal = false,
    i,
    orderLen = ordering.length;
  for (key in m) {
    if ((0,has_own_prop/* default */.A)(m, key) && !(index_of/* default */.A.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
      return false;
    }
  }
  for (i = 0; i < orderLen; ++i) {
    if (m[ordering[i]]) {
      if (unitHasDecimal) {
        return false; // only allow non-integers for smallest unit
      }
      if (parseFloat(m[ordering[i]]) !== (0,to_int/* default */.A)(m[ordering[i]])) {
        unitHasDecimal = true;
      }
    }
  }
  return true;
}
function isValid() {
  return this._isValid;
}
function createInvalid() {
  return createDuration(NaN);
}
;// CONCATENATED MODULE: ./src/lib/duration/constructor.js



function Duration(duration) {
  var normalizedInput = (0,aliases/* normalizeObjectUnits */.M)(duration),
    years = normalizedInput.year || 0,
    quarters = normalizedInput.quarter || 0,
    months = normalizedInput.month || 0,
    weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
    days = normalizedInput.day || 0,
    hours = normalizedInput.hour || 0,
    minutes = normalizedInput.minute || 0,
    seconds = normalizedInput.second || 0,
    milliseconds = normalizedInput.millisecond || 0;
  this._isValid = isDurationValid(normalizedInput);

  // representation for dateAddRemove
  this._milliseconds = +milliseconds + seconds * 1e3 +
  // 1000
  minutes * 6e4 +
  // 1000 * 60
  hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
  // Because of dateAddRemove treats 24 hours as different from a
  // day when working around DST, we need to store them separately
  this._days = +days + weeks * 7;
  // It is impossible to translate months into days without knowing
  // which months you are are talking about, so we have to store
  // it separately.
  this._months = +months + quarters * 3 + years * 12;
  this._data = {};
  this._locale = (0,locales/* getLocale */.JK)();
  this._bubble();
}
function isDuration(obj) {
  return obj instanceof Duration;
}
// EXTERNAL MODULE: ./src/lib/utils/is-number.js
var is_number = __webpack_require__(523);
;// CONCATENATED MODULE: ./src/lib/utils/abs-round.js
function absRound(number) {
  if (number < 0) {
    return Math.round(-1 * number) * -1;
  } else {
    return Math.round(number);
  }
}
// EXTERNAL MODULE: ./src/lib/units/constants.js
var constants = __webpack_require__(282);
// EXTERNAL MODULE: ./src/lib/utils/zero-fill.js
var zero_fill = __webpack_require__(825);
// EXTERNAL MODULE: ./src/lib/format/format.js
var format = __webpack_require__(592);
// EXTERNAL MODULE: ./src/lib/parse/regex.js
var regex = __webpack_require__(560);
// EXTERNAL MODULE: ./src/lib/parse/token.js
var token = __webpack_require__(218);
// EXTERNAL MODULE: ./src/lib/create/from-anything.js + 8 modules
var from_anything = __webpack_require__(950);
// EXTERNAL MODULE: ./src/lib/utils/is-date.js
var is_date = __webpack_require__(238);
// EXTERNAL MODULE: ./src/lib/utils/is-undefined.js
var is_undefined = __webpack_require__(420);
;// CONCATENATED MODULE: ./src/lib/utils/compare-arrays.js


// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
  var len = Math.min(array1.length, array2.length),
    lengthDiff = Math.abs(array1.length - array2.length),
    diffs = 0,
    i;
  for (i = 0; i < len; i++) {
    if (dontConvert && array1[i] !== array2[i] || !dontConvert && (0,to_int/* default */.A)(array1[i]) !== (0,to_int/* default */.A)(array2[i])) {
      diffs++;
    }
  }
  return diffs + lengthDiff;
}
;// CONCATENATED MODULE: ./src/lib/units/offset.js
















// FORMATTING

function offset(token, separator) {
  (0,format/* addFormatToken */.Se)(token, 0, 0, function () {
    var offset = this.utcOffset(),
      sign = '+';
    if (offset < 0) {
      offset = -offset;
      sign = '-';
    }
    return sign + (0,zero_fill/* default */.A)(~~(offset / 60), 2) + separator + (0,zero_fill/* default */.A)(~~offset % 60, 2);
  });
}
offset('Z', ':');
offset('ZZ', '');

// PARSING

(0,regex/* addRegexToken */.uk)('Z', regex/* matchShortOffset */.ZX);
(0,regex/* addRegexToken */.uk)('ZZ', regex/* matchShortOffset */.ZX);
(0,token/* addParseToken */.Y1)(['Z', 'ZZ'], function (input, array, config) {
  config._useUTC = true;
  config._tzm = offsetFromString(regex/* matchShortOffset */.ZX, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;
function offsetFromString(matcher, string) {
  var matches = (string || '').match(matcher),
    chunk,
    parts,
    minutes;
  if (matches === null) {
    return null;
  }
  chunk = matches[matches.length - 1] || [];
  parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
  minutes = +(parts[1] * 60) + (0,to_int/* default */.A)(parts[2]);
  return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
  var res, diff;
  if (model._isUTC) {
    res = model.clone();
    diff = ((0,moment_constructor/* isMoment */.t_)(input) || (0,is_date/* default */.A)(input) ? input.valueOf() : (0,local/* createLocal */.o)(input).valueOf()) - res.valueOf();
    // Use low-level api, because this fn is low-level api.
    res._d.setTime(res._d.valueOf() + diff);
    hooks/* hooks */.J.updateOffset(res, false);
    return res;
  } else {
    return (0,local/* createLocal */.o)(input).local();
  }
}
function getDateOffset(m) {
  // On Firefox.24 Date#getTimezoneOffset returns a floating point.
  // https://github.com/moment/moment/pull/1871
  return -Math.round(m._d.getTimezoneOffset());
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks/* hooks */.J.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset(input, keepLocalTime, keepMinutes) {
  var offset = this._offset || 0,
    localAdjust;
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }
  if (input != null) {
    if (typeof input === 'string') {
      input = offsetFromString(regex/* matchShortOffset */.ZX, input);
      if (input === null) {
        return this;
      }
    } else if (Math.abs(input) < 16 && !keepMinutes) {
      input = input * 60;
    }
    if (!this._isUTC && keepLocalTime) {
      localAdjust = getDateOffset(this);
    }
    this._offset = input;
    this._isUTC = true;
    if (localAdjust != null) {
      this.add(localAdjust, 'm');
    }
    if (offset !== input) {
      if (!keepLocalTime || this._changeInProgress) {
        addSubtract(this, createDuration(input - offset, 'm'), 1, false);
      } else if (!this._changeInProgress) {
        this._changeInProgress = true;
        hooks/* hooks */.J.updateOffset(this, true);
        this._changeInProgress = null;
      }
    }
    return this;
  } else {
    return this._isUTC ? offset : getDateOffset(this);
  }
}
function getSetZone(input, keepLocalTime) {
  if (input != null) {
    if (typeof input !== 'string') {
      input = -input;
    }
    this.utcOffset(input, keepLocalTime);
    return this;
  } else {
    return -this.utcOffset();
  }
}
function setOffsetToUTC(keepLocalTime) {
  return this.utcOffset(0, keepLocalTime);
}
function setOffsetToLocal(keepLocalTime) {
  if (this._isUTC) {
    this.utcOffset(0, keepLocalTime);
    this._isUTC = false;
    if (keepLocalTime) {
      this.subtract(getDateOffset(this), 'm');
    }
  }
  return this;
}
function setOffsetToParsedOffset() {
  if (this._tzm != null) {
    this.utcOffset(this._tzm, false, true);
  } else if (typeof this._i === 'string') {
    var tZone = offsetFromString(regex/* matchOffset */.Z, this._i);
    if (tZone != null) {
      this.utcOffset(tZone);
    } else {
      this.utcOffset(0, true);
    }
  }
  return this;
}
function hasAlignedHourOffset(input) {
  if (!this.isValid()) {
    return false;
  }
  input = input ? (0,local/* createLocal */.o)(input).utcOffset() : 0;
  return (this.utcOffset() - input) % 60 === 0;
}
function isDaylightSavingTime() {
  return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
}
function isDaylightSavingTimeShifted() {
  if (!(0,is_undefined/* default */.A)(this._isDSTShifted)) {
    return this._isDSTShifted;
  }
  var c = {},
    other;
  (0,moment_constructor/* copyConfig */.om)(c, this);
  c = (0,from_anything/* prepareConfig */.E)(c);
  if (c._a) {
    other = c._isUTC ? (0,create_utc/* createUTC */.X)(c._a) : (0,local/* createLocal */.o)(c._a);
    this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
  } else {
    this._isDSTShifted = false;
  }
  return this._isDSTShifted;
}
function isLocal() {
  return this.isValid() ? !this._isUTC : false;
}
function isUtcOffset() {
  return this.isValid() ? this._isUTC : false;
}
function isUtc() {
  return this.isValid() ? this._isUTC && this._offset === 0 : false;
}
;// CONCATENATED MODULE: ./src/lib/duration/create.js










// ASP.NET json date format regex
var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
  // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
  // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
  // and further modified to allow for strings containing both week and day
  isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
function createDuration(input, key) {
  var duration = input,
    // matching against regexp is expensive, do it on demand
    match = null,
    sign,
    ret,
    diffRes;
  if (isDuration(input)) {
    duration = {
      ms: input._milliseconds,
      d: input._days,
      M: input._months
    };
  } else if ((0,is_number/* default */.A)(input) || !isNaN(+input)) {
    duration = {};
    if (key) {
      duration[key] = +input;
    } else {
      duration.milliseconds = +input;
    }
  } else if (match = aspNetRegex.exec(input)) {
    sign = match[1] === '-' ? -1 : 1;
    duration = {
      y: 0,
      d: (0,to_int/* default */.A)(match[constants/* DATE */.vH]) * sign,
      h: (0,to_int/* default */.A)(match[constants/* HOUR */.dp]) * sign,
      m: (0,to_int/* default */.A)(match[constants/* MINUTE */.pY]) * sign,
      s: (0,to_int/* default */.A)(match[constants/* SECOND */.Z2]) * sign,
      ms: (0,to_int/* default */.A)(absRound(match[constants/* MILLISECOND */.oG] * 1000)) * sign // the millisecond decimal point is included in the match
    };
  } else if (match = isoRegex.exec(input)) {
    sign = match[1] === '-' ? -1 : 1;
    duration = {
      y: parseIso(match[2], sign),
      M: parseIso(match[3], sign),
      w: parseIso(match[4], sign),
      d: parseIso(match[5], sign),
      h: parseIso(match[6], sign),
      m: parseIso(match[7], sign),
      s: parseIso(match[8], sign)
    };
  } else if (duration == null) {
    // checks for null or undefined
    duration = {};
  } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
    diffRes = momentsDifference((0,local/* createLocal */.o)(duration.from), (0,local/* createLocal */.o)(duration.to));
    duration = {};
    duration.ms = diffRes.milliseconds;
    duration.M = diffRes.months;
  }
  ret = new Duration(duration);
  if (isDuration(input) && (0,has_own_prop/* default */.A)(input, '_locale')) {
    ret._locale = input._locale;
  }
  if (isDuration(input) && (0,has_own_prop/* default */.A)(input, '_isValid')) {
    ret._isValid = input._isValid;
  }
  return ret;
}
createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid;
function parseIso(inp, sign) {
  // We'd normally use ~~inp for this, but unfortunately it also
  // converts floats to ints.
  // inp may be undefined, so careful calling replace on it.
  var res = inp && parseFloat(inp.replace(',', '.'));
  // apply sign while we're at it
  return (isNaN(res) ? 0 : res) * sign;
}
function positiveMomentsDifference(base, other) {
  var res = {};
  res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
  if (base.clone().add(res.months, 'M').isAfter(other)) {
    --res.months;
  }
  res.milliseconds = +other - +base.clone().add(res.months, 'M');
  return res;
}
function momentsDifference(base, other) {
  var res;
  if (!(base.isValid() && other.isValid())) {
    return {
      milliseconds: 0,
      months: 0
    };
  }
  other = cloneWithOffset(other, base);
  if (base.isBefore(other)) {
    res = positiveMomentsDifference(base, other);
  } else {
    res = positiveMomentsDifference(other, base);
    res.milliseconds = -res.milliseconds;
    res.months = -res.months;
  }
  return res;
}
;// CONCATENATED MODULE: ./src/lib/moment/add-subtract.js







// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
  return function (val, period) {
    var dur, tmp;
    //invert the arguments, but complain about it
    if (period !== null && !isNaN(+period)) {
      (0,deprecate/* deprecateSimple */.e)(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
      tmp = val;
      val = period;
      period = tmp;
    }
    dur = createDuration(val, period);
    addSubtract(this, dur, direction);
    return this;
  };
}
function addSubtract(mom, duration, isAdding, updateOffset) {
  var milliseconds = duration._milliseconds,
    days = absRound(duration._days),
    months = absRound(duration._months);
  if (!mom.isValid()) {
    // No op
    return;
  }
  updateOffset = updateOffset == null ? true : updateOffset;
  if (months) {
    (0,month/* setMonth */.ZJ)(mom, (0,get_set/* get */.Jt)(mom, 'Month') + months * isAdding);
  }
  if (days) {
    (0,get_set/* set */.hZ)(mom, 'Date', (0,get_set/* get */.Jt)(mom, 'Date') + days * isAdding);
  }
  if (milliseconds) {
    mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
  }
  if (updateOffset) {
    hooks/* hooks */.J.updateOffset(mom, days || months);
  }
}
var add = createAdder(1, 'add'),
  subtract = createAdder(-1, 'subtract');
// EXTERNAL MODULE: ./src/lib/utils/is-function.js
var is_function = __webpack_require__(654);
// EXTERNAL MODULE: ./src/lib/utils/is-object-empty.js
var is_object_empty = __webpack_require__(133);
// EXTERNAL MODULE: ./src/lib/utils/is-object.js
var is_object = __webpack_require__(945);
;// CONCATENATED MODULE: ./src/lib/utils/is-string.js
function isString(input) {
  return typeof input === 'string' || input instanceof String;
}
;// CONCATENATED MODULE: ./src/lib/utils/is-moment-input.js









// type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
function isMomentInput(input) {
  return (0,moment_constructor/* isMoment */.t_)(input) || (0,is_date/* default */.A)(input) || isString(input) || (0,is_number/* default */.A)(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === undefined;
}
function isMomentInputObject(input) {
  var objectTest = (0,is_object/* default */.A)(input) && !(0,is_object_empty/* default */.A)(input),
    propertyTest = false,
    properties = ['years', 'year', 'y', 'months', 'month', 'M', 'days', 'day', 'd', 'dates', 'date', 'D', 'hours', 'hour', 'h', 'minutes', 'minute', 'm', 'seconds', 'second', 's', 'milliseconds', 'millisecond', 'ms'],
    i,
    property,
    propertyLen = properties.length;
  for (i = 0; i < propertyLen; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || (0,has_own_prop/* default */.A)(input, property);
  }
  return objectTest && propertyTest;
}
function isNumberOrStringArray(input) {
  var arrayTest = (0,is_array/* default */.A)(input),
    dataTypeTest = false;
  if (arrayTest) {
    dataTypeTest = input.filter(function (item) {
      return !(0,is_number/* default */.A)(item) && isString(input);
    }).length === 0;
  }
  return arrayTest && dataTypeTest;
}
;// CONCATENATED MODULE: ./src/lib/utils/is-calendar-spec.js



function isCalendarSpec(input) {
  var objectTest = (0,is_object/* default */.A)(input) && !(0,is_object_empty/* default */.A)(input),
    propertyTest = false,
    properties = ['sameDay', 'nextDay', 'lastDay', 'nextWeek', 'lastWeek', 'sameElse'],
    i,
    property;
  for (i = 0; i < properties.length; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || (0,has_own_prop/* default */.A)(input, property);
  }
  return objectTest && propertyTest;
}
;// CONCATENATED MODULE: ./src/lib/moment/calendar.js






function getCalendarFormat(myMoment, now) {
  var diff = myMoment.diff(now, 'days', true);
  return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
}
function calendar(time, formats) {
  // Support for single parameter, formats only overload to the calendar function
  if (arguments.length === 1) {
    if (!arguments[0]) {
      time = undefined;
      formats = undefined;
    } else if (isMomentInput(arguments[0])) {
      time = arguments[0];
      formats = undefined;
    } else if (isCalendarSpec(arguments[0])) {
      formats = arguments[0];
      time = undefined;
    }
  }
  // We want to compare the start of today, vs this.
  // Getting start-of-today depends on whether we're local/utc/offset or not.
  var now = time || (0,local/* createLocal */.o)(),
    sod = cloneWithOffset(now, this).startOf('day'),
    format = hooks/* hooks */.J.calendarFormat(this, sod) || 'sameElse',
    output = formats && ((0,is_function/* default */.A)(formats[format]) ? formats[format].call(this, now) : formats[format]);
  return this.format(output || this.localeData().calendar(format, this, (0,local/* createLocal */.o)(now)));
}
;// CONCATENATED MODULE: ./src/lib/moment/clone.js

function clone() {
  return new moment_constructor/* Moment */["do"](this);
}
;// CONCATENATED MODULE: ./src/lib/moment/compare.js



function isAfter(input, units) {
  var localInput = (0,moment_constructor/* isMoment */.t_)(input) ? input : (0,local/* createLocal */.o)(input);
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = (0,aliases/* normalizeUnits */.F)(units) || 'millisecond';
  if (units === 'millisecond') {
    return this.valueOf() > localInput.valueOf();
  } else {
    return localInput.valueOf() < this.clone().startOf(units).valueOf();
  }
}
function isBefore(input, units) {
  var localInput = (0,moment_constructor/* isMoment */.t_)(input) ? input : (0,local/* createLocal */.o)(input);
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = (0,aliases/* normalizeUnits */.F)(units) || 'millisecond';
  if (units === 'millisecond') {
    return this.valueOf() < localInput.valueOf();
  } else {
    return this.clone().endOf(units).valueOf() < localInput.valueOf();
  }
}
function isBetween(from, to, units, inclusivity) {
  var localFrom = (0,moment_constructor/* isMoment */.t_)(from) ? from : (0,local/* createLocal */.o)(from),
    localTo = (0,moment_constructor/* isMoment */.t_)(to) ? to : (0,local/* createLocal */.o)(to);
  if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
    return false;
  }
  inclusivity = inclusivity || '()';
  return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
}
function isSame(input, units) {
  var localInput = (0,moment_constructor/* isMoment */.t_)(input) ? input : (0,local/* createLocal */.o)(input),
    inputMs;
  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }
  units = (0,aliases/* normalizeUnits */.F)(units) || 'millisecond';
  if (units === 'millisecond') {
    return this.valueOf() === localInput.valueOf();
  } else {
    inputMs = localInput.valueOf();
    return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
  }
}
function isSameOrAfter(input, units) {
  return this.isSame(input, units) || this.isAfter(input, units);
}
function isSameOrBefore(input, units) {
  return this.isSame(input, units) || this.isBefore(input, units);
}
// EXTERNAL MODULE: ./src/lib/utils/abs-floor.js
var abs_floor = __webpack_require__(938);
;// CONCATENATED MODULE: ./src/lib/moment/diff.js



function diff(input, units, asFloat) {
  var that, zoneDelta, output;
  if (!this.isValid()) {
    return NaN;
  }
  that = cloneWithOffset(input, this);
  if (!that.isValid()) {
    return NaN;
  }
  zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
  units = (0,aliases/* normalizeUnits */.F)(units);
  switch (units) {
    case 'year':
      output = monthDiff(this, that) / 12;
      break;
    case 'month':
      output = monthDiff(this, that);
      break;
    case 'quarter':
      output = monthDiff(this, that) / 3;
      break;
    case 'second':
      output = (this - that) / 1e3;
      break;
    // 1000
    case 'minute':
      output = (this - that) / 6e4;
      break;
    // 1000 * 60
    case 'hour':
      output = (this - that) / 36e5;
      break;
    // 1000 * 60 * 60
    case 'day':
      output = (this - that - zoneDelta) / 864e5;
      break;
    // 1000 * 60 * 60 * 24, negate dst
    case 'week':
      output = (this - that - zoneDelta) / 6048e5;
      break;
    // 1000 * 60 * 60 * 24 * 7, negate dst
    default:
      output = this - that;
  }
  return asFloat ? output : (0,abs_floor/* default */.A)(output);
}
function monthDiff(a, b) {
  if (a.date() < b.date()) {
    // end-of-month calculations work correct when the start month has more
    // days than the end month.
    return -monthDiff(b, a);
  }
  // difference in months
  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
    // b is in (anchor - 1 month, anchor + 1 month)
    anchor = a.clone().add(wholeMonthDiff, 'months'),
    anchor2,
    adjust;
  if (b - anchor < 0) {
    anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
    // linear across the month
    adjust = (b - anchor) / (anchor - anchor2);
  } else {
    anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
    // linear across the month
    adjust = (b - anchor) / (anchor2 - anchor);
  }

  //check for negative zero, return zero if negative zero
  return -(wholeMonthDiff + adjust) || 0;
}
;// CONCATENATED MODULE: ./src/lib/moment/format.js



hooks/* hooks */.J.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks/* hooks */.J.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';
function format_toString() {
  return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}
function toISOString(keepOffset) {
  if (!this.isValid()) {
    return null;
  }
  var utc = keepOffset !== true,
    m = utc ? this.clone().utc() : this;
  if (m.year() < 0 || m.year() > 9999) {
    return (0,format/* formatMoment */.K9)(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
  }
  if ((0,is_function/* default */.A)(Date.prototype.toISOString)) {
    // native implementation is ~50x faster, use it when we can
    if (utc) {
      return this.toDate().toISOString();
    } else {
      return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', (0,format/* formatMoment */.K9)(m, 'Z'));
    }
  }
  return (0,format/* formatMoment */.K9)(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect() {
  if (!this.isValid()) {
    return 'moment.invalid(/* ' + this._i + ' */)';
  }
  var func = 'moment',
    zone = '',
    prefix,
    year,
    datetime,
    suffix;
  if (!this.isLocal()) {
    func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
    zone = 'Z';
  }
  prefix = '[' + func + '("]';
  year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
  datetime = '-MM-DD[T]HH:mm:ss.SSS';
  suffix = zone + '[")]';
  return this.format(prefix + year + datetime + suffix);
}
function format_format(inputString) {
  if (!inputString) {
    inputString = this.isUtc() ? hooks/* hooks */.J.defaultFormatUtc : hooks/* hooks */.J.defaultFormat;
  }
  var output = (0,format/* formatMoment */.K9)(this, inputString);
  return this.localeData().postformat(output);
}
;// CONCATENATED MODULE: ./src/lib/moment/from.js



function from(time, withoutSuffix) {
  if (this.isValid() && ((0,moment_constructor/* isMoment */.t_)(time) && time.isValid() || (0,local/* createLocal */.o)(time).isValid())) {
    return createDuration({
      to: this,
      from: time
    }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}
function fromNow(withoutSuffix) {
  return this.from((0,local/* createLocal */.o)(), withoutSuffix);
}
;// CONCATENATED MODULE: ./src/lib/moment/to.js



function to(time, withoutSuffix) {
  if (this.isValid() && ((0,moment_constructor/* isMoment */.t_)(time) && time.isValid() || (0,local/* createLocal */.o)(time).isValid())) {
    return createDuration({
      from: this,
      to: time
    }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}
function toNow(withoutSuffix) {
  return this.to((0,local/* createLocal */.o)(), withoutSuffix);
}
;// CONCATENATED MODULE: ./src/lib/moment/locale.js



// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale(key) {
  var newLocaleData;
  if (key === undefined) {
    return this._locale._abbr;
  } else {
    newLocaleData = (0,locales/* getLocale */.JK)(key);
    if (newLocaleData != null) {
      this._locale = newLocaleData;
    }
    return this;
  }
}
var lang = (0,deprecate/* deprecate */.C)('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
  if (key === undefined) {
    return this.localeData();
  } else {
    return this.locale(key);
  }
});
function localeData() {
  return this._locale;
}
;// CONCATENATED MODULE: ./src/lib/moment/start-end-of.js


var MS_PER_SECOND = 1000,
  MS_PER_MINUTE = 60 * MS_PER_SECOND,
  MS_PER_HOUR = 60 * MS_PER_MINUTE,
  MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

// actual modulo - handles negative numbers (for dates before 1970):
function mod(dividend, divisor) {
  return (dividend % divisor + divisor) % divisor;
}
function localStartOfDate(y, m, d) {
  // the date constructor remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    return new Date(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return new Date(y, m, d).valueOf();
  }
}
function utcStartOfDate(y, m, d) {
  // Date.UTC remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return Date.UTC(y, m, d);
  }
}
function startOf(units) {
  var time, startOfDate;
  units = (0,aliases/* normalizeUnits */.F)(units);
  if (units === undefined || units === 'millisecond' || !this.isValid()) {
    return this;
  }
  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
  switch (units) {
    case 'year':
      time = startOfDate(this.year(), 0, 1);
      break;
    case 'quarter':
      time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
      break;
    case 'month':
      time = startOfDate(this.year(), this.month(), 1);
      break;
    case 'week':
      time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
      break;
    case 'isoWeek':
      time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
      break;
    case 'day':
    case 'date':
      time = startOfDate(this.year(), this.month(), this.date());
      break;
    case 'hour':
      time = this._d.valueOf();
      time -= mod(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
      break;
    case 'minute':
      time = this._d.valueOf();
      time -= mod(time, MS_PER_MINUTE);
      break;
    case 'second':
      time = this._d.valueOf();
      time -= mod(time, MS_PER_SECOND);
      break;
  }
  this._d.setTime(time);
  hooks/* hooks */.J.updateOffset(this, true);
  return this;
}
function endOf(units) {
  var time, startOfDate;
  units = (0,aliases/* normalizeUnits */.F)(units);
  if (units === undefined || units === 'millisecond' || !this.isValid()) {
    return this;
  }
  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
  switch (units) {
    case 'year':
      time = startOfDate(this.year() + 1, 0, 1) - 1;
      break;
    case 'quarter':
      time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
      break;
    case 'month':
      time = startOfDate(this.year(), this.month() + 1, 1) - 1;
      break;
    case 'week':
      time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
      break;
    case 'isoWeek':
      time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
      break;
    case 'day':
    case 'date':
      time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
      break;
    case 'hour':
      time = this._d.valueOf();
      time += MS_PER_HOUR - mod(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
      break;
    case 'minute':
      time = this._d.valueOf();
      time += MS_PER_MINUTE - mod(time, MS_PER_MINUTE) - 1;
      break;
    case 'second':
      time = this._d.valueOf();
      time += MS_PER_SECOND - mod(time, MS_PER_SECOND) - 1;
      break;
  }
  this._d.setTime(time);
  hooks/* hooks */.J.updateOffset(this, true);
  return this;
}
;// CONCATENATED MODULE: ./src/lib/moment/to-type.js
function to_type_valueOf() {
  return this._d.valueOf() - (this._offset || 0) * 60000;
}
function unix() {
  return Math.floor(this.valueOf() / 1000);
}
function toDate() {
  return new Date(this.valueOf());
}
function toArray() {
  var m = this;
  return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}
function toObject() {
  var m = this;
  return {
    years: m.year(),
    months: m.month(),
    date: m.date(),
    hours: m.hours(),
    minutes: m.minutes(),
    seconds: m.seconds(),
    milliseconds: m.milliseconds()
  };
}
function toJSON() {
  // new Date(NaN).toJSON() === null
  return this.isValid() ? this.toISOString() : null;
}
// EXTERNAL MODULE: ./src/lib/utils/extend.js
var extend = __webpack_require__(193);
// EXTERNAL MODULE: ./src/lib/create/parsing-flags.js
var parsing_flags = __webpack_require__(810);
;// CONCATENATED MODULE: ./src/lib/moment/valid.js



function valid_isValid() {
  return (0,valid/* isValid */.f)(this);
}
function parsingFlags() {
  return (0,extend/* default */.A)({}, (0,parsing_flags/* default */.A)(this));
}
function invalidAt() {
  return (0,parsing_flags/* default */.A)(this).overflow;
}
;// CONCATENATED MODULE: ./src/lib/moment/creation-data.js
function creationData() {
  return {
    input: this._i,
    format: this._f,
    locale: this._locale,
    isUTC: this._isUTC,
    strict: this._strict
  };
}
;// CONCATENATED MODULE: ./src/lib/units/era.js








(0,format/* addFormatToken */.Se)('N', 0, 0, 'eraAbbr');
(0,format/* addFormatToken */.Se)('NN', 0, 0, 'eraAbbr');
(0,format/* addFormatToken */.Se)('NNN', 0, 0, 'eraAbbr');
(0,format/* addFormatToken */.Se)('NNNN', 0, 0, 'eraName');
(0,format/* addFormatToken */.Se)('NNNNN', 0, 0, 'eraNarrow');
(0,format/* addFormatToken */.Se)('y', ['y', 1], 'yo', 'eraYear');
(0,format/* addFormatToken */.Se)('y', ['yy', 2], 0, 'eraYear');
(0,format/* addFormatToken */.Se)('y', ['yyy', 3], 0, 'eraYear');
(0,format/* addFormatToken */.Se)('y', ['yyyy', 4], 0, 'eraYear');
(0,regex/* addRegexToken */.uk)('N', matchEraAbbr);
(0,regex/* addRegexToken */.uk)('NN', matchEraAbbr);
(0,regex/* addRegexToken */.uk)('NNN', matchEraAbbr);
(0,regex/* addRegexToken */.uk)('NNNN', matchEraName);
(0,regex/* addRegexToken */.uk)('NNNNN', matchEraNarrow);
(0,token/* addParseToken */.Y1)(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (input, array, config, token) {
  var era = config._locale.erasParse(input, token, config._strict);
  if (era) {
    (0,parsing_flags/* default */.A)(config).era = era;
  } else {
    (0,parsing_flags/* default */.A)(config).invalidEra = input;
  }
});
(0,regex/* addRegexToken */.uk)('y', regex/* matchUnsigned */.H1);
(0,regex/* addRegexToken */.uk)('yy', regex/* matchUnsigned */.H1);
(0,regex/* addRegexToken */.uk)('yyy', regex/* matchUnsigned */.H1);
(0,regex/* addRegexToken */.uk)('yyyy', regex/* matchUnsigned */.H1);
(0,regex/* addRegexToken */.uk)('yo', matchEraYearOrdinal);
(0,token/* addParseToken */.Y1)(['y', 'yy', 'yyy', 'yyyy'], constants/* YEAR */.UX);
(0,token/* addParseToken */.Y1)(['yo'], function (input, array, config, token) {
  var match;
  if (config._locale._eraYearOrdinalRegex) {
    match = input.match(config._locale._eraYearOrdinalRegex);
  }
  if (config._locale.eraYearOrdinalParse) {
    array[constants/* YEAR */.UX] = config._locale.eraYearOrdinalParse(input, match);
  } else {
    array[constants/* YEAR */.UX] = parseInt(input, 10);
  }
});
function localeEras(m, format) {
  var i,
    l,
    date,
    eras = this._eras || (0,locales/* getLocale */.JK)('en')._eras;
  for (i = 0, l = eras.length; i < l; ++i) {
    switch (typeof eras[i].since) {
      case 'string':
        // truncate time
        date = (0,hooks/* hooks */.J)(eras[i].since).startOf('day');
        eras[i].since = date.valueOf();
        break;
    }
    switch (typeof eras[i].until) {
      case 'undefined':
        eras[i].until = +Infinity;
        break;
      case 'string':
        // truncate time
        date = (0,hooks/* hooks */.J)(eras[i].until).startOf('day').valueOf();
        eras[i].until = date.valueOf();
        break;
    }
  }
  return eras;
}
function localeErasParse(eraName, format, strict) {
  var i,
    l,
    eras = this.eras(),
    name,
    abbr,
    narrow;
  eraName = eraName.toUpperCase();
  for (i = 0, l = eras.length; i < l; ++i) {
    name = eras[i].name.toUpperCase();
    abbr = eras[i].abbr.toUpperCase();
    narrow = eras[i].narrow.toUpperCase();
    if (strict) {
      switch (format) {
        case 'N':
        case 'NN':
        case 'NNN':
          if (abbr === eraName) {
            return eras[i];
          }
          break;
        case 'NNNN':
          if (name === eraName) {
            return eras[i];
          }
          break;
        case 'NNNNN':
          if (narrow === eraName) {
            return eras[i];
          }
          break;
      }
    } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
      return eras[i];
    }
  }
}
function localeErasConvertYear(era, year) {
  var dir = era.since <= era.until ? +1 : -1;
  if (year === undefined) {
    return (0,hooks/* hooks */.J)(era.since).year();
  } else {
    return (0,hooks/* hooks */.J)(era.since).year() + (year - era.offset) * dir;
  }
}
function getEraName() {
  var i,
    l,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.clone().startOf('day').valueOf();
    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].name;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].name;
    }
  }
  return '';
}
function getEraNarrow() {
  var i,
    l,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.clone().startOf('day').valueOf();
    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].narrow;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].narrow;
    }
  }
  return '';
}
function getEraAbbr() {
  var i,
    l,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.clone().startOf('day').valueOf();
    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].abbr;
    }
    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].abbr;
    }
  }
  return '';
}
function getEraYear() {
  var i,
    l,
    dir,
    val,
    eras = this.localeData().eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    dir = eras[i].since <= eras[i].until ? +1 : -1;

    // truncate time
    val = this.clone().startOf('day').valueOf();
    if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
      return (this.year() - (0,hooks/* hooks */.J)(eras[i].since).year()) * dir + eras[i].offset;
    }
  }
  return this.year();
}
function erasNameRegex(isStrict) {
  if (!(0,has_own_prop/* default */.A)(this, '_erasNameRegex')) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasNameRegex : this._erasRegex;
}
function erasAbbrRegex(isStrict) {
  if (!(0,has_own_prop/* default */.A)(this, '_erasAbbrRegex')) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasAbbrRegex : this._erasRegex;
}
function erasNarrowRegex(isStrict) {
  if (!(0,has_own_prop/* default */.A)(this, '_erasNarrowRegex')) {
    computeErasParse.call(this);
  }
  return isStrict ? this._erasNarrowRegex : this._erasRegex;
}
function matchEraAbbr(isStrict, locale) {
  return locale.erasAbbrRegex(isStrict);
}
function matchEraName(isStrict, locale) {
  return locale.erasNameRegex(isStrict);
}
function matchEraNarrow(isStrict, locale) {
  return locale.erasNarrowRegex(isStrict);
}
function matchEraYearOrdinal(isStrict, locale) {
  return locale._eraYearOrdinalRegex || regex/* matchUnsigned */.H1;
}
function computeErasParse() {
  var abbrPieces = [],
    namePieces = [],
    narrowPieces = [],
    mixedPieces = [],
    i,
    l,
    erasName,
    erasAbbr,
    erasNarrow,
    eras = this.eras();
  for (i = 0, l = eras.length; i < l; ++i) {
    erasName = (0,regex/* regexEscape */.vQ)(eras[i].name);
    erasAbbr = (0,regex/* regexEscape */.vQ)(eras[i].abbr);
    erasNarrow = (0,regex/* regexEscape */.vQ)(eras[i].narrow);
    namePieces.push(erasName);
    abbrPieces.push(erasAbbr);
    narrowPieces.push(erasNarrow);
    mixedPieces.push(erasName);
    mixedPieces.push(erasAbbr);
    mixedPieces.push(erasNarrow);
  }
  this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
  this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
  this._erasNarrowRegex = new RegExp('^(' + narrowPieces.join('|') + ')', 'i');
}
// EXTERNAL MODULE: ./src/lib/units/year.js
var year = __webpack_require__(502);
// EXTERNAL MODULE: ./src/lib/units/week-calendar-utils.js
var week_calendar_utils = __webpack_require__(294);
// EXTERNAL MODULE: ./src/lib/create/date-from-array.js
var date_from_array = __webpack_require__(239);
;// CONCATENATED MODULE: ./src/lib/units/week-year.js








// FORMATTING

(0,format/* addFormatToken */.Se)(0, ['gg', 2], 0, function () {
  return this.weekYear() % 100;
});
(0,format/* addFormatToken */.Se)(0, ['GG', 2], 0, function () {
  return this.isoWeekYear() % 100;
});
function addWeekYearFormatToken(token, getter) {
  (0,format/* addFormatToken */.Se)(0, [token, token.length], 0, getter);
}
addWeekYearFormatToken('gggg', 'weekYear');
addWeekYearFormatToken('ggggg', 'weekYear');
addWeekYearFormatToken('GGGG', 'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

// PARSING

(0,regex/* addRegexToken */.uk)('G', regex/* matchSigned */.uJ);
(0,regex/* addRegexToken */.uk)('g', regex/* matchSigned */.uJ);
(0,regex/* addRegexToken */.uk)('GG', regex/* match1to2 */.aH, regex/* match2 */.Uj);
(0,regex/* addRegexToken */.uk)('gg', regex/* match1to2 */.aH, regex/* match2 */.Uj);
(0,regex/* addRegexToken */.uk)('GGGG', regex/* match1to4 */.aW, regex/* match4 */.gA);
(0,regex/* addRegexToken */.uk)('gggg', regex/* match1to4 */.aW, regex/* match4 */.gA);
(0,regex/* addRegexToken */.uk)('GGGGG', regex/* match1to6 */.OF, regex/* match6 */.gV);
(0,regex/* addRegexToken */.uk)('ggggg', regex/* match1to6 */.OF, regex/* match6 */.gV);
(0,token/* addWeekParseToken */.qw)(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
  week[token.substr(0, 2)] = (0,to_int/* default */.A)(input);
});
(0,token/* addWeekParseToken */.qw)(['gg', 'GG'], function (input, week, config, token) {
  week[token] = hooks/* hooks */.J.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear(input) {
  return getSetWeekYearHelper.call(this, input, this.week(), this.weekday() + this.localeData()._week.dow, this.localeData()._week.dow, this.localeData()._week.doy);
}
function getSetISOWeekYear(input) {
  return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
}
function getISOWeeksInYear() {
  return (0,week_calendar_utils/* weeksInYear */.cB)(this.year(), 1, 4);
}
function getISOWeeksInISOWeekYear() {
  return (0,week_calendar_utils/* weeksInYear */.cB)(this.isoWeekYear(), 1, 4);
}
function getWeeksInYear() {
  var weekInfo = this.localeData()._week;
  return (0,week_calendar_utils/* weeksInYear */.cB)(this.year(), weekInfo.dow, weekInfo.doy);
}
function getWeeksInWeekYear() {
  var weekInfo = this.localeData()._week;
  return (0,week_calendar_utils/* weeksInYear */.cB)(this.weekYear(), weekInfo.dow, weekInfo.doy);
}
function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  var weeksTarget;
  if (input == null) {
    return (0,week_calendar_utils/* weekOfYear */.zR)(this, dow, doy).year;
  } else {
    weeksTarget = (0,week_calendar_utils/* weeksInYear */.cB)(input, dow, doy);
    if (week > weeksTarget) {
      week = weeksTarget;
    }
    return setWeekAll.call(this, input, week, weekday, dow, doy);
  }
}
function setWeekAll(weekYear, week, weekday, dow, doy) {
  var dayOfYearData = (0,week_calendar_utils/* dayOfYearFromWeeks */.ip)(weekYear, week, weekday, dow, doy),
    date = (0,date_from_array/* createUTCDate */.P)(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.date(date.getUTCDate());
  return this;
}
;// CONCATENATED MODULE: ./src/lib/units/quarter.js






// FORMATTING

(0,format/* addFormatToken */.Se)('Q', 0, 'Qo', 'quarter');

// PARSING

(0,regex/* addRegexToken */.uk)('Q', regex/* match1 */.$3);
(0,token/* addParseToken */.Y1)('Q', function (input, array) {
  array[constants/* MONTH */.Lp] = ((0,to_int/* default */.A)(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter(input) {
  return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}
// EXTERNAL MODULE: ./src/lib/units/week.js
var week = __webpack_require__(407);
;// CONCATENATED MODULE: ./src/lib/units/day-of-month.js







// FORMATTING

(0,format/* addFormatToken */.Se)('D', ['DD', 2], 'Do', 'date');

// PARSING

(0,regex/* addRegexToken */.uk)('D', regex/* match1to2 */.aH, regex/* match1to2NoLeadingZero */.P);
(0,regex/* addRegexToken */.uk)('DD', regex/* match1to2 */.aH, regex/* match2 */.Uj);
(0,regex/* addRegexToken */.uk)('Do', function (isStrict, locale) {
  // TODO: Remove "ordinalParse" fallback in next major release.
  return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
});
(0,token/* addParseToken */.Y1)(['D', 'DD'], constants/* DATE */.vH);
(0,token/* addParseToken */.Y1)('Do', function (input, array) {
  array[constants/* DATE */.vH] = (0,to_int/* default */.A)(input.match(regex/* match1to2 */.aH)[0]);
});

// MOMENTS

var getSetDayOfMonth = (0,get_set/* makeGetSet */.F9)('Date', true);
// EXTERNAL MODULE: ./src/lib/units/day-of-week.js
var day_of_week = __webpack_require__(928);
;// CONCATENATED MODULE: ./src/lib/units/day-of-year.js





// FORMATTING

(0,format/* addFormatToken */.Se)('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// PARSING

(0,regex/* addRegexToken */.uk)('DDD', regex/* match1to3 */.V4);
(0,regex/* addRegexToken */.uk)('DDDD', regex/* match3 */.NH);
(0,token/* addParseToken */.Y1)(['DDD', 'DDDD'], function (input, array, config) {
  config._dayOfYear = (0,to_int/* default */.A)(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear(input) {
  var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
  return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
}
// EXTERNAL MODULE: ./src/lib/units/hour.js
var hour = __webpack_require__(53);
;// CONCATENATED MODULE: ./src/lib/units/minute.js






// FORMATTING

(0,format/* addFormatToken */.Se)('m', ['mm', 2], 0, 'minute');

// PARSING

(0,regex/* addRegexToken */.uk)('m', regex/* match1to2 */.aH, regex/* match1to2HasZero */.MZ);
(0,regex/* addRegexToken */.uk)('mm', regex/* match1to2 */.aH, regex/* match2 */.Uj);
(0,token/* addParseToken */.Y1)(['m', 'mm'], constants/* MINUTE */.pY);

// MOMENTS

var getSetMinute = (0,get_set/* makeGetSet */.F9)('Minutes', false);
;// CONCATENATED MODULE: ./src/lib/units/second.js






// FORMATTING

(0,format/* addFormatToken */.Se)('s', ['ss', 2], 0, 'second');

// PARSING

(0,regex/* addRegexToken */.uk)('s', regex/* match1to2 */.aH, regex/* match1to2HasZero */.MZ);
(0,regex/* addRegexToken */.uk)('ss', regex/* match1to2 */.aH, regex/* match2 */.Uj);
(0,token/* addParseToken */.Y1)(['s', 'ss'], constants/* SECOND */.Z2);

// MOMENTS

var getSetSecond = (0,get_set/* makeGetSet */.F9)('Seconds', false);
;// CONCATENATED MODULE: ./src/lib/units/millisecond.js







// FORMATTING

(0,format/* addFormatToken */.Se)('S', 0, 0, function () {
  return ~~(this.millisecond() / 100);
});
(0,format/* addFormatToken */.Se)(0, ['SS', 2], 0, function () {
  return ~~(this.millisecond() / 10);
});
(0,format/* addFormatToken */.Se)(0, ['SSS', 3], 0, 'millisecond');
(0,format/* addFormatToken */.Se)(0, ['SSSS', 4], 0, function () {
  return this.millisecond() * 10;
});
(0,format/* addFormatToken */.Se)(0, ['SSSSS', 5], 0, function () {
  return this.millisecond() * 100;
});
(0,format/* addFormatToken */.Se)(0, ['SSSSSS', 6], 0, function () {
  return this.millisecond() * 1000;
});
(0,format/* addFormatToken */.Se)(0, ['SSSSSSS', 7], 0, function () {
  return this.millisecond() * 10000;
});
(0,format/* addFormatToken */.Se)(0, ['SSSSSSSS', 8], 0, function () {
  return this.millisecond() * 100000;
});
(0,format/* addFormatToken */.Se)(0, ['SSSSSSSSS', 9], 0, function () {
  return this.millisecond() * 1000000;
});

// PARSING

(0,regex/* addRegexToken */.uk)('S', regex/* match1to3 */.V4, regex/* match1 */.$3);
(0,regex/* addRegexToken */.uk)('SS', regex/* match1to3 */.V4, regex/* match2 */.Uj);
(0,regex/* addRegexToken */.uk)('SSS', regex/* match1to3 */.V4, regex/* match3 */.NH);
var millisecond_token, getSetMillisecond;
for (millisecond_token = 'SSSS'; millisecond_token.length <= 9; millisecond_token += 'S') {
  (0,regex/* addRegexToken */.uk)(millisecond_token, regex/* matchUnsigned */.H1);
}
function parseMs(input, array) {
  array[constants/* MILLISECOND */.oG] = (0,to_int/* default */.A)(('0.' + input) * 1000);
}
for (millisecond_token = 'S'; millisecond_token.length <= 9; millisecond_token += 'S') {
  (0,token/* addParseToken */.Y1)(millisecond_token, parseMs);
}
getSetMillisecond = (0,get_set/* makeGetSet */.F9)('Milliseconds', false);

;// CONCATENATED MODULE: ./src/lib/units/timezone.js


// FORMATTING

(0,format/* addFormatToken */.Se)('z', 0, 0, 'zoneAbbr');
(0,format/* addFormatToken */.Se)('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr() {
  return this._isUTC ? 'UTC' : '';
}
function getZoneName() {
  return this._isUTC ? 'Coordinated Universal Time' : '';
}
;// CONCATENATED MODULE: ./src/lib/moment/prototype.js

var proto = moment_constructor/* Moment */["do"].prototype;















proto.add = add;
proto.calendar = calendar;
proto.clone = clone;
proto.diff = diff;
proto.endOf = endOf;
proto.format = format_format;
proto.from = from;
proto.fromNow = fromNow;
proto.to = to;
proto.toNow = toNow;
proto.get = get_set/* stringGet */.IN;
proto.invalidAt = invalidAt;
proto.isAfter = isAfter;
proto.isBefore = isBefore;
proto.isBetween = isBetween;
proto.isSame = isSame;
proto.isSameOrAfter = isSameOrAfter;
proto.isSameOrBefore = isSameOrBefore;
proto.isValid = valid_isValid;
proto.lang = lang;
proto.locale = locale;
proto.localeData = localeData;
proto.max = prototypeMax;
proto.min = prototypeMin;
proto.parsingFlags = parsingFlags;
proto.set = get_set/* stringSet */.O4;
proto.startOf = startOf;
proto.subtract = subtract;
proto.toArray = toArray;
proto.toObject = toObject;
proto.toDate = toDate;
proto.toISOString = toISOString;
proto.inspect = inspect;
if (typeof Symbol !== 'undefined' && Symbol.for != null) {
  proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
    return 'Moment<' + this.format() + '>';
  };
}
proto.toJSON = toJSON;
proto.toString = format_toString;
proto.unix = unix;
proto.valueOf = to_type_valueOf;
proto.creationData = creationData;

// Era

proto.eraName = getEraName;
proto.eraNarrow = getEraNarrow;
proto.eraAbbr = getEraAbbr;
proto.eraYear = getEraYear;

// Year

proto.year = year/* getSetYear */.ue;
proto.isLeapYear = year/* getIsLeapYear */.cr;

// Week Year

proto.weekYear = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;

// Quarter

proto.quarter = proto.quarters = getSetQuarter;

// Month

proto.month = month/* getSetMonth */.Hr;
proto.daysInMonth = month/* getDaysInMonth */.PK;

// Week

proto.week = proto.weeks = week/* getSetWeek */.$V;
proto.isoWeek = proto.isoWeeks = week/* getSetISOWeek */.Wv;
proto.weeksInYear = getWeeksInYear;
proto.weeksInWeekYear = getWeeksInWeekYear;
proto.isoWeeksInYear = getISOWeeksInYear;
proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;

// Day



proto.date = getSetDayOfMonth;
proto.day = proto.days = day_of_week/* getSetDayOfWeek */.iE;
proto.weekday = day_of_week/* getSetLocaleDayOfWeek */.I_;
proto.isoWeekday = day_of_week/* getSetISODayOfWeek */.j1;
proto.dayOfYear = getSetDayOfYear;

// Hour

proto.hour = proto.hours = hour/* getSetHour */.r_;

// Minute

proto.minute = proto.minutes = getSetMinute;

// Second

proto.second = proto.seconds = getSetSecond;

// Millisecond

proto.millisecond = proto.milliseconds = getSetMillisecond;

// Offset

proto.utcOffset = getSetOffset;
proto.utc = setOffsetToUTC;
proto.local = setOffsetToLocal;
proto.parseZone = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST = isDaylightSavingTime;
proto.isLocal = isLocal;
proto.isUtcOffset = isUtcOffset;
proto.isUtc = isUtc;
proto.isUTC = isUtc;

// Timezone

proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;

// Deprecations

proto.dates = (0,deprecate/* deprecate */.C)('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = (0,deprecate/* deprecate */.C)('months accessor is deprecated. Use month instead', month/* getSetMonth */.Hr);
proto.years = (0,deprecate/* deprecate */.C)('years accessor is deprecated. Use year instead', year/* getSetYear */.ue);
proto.zone = (0,deprecate/* deprecate */.C)('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = (0,deprecate/* deprecate */.C)('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);
/* harmony default export */ const moment_prototype = (proto);
;// CONCATENATED MODULE: ./src/lib/moment/moment.js







function createUnix(input) {
  return (0,local/* createLocal */.o)(input * 1000);
}
function createInZone() {
  return local/* createLocal */.o.apply(null, arguments).parseZone();
}

// EXTERNAL MODULE: ./src/lib/locale/constructor.js
var locale_constructor = __webpack_require__(154);
// EXTERNAL MODULE: ./src/lib/locale/calendar.js
var locale_calendar = __webpack_require__(642);
// EXTERNAL MODULE: ./src/lib/locale/formats.js
var formats = __webpack_require__(910);
// EXTERNAL MODULE: ./src/lib/locale/invalid.js
var invalid = __webpack_require__(613);
// EXTERNAL MODULE: ./src/lib/locale/ordinal.js
var ordinal = __webpack_require__(255);
;// CONCATENATED MODULE: ./src/lib/locale/pre-post-format.js
function preParsePostFormat(string) {
  return string;
}
// EXTERNAL MODULE: ./src/lib/locale/relative.js
var relative = __webpack_require__(640);
// EXTERNAL MODULE: ./src/lib/locale/set.js
var set = __webpack_require__(418);
;// CONCATENATED MODULE: ./src/lib/locale/prototype.js

var prototype_proto = locale_constructor/* Locale */.h.prototype;







prototype_proto.calendar = locale_calendar/* calendar */.B;
prototype_proto.longDateFormat = formats/* longDateFormat */.g;
prototype_proto.invalidDate = invalid/* invalidDate */.S;
prototype_proto.ordinal = ordinal/* ordinal */.IE;
prototype_proto.preparse = preParsePostFormat;
prototype_proto.postformat = preParsePostFormat;
prototype_proto.relativeTime = relative/* relativeTime */.KW;
prototype_proto.pastFuture = relative/* pastFuture */.gE;
prototype_proto.set = set/* set */.h;

// Eras

prototype_proto.eras = localeEras;
prototype_proto.erasParse = localeErasParse;
prototype_proto.erasConvertYear = localeErasConvertYear;
prototype_proto.erasAbbrRegex = erasAbbrRegex;
prototype_proto.erasNameRegex = erasNameRegex;
prototype_proto.erasNarrowRegex = erasNarrowRegex;

// Month

prototype_proto.months = month/* localeMonths */.EB;
prototype_proto.monthsShort = month/* localeMonthsShort */.cw;
prototype_proto.monthsParse = month/* localeMonthsParse */.D4;
prototype_proto.monthsRegex = month/* monthsRegex */.Nq;
prototype_proto.monthsShortRegex = month/* monthsShortRegex */.vw;

// Week

prototype_proto.week = week/* localeWeek */.Rl;
prototype_proto.firstDayOfYear = week/* localeFirstDayOfYear */.rc;
prototype_proto.firstDayOfWeek = week/* localeFirstDayOfWeek */.Mw;

// Day of Week

prototype_proto.weekdays = day_of_week/* localeWeekdays */.q8;
prototype_proto.weekdaysMin = day_of_week/* localeWeekdaysMin */.q6;
prototype_proto.weekdaysShort = day_of_week/* localeWeekdaysShort */.Qo;
prototype_proto.weekdaysParse = day_of_week/* localeWeekdaysParse */.Fz;
prototype_proto.weekdaysRegex = day_of_week/* weekdaysRegex */.Jo;
prototype_proto.weekdaysShortRegex = day_of_week/* weekdaysShortRegex */.xB;
prototype_proto.weekdaysMinRegex = day_of_week/* weekdaysMinRegex */.NQ;

// Hours

prototype_proto.isPM = hour/* localeIsPM */.Ku;
prototype_proto.meridiem = hour/* localeMeridiem */.dK;
;// CONCATENATED MODULE: ./src/lib/locale/lists.js



function get(format, index, field, setter) {
  var locale = (0,locales/* getLocale */.JK)(),
    utc = (0,create_utc/* createUTC */.X)().set(setter, index);
  return locale[field](utc, format);
}
function listMonthsImpl(format, index, field) {
  if ((0,is_number/* default */.A)(format)) {
    index = format;
    format = undefined;
  }
  format = format || '';
  if (index != null) {
    return get(format, index, field, 'month');
  }
  var i,
    out = [];
  for (i = 0; i < 12; i++) {
    out[i] = get(format, i, field, 'month');
  }
  return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl(localeSorted, format, index, field) {
  if (typeof localeSorted === 'boolean') {
    if ((0,is_number/* default */.A)(format)) {
      index = format;
      format = undefined;
    }
    format = format || '';
  } else {
    format = localeSorted;
    index = format;
    localeSorted = false;
    if ((0,is_number/* default */.A)(format)) {
      index = format;
      format = undefined;
    }
    format = format || '';
  }
  var locale = (0,locales/* getLocale */.JK)(),
    shift = localeSorted ? locale._week.dow : 0,
    i,
    out = [];
  if (index != null) {
    return get(format, (index + shift) % 7, field, 'day');
  }
  for (i = 0; i < 7; i++) {
    out[i] = get(format, (i + shift) % 7, field, 'day');
  }
  return out;
}
function listMonths(format, index) {
  return listMonthsImpl(format, index, 'months');
}
function listMonthsShort(format, index) {
  return listMonthsImpl(format, index, 'monthsShort');
}
function listWeekdays(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}
function listWeekdaysShort(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}
function listWeekdaysMin(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}
;// CONCATENATED MODULE: ./src/lib/locale/en.js



(0,locales/* getSetGlobalLocale */.Sc)('en', {
  eras: [{
    since: '0001-01-01',
    until: +Infinity,
    offset: 1,
    name: 'Anno Domini',
    narrow: 'AD',
    abbr: 'AD'
  }, {
    since: '0000-12-31',
    until: -Infinity,
    offset: 1,
    name: 'Before Christ',
    narrow: 'BC',
    abbr: 'BC'
  }],
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function (number) {
    var b = number % 10,
      output = (0,to_int/* default */.A)(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  }
});
;// CONCATENATED MODULE: ./src/lib/locale/locale.js
// Side effect imports






hooks/* hooks */.J.lang = (0,deprecate/* deprecate */.C)('moment.lang is deprecated. Use moment.locale instead.', locales/* getSetGlobalLocale */.Sc);
hooks/* hooks */.J.langData = (0,deprecate/* deprecate */.C)('moment.langData is deprecated. Use moment.localeData instead.', locales/* getLocale */.JK);

;// CONCATENATED MODULE: ./src/lib/duration/abs.js
var mathAbs = Math.abs;
function abs() {
  var data = this._data;
  this._milliseconds = mathAbs(this._milliseconds);
  this._days = mathAbs(this._days);
  this._months = mathAbs(this._months);
  data.milliseconds = mathAbs(data.milliseconds);
  data.seconds = mathAbs(data.seconds);
  data.minutes = mathAbs(data.minutes);
  data.hours = mathAbs(data.hours);
  data.months = mathAbs(data.months);
  data.years = mathAbs(data.years);
  return this;
}
;// CONCATENATED MODULE: ./src/lib/duration/add-subtract.js

function add_subtract_addSubtract(duration, input, value, direction) {
  var other = createDuration(input, value);
  duration._milliseconds += direction * other._milliseconds;
  duration._days += direction * other._days;
  duration._months += direction * other._months;
  return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add_subtract_add(input, value) {
  return add_subtract_addSubtract(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function add_subtract_subtract(input, value) {
  return add_subtract_addSubtract(this, input, value, -1);
}
;// CONCATENATED MODULE: ./src/lib/utils/abs-ceil.js
function absCeil(number) {
  if (number < 0) {
    return Math.floor(number);
  } else {
    return Math.ceil(number);
  }
}
;// CONCATENATED MODULE: ./src/lib/duration/bubble.js


function bubble() {
  var milliseconds = this._milliseconds,
    days = this._days,
    months = this._months,
    data = this._data,
    seconds,
    minutes,
    hours,
    years,
    monthsFromDays;

  // if we have a mix of positive and negative values, bubble down first
  // check: https://github.com/moment/moment/issues/2166
  if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
    milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
    days = 0;
    months = 0;
  }

  // The following code bubbles up values, see the tests for
  // examples of what that means.
  data.milliseconds = milliseconds % 1000;
  seconds = (0,abs_floor/* default */.A)(milliseconds / 1000);
  data.seconds = seconds % 60;
  minutes = (0,abs_floor/* default */.A)(seconds / 60);
  data.minutes = minutes % 60;
  hours = (0,abs_floor/* default */.A)(minutes / 60);
  data.hours = hours % 24;
  days += (0,abs_floor/* default */.A)(hours / 24);

  // convert days to months
  monthsFromDays = (0,abs_floor/* default */.A)(daysToMonths(days));
  months += monthsFromDays;
  days -= absCeil(monthsToDays(monthsFromDays));

  // 12 months -> 1 year
  years = (0,abs_floor/* default */.A)(months / 12);
  months %= 12;
  data.days = days;
  data.months = months;
  data.years = years;
  return this;
}
function daysToMonths(days) {
  // 400 years have 146097 days (taking into account leap year rules)
  // 400 years have 12 months === 4800
  return days * 4800 / 146097;
}
function monthsToDays(months) {
  // the reverse of daysToMonths
  return months * 146097 / 4800;
}
;// CONCATENATED MODULE: ./src/lib/duration/as.js


function as(units) {
  if (!this.isValid()) {
    return NaN;
  }
  var days,
    months,
    milliseconds = this._milliseconds;
  units = (0,aliases/* normalizeUnits */.F)(units);
  if (units === 'month' || units === 'quarter' || units === 'year') {
    days = this._days + milliseconds / 864e5;
    months = this._months + daysToMonths(days);
    switch (units) {
      case 'month':
        return months;
      case 'quarter':
        return months / 3;
      case 'year':
        return months / 12;
    }
  } else {
    // handle milliseconds separately because of floating point math errors (issue #1867)
    days = this._days + Math.round(monthsToDays(this._months));
    switch (units) {
      case 'week':
        return days / 7 + milliseconds / 6048e5;
      case 'day':
        return days + milliseconds / 864e5;
      case 'hour':
        return days * 24 + milliseconds / 36e5;
      case 'minute':
        return days * 1440 + milliseconds / 6e4;
      case 'second':
        return days * 86400 + milliseconds / 1000;
      // Math.floor prevents floating point math errors here
      case 'millisecond':
        return Math.floor(days * 864e5) + milliseconds;
      default:
        throw new Error('Unknown unit ' + units);
    }
  }
}
function makeAs(alias) {
  return function () {
    return this.as(alias);
  };
}
var asMilliseconds = makeAs('ms'),
  asSeconds = makeAs('s'),
  asMinutes = makeAs('m'),
  asHours = makeAs('h'),
  asDays = makeAs('d'),
  asWeeks = makeAs('w'),
  asMonths = makeAs('M'),
  asQuarters = makeAs('Q'),
  asYears = makeAs('y'),
  as_valueOf = asMilliseconds;

;// CONCATENATED MODULE: ./src/lib/duration/clone.js

function clone_clone() {
  return createDuration(this);
}
;// CONCATENATED MODULE: ./src/lib/duration/get.js


function get_get(units) {
  units = (0,aliases/* normalizeUnits */.F)(units);
  return this.isValid() ? this[units + 's']() : NaN;
}
function makeGetter(name) {
  return function () {
    return this.isValid() ? this._data[name] : NaN;
  };
}
var milliseconds = makeGetter('milliseconds'),
  seconds = makeGetter('seconds'),
  minutes = makeGetter('minutes'),
  hours = makeGetter('hours'),
  days = makeGetter('days'),
  months = makeGetter('months'),
  years = makeGetter('years');

function weeks() {
  return (0,abs_floor/* default */.A)(this.days() / 7);
}
;// CONCATENATED MODULE: ./src/lib/duration/humanize.js

var round = Math.round,
  thresholds = {
    ss: 44,
    // a few seconds to seconds
    s: 45,
    // seconds to minute
    m: 45,
    // minutes to hour
    h: 22,
    // hours to day
    d: 26,
    // days to month/week
    w: null,
    // weeks to month
    M: 11 // months to year
  };

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
  return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}
function relativeTime(posNegDuration, withoutSuffix, thresholds, locale) {
  var duration = createDuration(posNegDuration).abs(),
    seconds = round(duration.as('s')),
    minutes = round(duration.as('m')),
    hours = round(duration.as('h')),
    days = round(duration.as('d')),
    months = round(duration.as('M')),
    weeks = round(duration.as('w')),
    years = round(duration.as('y')),
    a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days];
  if (thresholds.w != null) {
    a = a || weeks <= 1 && ['w'] || weeks < thresholds.w && ['ww', weeks];
  }
  a = a || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];
  a[2] = withoutSuffix;
  a[3] = +posNegDuration > 0;
  a[4] = locale;
  return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding(roundingFunction) {
  if (roundingFunction === undefined) {
    return round;
  }
  if (typeof roundingFunction === 'function') {
    round = roundingFunction;
    return true;
  }
  return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold(threshold, limit) {
  if (thresholds[threshold] === undefined) {
    return false;
  }
  if (limit === undefined) {
    return thresholds[threshold];
  }
  thresholds[threshold] = limit;
  if (threshold === 's') {
    thresholds.ss = limit - 1;
  }
  return true;
}
function humanize(argWithSuffix, argThresholds) {
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }
  var withSuffix = false,
    th = thresholds,
    locale,
    output;
  if (typeof argWithSuffix === 'object') {
    argThresholds = argWithSuffix;
    argWithSuffix = false;
  }
  if (typeof argWithSuffix === 'boolean') {
    withSuffix = argWithSuffix;
  }
  if (typeof argThresholds === 'object') {
    th = Object.assign({}, thresholds, argThresholds);
    if (argThresholds.s != null && argThresholds.ss == null) {
      th.ss = argThresholds.s - 1;
    }
  }
  locale = this.localeData();
  output = relativeTime(this, !withSuffix, th, locale);
  if (withSuffix) {
    output = locale.pastFuture(+this, output);
  }
  return locale.postformat(output);
}
;// CONCATENATED MODULE: ./src/lib/duration/iso-string.js

var iso_string_abs = Math.abs;
function sign(x) {
  return (x > 0) - (x < 0) || +x;
}
function iso_string_toISOString() {
  // for ISO strings we do not use the normal bubbling rules:
  //  * milliseconds bubble up until they become hours
  //  * days do not bubble at all
  //  * months bubble up until they become years
  // This is because there is no context-free conversion between hours and days
  // (think of clock changes)
  // and also not between days and months (28-31 days per month)
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }
  var seconds = iso_string_abs(this._milliseconds) / 1000,
    days = iso_string_abs(this._days),
    months = iso_string_abs(this._months),
    minutes,
    hours,
    years,
    s,
    total = this.asSeconds(),
    totalSign,
    ymSign,
    daysSign,
    hmsSign;
  if (!total) {
    // this is the same as C#'s (Noda) and python (isodate)...
    // but not other JS (goog.date)
    return 'P0D';
  }

  // 3600 seconds -> 60 minutes -> 1 hour
  minutes = (0,abs_floor/* default */.A)(seconds / 60);
  hours = (0,abs_floor/* default */.A)(minutes / 60);
  seconds %= 60;
  minutes %= 60;

  // 12 months -> 1 year
  years = (0,abs_floor/* default */.A)(months / 12);
  months %= 12;

  // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
  s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
  totalSign = total < 0 ? '-' : '';
  ymSign = sign(this._months) !== sign(total) ? '-' : '';
  daysSign = sign(this._days) !== sign(total) ? '-' : '';
  hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';
  return totalSign + 'P' + (years ? ymSign + years + 'Y' : '') + (months ? ymSign + months + 'M' : '') + (days ? daysSign + days + 'D' : '') + (hours || minutes || seconds ? 'T' : '') + (hours ? hmsSign + hours + 'H' : '') + (minutes ? hmsSign + minutes + 'M' : '') + (seconds ? hmsSign + s + 'S' : '');
}
;// CONCATENATED MODULE: ./src/lib/duration/prototype.js

var duration_prototype_proto = Duration.prototype;










duration_prototype_proto.isValid = isValid;
duration_prototype_proto.abs = abs;
duration_prototype_proto.add = add_subtract_add;
duration_prototype_proto.subtract = add_subtract_subtract;
duration_prototype_proto.as = as;
duration_prototype_proto.asMilliseconds = asMilliseconds;
duration_prototype_proto.asSeconds = asSeconds;
duration_prototype_proto.asMinutes = asMinutes;
duration_prototype_proto.asHours = asHours;
duration_prototype_proto.asDays = asDays;
duration_prototype_proto.asWeeks = asWeeks;
duration_prototype_proto.asMonths = asMonths;
duration_prototype_proto.asQuarters = asQuarters;
duration_prototype_proto.asYears = asYears;
duration_prototype_proto.valueOf = as_valueOf;
duration_prototype_proto._bubble = bubble;
duration_prototype_proto.clone = clone_clone;
duration_prototype_proto.get = get_get;
duration_prototype_proto.milliseconds = milliseconds;
duration_prototype_proto.seconds = seconds;
duration_prototype_proto.minutes = minutes;
duration_prototype_proto.hours = hours;
duration_prototype_proto.days = days;
duration_prototype_proto.weeks = weeks;
duration_prototype_proto.months = months;
duration_prototype_proto.years = years;
duration_prototype_proto.humanize = humanize;
duration_prototype_proto.toISOString = iso_string_toISOString;
duration_prototype_proto.toString = iso_string_toISOString;
duration_prototype_proto.toJSON = iso_string_toISOString;
duration_prototype_proto.locale = locale;
duration_prototype_proto.localeData = localeData;

// Deprecations

duration_prototype_proto.toIsoString = (0,deprecate/* deprecate */.C)('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string_toISOString);
duration_prototype_proto.lang = lang;
;// CONCATENATED MODULE: ./src/lib/duration/duration.js
// Side effect imports





;// CONCATENATED MODULE: ./src/lib/units/timestamp.js





// FORMATTING

(0,format/* addFormatToken */.Se)('X', 0, 0, 'unix');
(0,format/* addFormatToken */.Se)('x', 0, 0, 'valueOf');

// PARSING

(0,regex/* addRegexToken */.uk)('x', regex/* matchSigned */.uJ);
(0,regex/* addRegexToken */.uk)('X', regex/* matchTimestamp */.Ot);
(0,token/* addParseToken */.Y1)('X', function (input, array, config) {
  config._d = new Date(parseFloat(input) * 1000);
});
(0,token/* addParseToken */.Y1)('x', function (input, array, config) {
  config._d = new Date((0,to_int/* default */.A)(input));
});
;// CONCATENATED MODULE: ./src/lib/units/units.js
// Side effect imports

















;// CONCATENATED MODULE: ./src/moment.js
//! moment.js
//! version : 2.30.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com


hooks/* hooks */.J.version = '2.30.1';






(0,hooks/* setHookCallback */.j)(local/* createLocal */.o);
hooks/* hooks */.J.fn = moment_prototype;
hooks/* hooks */.J.min = min;
hooks/* hooks */.J.max = max;
hooks/* hooks */.J.now = now;
hooks/* hooks */.J.utc = create_utc/* createUTC */.X;
hooks/* hooks */.J.unix = createUnix;
hooks/* hooks */.J.months = listMonths;
hooks/* hooks */.J.isDate = is_date/* default */.A;
hooks/* hooks */.J.locale = locales/* getSetGlobalLocale */.Sc;
hooks/* hooks */.J.invalid = valid/* createInvalid */.q;
hooks/* hooks */.J.duration = createDuration;
hooks/* hooks */.J.isMoment = moment_constructor/* isMoment */.t_;
hooks/* hooks */.J.weekdays = listWeekdays;
hooks/* hooks */.J.parseZone = createInZone;
hooks/* hooks */.J.localeData = locales/* getLocale */.JK;
hooks/* hooks */.J.isDuration = isDuration;
hooks/* hooks */.J.monthsShort = listMonthsShort;
hooks/* hooks */.J.weekdaysMin = listWeekdaysMin;
hooks/* hooks */.J.defineLocale = locales/* defineLocale */.mO;
hooks/* hooks */.J.updateLocale = locales/* updateLocale */.cu;
hooks/* hooks */.J.locales = locales/* listLocales */.qi;
hooks/* hooks */.J.weekdaysShort = listWeekdaysShort;
hooks/* hooks */.J.normalizeUnits = aliases/* normalizeUnits */.F;
hooks/* hooks */.J.relativeTimeRounding = getSetRelativeTimeRounding;
hooks/* hooks */.J.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks/* hooks */.J.calendarFormat = getCalendarFormat;
hooks/* hooks */.J.prototype = moment_prototype;

// currently HTML5 input type only supports 24-hour formats
hooks/* hooks */.J.HTML5_FMT = {
  DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',
  // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',
  // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',
  // <input type="datetime-local" step="0.001" />
  DATE: 'YYYY-MM-DD',
  // <input type="date" />
  TIME: 'HH:mm',
  // <input type="time" />
  TIME_SECONDS: 'HH:mm:ss',
  // <input type="time" step="1" />
  TIME_MS: 'HH:mm:ss.SSS',
  // <input type="time" step="0.001" />
  WEEK: 'GGGG-[W]WW',
  // <input type="week" />
  MONTH: 'YYYY-MM' // <input type="month" />
};
/* harmony default export */ const moment = (hooks/* hooks */.J);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map