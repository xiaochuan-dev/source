var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/constant.js
var SECONDS_A_MINUTE = 60;
var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
var MILLISECONDS_A_SECOND = 1e3;
var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;
var MS = "millisecond";
var S = "second";
var MIN = "minute";
var H = "hour";
var D = "day";
var W = "week";
var M = "month";
var Q = "quarter";
var Y = "year";
var DATE = "date";
var FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
var INVALID_DATE_STRING = "Invalid Date";
var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

// src/locale/en.js
var en_default = {
  name: "en",
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
  ordinal: (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
  }
};

// src/utils.js
var padStart = (string, length, pad) => {
  const s = String(string);
  if (!s || s.length >= length) return string;
  return `${Array(length + 1 - s.length).join(pad)}${string}`;
};
var padZoneStr = (instance) => {
  const negMinutes = -instance.utcOffset();
  const minutes = Math.abs(negMinutes);
  const hourOffset = Math.floor(minutes / 60);
  const minuteOffset = minutes % 60;
  return `${negMinutes <= 0 ? "+" : "-"}${padStart(hourOffset, 2, "0")}:${padStart(minuteOffset, 2, "0")}`;
};
var monthDiff = (a, b) => {
  if (a.date() < b.date()) return -monthDiff(b, a);
  const wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
  const anchor = a.clone().add(wholeMonthDiff, M);
  const c = b - anchor < 0;
  const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
  return +(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)) || 0);
};
var absFloor = (n) => n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
var prettyUnit = (u2) => {
  const special = {
    M,
    y: Y,
    w: W,
    d: D,
    D: DATE,
    h: H,
    m: MIN,
    s: S,
    ms: MS,
    Q
  };
  return special[u2] || String(u2 || "").toLowerCase().replace(/s$/, "");
};
var isUndefined = (s) => s === void 0;
var utils_default = {
  s: padStart,
  z: padZoneStr,
  m: monthDiff,
  a: absFloor,
  p: prettyUnit,
  u: isUndefined
};

// src/index.js
var L = "en";
var Ls = {};
Ls[L] = en_default;
var IS_DAYJS = "$isDayjsObject";
var isDayjs = (d) => d instanceof Dayjs || !!(d && d[IS_DAYJS]);
var parseLocale = (preset, object, isLocal) => {
  let l;
  if (!preset) return L;
  if (typeof preset === "string") {
    const presetLower = preset.toLowerCase();
    if (Ls[presetLower]) {
      l = presetLower;
    }
    if (object) {
      Ls[presetLower] = object;
      l = presetLower;
    }
    const presetSplit = preset.split("-");
    if (!l && presetSplit.length > 1) {
      return parseLocale(presetSplit[0]);
    }
  } else {
    const { name } = preset;
    Ls[name] = preset;
    l = name;
  }
  if (!isLocal && l) L = l;
  return l || !isLocal && L;
};
var dayjs = function(date, c) {
  if (isDayjs(date)) {
    return date.clone();
  }
  const cfg = typeof c === "object" ? c : {};
  cfg.date = date;
  cfg.args = arguments;
  return new Dayjs(cfg);
};
var wrapper = (date, instance) => dayjs(date, {
  locale: instance.$L,
  utc: instance.$u,
  x: instance.$x,
  $offset: instance.$offset
  // todo: refactor; do not use this.$offset in you code
});
var Utils = utils_default;
Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;
var parseDate = (cfg) => {
  const { date, utc } = cfg;
  if (date === null) return /* @__PURE__ */ new Date(NaN);
  if (Utils.u(date)) return /* @__PURE__ */ new Date();
  if (date instanceof Date) return new Date(date);
  if (typeof date === "string" && !/Z$/i.test(date)) {
    const d = date.match(REGEX_PARSE);
    if (d) {
      const m = d[2] - 1 || 0;
      const ms = (d[7] || "0").substring(0, 3);
      if (utc) {
        return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
      }
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }
  return new Date(date);
};
var Dayjs = class {
  constructor(cfg) {
    this.$L = parseLocale(cfg.locale, null, true);
    this.parse(cfg);
    this.$x = this.$x || cfg.x || {};
    this[IS_DAYJS] = true;
  }
  parse(cfg) {
    this.$d = parseDate(cfg);
    this.init();
  }
  init() {
    const { $d: $d2 } = this;
    this.$y = $d2.getFullYear();
    this.$M = $d2.getMonth();
    this.$D = $d2.getDate();
    this.$W = $d2.getDay();
    this.$H = $d2.getHours();
    this.$m = $d2.getMinutes();
    this.$s = $d2.getSeconds();
    this.$ms = $d2.getMilliseconds();
  }
  // eslint-disable-next-line class-methods-use-this
  $utils() {
    return Utils;
  }
  isValid() {
    return !(this.$d.toString() === INVALID_DATE_STRING);
  }
  isSame(that, units) {
    const other = dayjs(that);
    return this.startOf(units) <= other && other <= this.endOf(units);
  }
  isAfter(that, units) {
    return dayjs(that) < this.startOf(units);
  }
  isBefore(that, units) {
    return this.endOf(units) < dayjs(that);
  }
  $g(input, get, set) {
    if (Utils.u(input)) return this[get];
    return this.set(set, input);
  }
  unix() {
    return Math.floor(this.valueOf() / 1e3);
  }
  valueOf() {
    return this.$d.getTime();
  }
  startOf(units, startOf) {
    const isStartOf = !Utils.u(startOf) ? startOf : true;
    const unit = Utils.p(units);
    const instanceFactory = (d, m) => {
      const ins = Utils.w(this.$u ? Date.UTC(this.$y, m, d) : new Date(this.$y, m, d), this);
      return isStartOf ? ins : ins.endOf(D);
    };
    const instanceFactorySet = (method, slice) => {
      const argumentStart = [0, 0, 0, 0];
      const argumentEnd = [23, 59, 59, 999];
      return Utils.w(this.toDate()[method].apply(
        // eslint-disable-line prefer-spread
        this.toDate("s"),
        (isStartOf ? argumentStart : argumentEnd).slice(slice)
      ), this);
    };
    const { $W, $M, $D } = this;
    const utcPad = `set${this.$u ? "UTC" : ""}`;
    switch (unit) {
      case Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      case M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      case W: {
        const weekStart = this.$locale().weekStart || 0;
        const gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }
      case D:
      case DATE:
        return instanceFactorySet(`${utcPad}Hours`, 0);
      case H:
        return instanceFactorySet(`${utcPad}Minutes`, 1);
      case MIN:
        return instanceFactorySet(`${utcPad}Seconds`, 2);
      case S:
        return instanceFactorySet(`${utcPad}Milliseconds`, 3);
      default:
        return this.clone();
    }
  }
  endOf(arg) {
    return this.startOf(arg, false);
  }
  $set(units, int) {
    const unit = Utils.p(units);
    const utcPad = `set${this.$u ? "UTC" : ""}`;
    const name = {
      [D]: `${utcPad}Date`,
      [DATE]: `${utcPad}Date`,
      [M]: `${utcPad}Month`,
      [Y]: `${utcPad}FullYear`,
      [H]: `${utcPad}Hours`,
      [MIN]: `${utcPad}Minutes`,
      [S]: `${utcPad}Seconds`,
      [MS]: `${utcPad}Milliseconds`
    }[unit];
    const arg = unit === D ? this.$D + (int - this.$W) : int;
    if (unit === M || unit === Y) {
      const date = this.clone().set(DATE, 1);
      date.$d[name](arg);
      date.init();
      this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
    } else if (name) this.$d[name](arg);
    this.init();
    return this;
  }
  set(string, int) {
    return this.clone().$set(string, int);
  }
  get(unit) {
    return this[Utils.p(unit)]();
  }
  add(number, units) {
    number = Number(number);
    const unit = Utils.p(units);
    const instanceFactorySet = (n) => {
      const d = dayjs(this);
      return Utils.w(d.date(d.date() + Math.round(n * number)), this);
    };
    if (unit === M) {
      return this.set(M, this.$M + number);
    }
    if (unit === Y) {
      return this.set(Y, this.$y + number);
    }
    if (unit === D) {
      return instanceFactorySet(1);
    }
    if (unit === W) {
      return instanceFactorySet(7);
    }
    const step = {
      [MIN]: MILLISECONDS_A_MINUTE,
      [H]: MILLISECONDS_A_HOUR,
      [S]: MILLISECONDS_A_SECOND
    }[unit] || 1;
    const nextTimeStamp = this.$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  }
  subtract(number, string) {
    return this.add(number * -1, string);
  }
  format(formatStr) {
    const locale2 = this.$locale();
    if (!this.isValid()) return locale2.invalidDate || INVALID_DATE_STRING;
    const str = formatStr || FORMAT_DEFAULT;
    const zoneStr = Utils.z(this);
    const { $H, $m, $M } = this;
    const {
      weekdays,
      months,
      meridiem
    } = locale2;
    const getShort = (arr, index, full, length) => arr && (arr[index] || arr(this, str)) || full[index].slice(0, length);
    const get$H = (num) => Utils.s($H % 12 || 12, num, "0");
    const meridiemFunc = meridiem || ((hour, minute, isLowercase) => {
      const m = hour < 12 ? "AM" : "PM";
      return isLowercase ? m.toLowerCase() : m;
    });
    const matches = (match) => {
      switch (match) {
        case "YY":
          return String(this.$y).slice(-2);
        case "YYYY":
          return Utils.s(this.$y, 4, "0");
        case "M":
          return $M + 1;
        case "MM":
          return Utils.s($M + 1, 2, "0");
        case "MMM":
          return getShort(locale2.monthsShort, $M, months, 3);
        case "MMMM":
          return getShort(months, $M);
        case "D":
          return this.$D;
        case "DD":
          return Utils.s(this.$D, 2, "0");
        case "d":
          return String(this.$W);
        case "dd":
          return getShort(locale2.weekdaysMin, this.$W, weekdays, 2);
        case "ddd":
          return getShort(locale2.weekdaysShort, this.$W, weekdays, 3);
        case "dddd":
          return weekdays[this.$W];
        case "H":
          return String($H);
        case "HH":
          return Utils.s($H, 2, "0");
        case "h":
          return get$H(1);
        case "hh":
          return get$H(2);
        case "a":
          return meridiemFunc($H, $m, true);
        case "A":
          return meridiemFunc($H, $m, false);
        case "m":
          return String($m);
        case "mm":
          return Utils.s($m, 2, "0");
        case "s":
          return String(this.$s);
        case "ss":
          return Utils.s(this.$s, 2, "0");
        case "SSS":
          return Utils.s(this.$ms, 3, "0");
        case "Z":
          return zoneStr;
        default:
          break;
      }
      return null;
    };
    return str.replace(REGEX_FORMAT, (match, $1) => $1 || matches(match) || zoneStr.replace(":", ""));
  }
  utcOffset() {
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
  }
  diff(input, units, float) {
    const unit = Utils.p(units);
    const that = dayjs(input);
    const zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
    const diff = this - that;
    const getMonth = () => Utils.m(this, that);
    let result;
    switch (unit) {
      case Y:
        result = getMonth() / 12;
        break;
      case M:
        result = getMonth();
        break;
      case Q:
        result = getMonth() / 3;
        break;
      case W:
        result = (diff - zoneDelta) / MILLISECONDS_A_WEEK;
        break;
      case D:
        result = (diff - zoneDelta) / MILLISECONDS_A_DAY;
        break;
      case H:
        result = diff / MILLISECONDS_A_HOUR;
        break;
      case MIN:
        result = diff / MILLISECONDS_A_MINUTE;
        break;
      case S:
        result = diff / MILLISECONDS_A_SECOND;
        break;
      default:
        result = diff;
        break;
    }
    return float ? result : Utils.a(result);
  }
  daysInMonth() {
    return this.endOf(M).$D;
  }
  $locale() {
    return Ls[this.$L];
  }
  locale(preset, object) {
    if (!preset) return this.$L;
    const that = this.clone();
    const nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName) that.$L = nextLocaleName;
    return that;
  }
  clone() {
    return Utils.w(this.$d, this);
  }
  toDate() {
    return new Date(this.valueOf());
  }
  toJSON() {
    return this.isValid() ? this.toISOString() : null;
  }
  toISOString() {
    return this.$d.toISOString();
  }
  toString() {
    return this.$d.toUTCString();
  }
};
var proto = Dayjs.prototype;
dayjs.prototype = proto;
[
  ["$ms", MS],
  ["$s", S],
  ["$m", MIN],
  ["$H", H],
  ["$W", D],
  ["$M", M],
  ["$y", Y],
  ["$D", DATE]
].forEach((g) => {
  proto[g[1]] = function(input) {
    return this.$g(input, g[0], g[1]);
  };
});
dayjs.extend = (plugin, option) => {
  if (!plugin.$i) {
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }
  return dayjs;
};
dayjs.locale = parseLocale;
dayjs.isDayjs = isDayjs;
dayjs.unix = (timestamp) => dayjs(timestamp * 1e3);
dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
var src_default = dayjs;

// src/plugin/index.js
var plugin_exports = {};
__export(plugin_exports, {
  advancedFormat: () => advancedFormat_default,
  arraySupport: () => arraySupport_default,
  badMutable: () => badMutable_default,
  bigIntSupport: () => bigIntSupport_default,
  buddhistEra: () => buddhistEra_default,
  calendar: () => calendar_default,
  customParseFormat: () => customParseFormat_default,
  dayOfYear: () => dayOfYear_default,
  devHelper: () => devHelper_default,
  duration: () => duration_default,
  isBetween: () => isBetween_default,
  isLeapYear: () => isLeapYear_default,
  isMoment: () => isMoment_default,
  isSameOrAfter: () => isSameOrAfter_default,
  isSameOrBefore: () => isSameOrBefore_default,
  isToday: () => isToday_default,
  isTomorrow: () => isTomorrow_default,
  isYesterday: () => isYesterday_default,
  isoWeek: () => isoWeek_default,
  isoWeeksInYear: () => isoWeeksInYear_default,
  localeData: () => localeData_default,
  localizedFormat: () => localizedFormat_default,
  minMax: () => minMax_default,
  objectSupport: () => objectSupport_default,
  pluralGetSet: () => pluralGetSet_default,
  preParsePostFormat: () => preParsePostFormat_default,
  quarterOfYear: () => quarterOfYear_default,
  relativeTime: () => relativeTime_default,
  timezone: () => timezone_default,
  toArray: () => toArray_default,
  toObject: () => toObject_default,
  updateLocale: () => updateLocale_default,
  utc: () => utc_default,
  weekOfYear: () => weekOfYear_default,
  weekYear: () => weekYear_default,
  weekday: () => weekday_default
});

// src/plugin/advancedFormat/index.js
var advancedFormat_default = (o, c) => {
  const proto2 = c.prototype;
  const oldFormat = proto2.format;
  proto2.format = function(formatStr) {
    const locale2 = this.$locale();
    if (!this.isValid()) {
      return oldFormat.bind(this)(formatStr);
    }
    const utils = this.$utils();
    const str = formatStr || FORMAT_DEFAULT;
    const result = str.replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, (match) => {
      switch (match) {
        case "Q":
          return Math.ceil((this.$M + 1) / 3);
        case "Do":
          return locale2.ordinal(this.$D);
        case "gggg":
          return this.weekYear();
        case "GGGG":
          return this.isoWeekYear();
        case "wo":
          return locale2.ordinal(this.week(), "W");
        case "w":
        case "ww":
          return utils.s(this.week(), match === "w" ? 1 : 2, "0");
        case "W":
        case "WW":
          return utils.s(this.isoWeek(), match === "W" ? 1 : 2, "0");
        case "k":
        case "kk":
          return utils.s(String(this.$H === 0 ? 24 : this.$H), match === "k" ? 1 : 2, "0");
        case "X":
          return Math.floor(this.$d.getTime() / 1e3);
        case "x":
          return this.$d.getTime();
        case "z":
          return `[${this.offsetName()}]`;
        case "zzz":
          return `[${this.offsetName("long")}]`;
        default:
          return match;
      }
    });
    return oldFormat.bind(this)(result);
  };
};

// src/plugin/arraySupport/index.js
var arraySupport_default = (o, c, dayjs2) => {
  const proto2 = c.prototype;
  const parseDate2 = (cfg) => {
    const { date, utc } = cfg;
    if (Array.isArray(date)) {
      if (utc) {
        if (!date.length) {
          return /* @__PURE__ */ new Date();
        }
        return new Date(Date.UTC.apply(null, date));
      }
      if (date.length === 1) {
        return dayjs2(String(date[0])).toDate();
      }
      return new (Function.prototype.bind.apply(Date, [null].concat(date)))();
    }
    return date;
  };
  const oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    cfg.date = parseDate2.bind(this)(cfg);
    oldParse.bind(this)(cfg);
  };
};

// src/plugin/badMutable/index.js
var badMutable_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.$g = function(input, get, set) {
    if (this.$utils().u(input)) return this[get];
    return this.$set(set, input);
  };
  proto2.set = function(string, int) {
    return this.$set(string, int);
  };
  const oldStartOf = proto2.startOf;
  proto2.startOf = function(units, startOf) {
    this.$d = oldStartOf.bind(this)(units, startOf).toDate();
    this.init();
    return this;
  };
  const oldAdd = proto2.add;
  proto2.add = function(number, units) {
    this.$d = oldAdd.bind(this)(number, units).toDate();
    this.init();
    return this;
  };
  const oldLocale = proto2.locale;
  proto2.locale = function(preset, object) {
    if (!preset) return this.$L;
    this.$L = oldLocale.bind(this)(preset, object).$L;
    return this;
  };
  const oldDaysInMonth = proto2.daysInMonth;
  proto2.daysInMonth = function() {
    return oldDaysInMonth.bind(this.clone())();
  };
  const oldIsSame = proto2.isSame;
  proto2.isSame = function(that, units) {
    return oldIsSame.bind(this.clone())(that, units);
  };
  const oldIsBefore = proto2.isBefore;
  proto2.isBefore = function(that, units) {
    return oldIsBefore.bind(this.clone())(that, units);
  };
  const oldIsAfter = proto2.isAfter;
  proto2.isAfter = function(that, units) {
    return oldIsAfter.bind(this.clone())(that, units);
  };
};

// src/plugin/bigIntSupport/index.js
var isBigInt = (num) => typeof num === "bigint";
var bigIntSupport_default = (o, c, dayjs2) => {
  const proto2 = c.prototype;
  const parseDate2 = (cfg) => {
    const { date } = cfg;
    if (isBigInt(date)) {
      return Number(date);
    }
    return date;
  };
  const oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    cfg.date = parseDate2.bind(this)(cfg);
    oldParse.bind(this)(cfg);
  };
  const oldUnix = dayjs2.unix;
  dayjs2.unix = function(timestamp) {
    const ts = isBigInt(timestamp) ? Number(timestamp) : timestamp;
    return oldUnix(ts);
  };
};

// src/plugin/buddhistEra/index.js
var buddhistEra_default = (o, c) => {
  const proto2 = c.prototype;
  const oldFormat = proto2.format;
  proto2.format = function(formatStr) {
    const yearBias = 543;
    const str = formatStr || FORMAT_DEFAULT;
    const result = str.replace(/(\[[^\]]+])|BBBB|BB/g, (match, a) => {
      const year = String(this.$y + yearBias);
      const args = match === "BB" ? [year.slice(-2), 2] : [year, 4];
      return a || this.$utils().s(...args, "0");
    });
    return oldFormat.bind(this)(result);
  };
};

// src/plugin/calendar/index.js
var calendar_default = (o, c, d) => {
  const LT = "h:mm A";
  const L2 = "MM/DD/YYYY";
  const calendarFormat = {
    lastDay: `[Yesterday at] ${LT}`,
    sameDay: `[Today at] ${LT}`,
    nextDay: `[Tomorrow at] ${LT}`,
    nextWeek: `dddd [at] ${LT}`,
    lastWeek: `[Last] dddd [at] ${LT}`,
    sameElse: L2
  };
  const proto2 = c.prototype;
  proto2.calendar = function(referenceTime, formats) {
    const format = formats || this.$locale().calendar || calendarFormat;
    const referenceStartOfDay = d(referenceTime || void 0).startOf("d");
    const diff = this.diff(referenceStartOfDay, "d", true);
    const sameElse = "sameElse";
    const retVal = diff < -6 ? sameElse : diff < -1 ? "lastWeek" : diff < 0 ? "lastDay" : diff < 1 ? "sameDay" : diff < 2 ? "nextDay" : diff < 7 ? "nextWeek" : sameElse;
    const currentFormat = format[retVal] || calendarFormat[retVal];
    if (typeof currentFormat === "function") {
      return currentFormat.call(this, d());
    }
    return this.format(currentFormat);
  };
};

// src/plugin/localizedFormat/utils.js
var t = (format) => format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_, a, b) => a || b.slice(1));
var englishFormats = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  L: "MM/DD/YYYY",
  LL: "MMMM D, YYYY",
  LLL: "MMMM D, YYYY h:mm A",
  LLLL: "dddd, MMMM D, YYYY h:mm A"
};
var u = (formatStr, formats) => formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
  const B = b && b.toUpperCase();
  return a || formats[b] || englishFormats[b] || t(formats[B]);
});

// src/plugin/customParseFormat/index.js
var formattingTokens = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;
var match1 = /\d/;
var match2 = /\d\d/;
var match3 = /\d{3}/;
var match4 = /\d{4}/;
var match1to2 = /\d\d?/;
var matchSigned = /[+-]?\d+/;
var matchOffset = /[+-]\d\d:?(\d\d)?|Z/;
var matchWord = /\d*[^-_:/,()\s\d]+/;
var locale = {};
var parseTwoDigitYear = function(input) {
  input = +input;
  return input + (input > 68 ? 1900 : 2e3);
};
function offsetFromString(string) {
  if (!string) return 0;
  if (string === "Z") return 0;
  const parts = string.match(/([+-]|\d\d)/g);
  const minutes = +(parts[1] * 60) + (+parts[2] || 0);
  return minutes === 0 ? 0 : parts[0] === "+" ? -minutes : minutes;
}
var addInput = function(property) {
  return function(input) {
    this[property] = +input;
  };
};
var zoneExpressions = [matchOffset, function(input) {
  const zone = this.zone || (this.zone = {});
  zone.offset = offsetFromString(input);
}];
var getLocalePart = (name) => {
  const part = locale[name];
  return part && (part.indexOf ? part : part.s.concat(part.f));
};
var meridiemMatch = (input, isLowerCase) => {
  let isAfternoon;
  const { meridiem } = locale;
  if (!meridiem) {
    isAfternoon = input === (isLowerCase ? "pm" : "PM");
  } else {
    for (let i = 1; i <= 24; i += 1) {
      if (input.indexOf(meridiem(i, 0, isLowerCase)) > -1) {
        isAfternoon = i > 12;
        break;
      }
    }
  }
  return isAfternoon;
};
var expressions = {
  A: [matchWord, function(input) {
    this.afternoon = meridiemMatch(input, false);
  }],
  a: [matchWord, function(input) {
    this.afternoon = meridiemMatch(input, true);
  }],
  S: [match1, function(input) {
    this.milliseconds = +input * 100;
  }],
  SS: [match2, function(input) {
    this.milliseconds = +input * 10;
  }],
  SSS: [match3, function(input) {
    this.milliseconds = +input;
  }],
  s: [match1to2, addInput("seconds")],
  ss: [match1to2, addInput("seconds")],
  m: [match1to2, addInput("minutes")],
  mm: [match1to2, addInput("minutes")],
  H: [match1to2, addInput("hours")],
  h: [match1to2, addInput("hours")],
  HH: [match1to2, addInput("hours")],
  hh: [match1to2, addInput("hours")],
  D: [match1to2, addInput("day")],
  DD: [match2, addInput("day")],
  Do: [matchWord, function(input) {
    const { ordinal } = locale;
    [this.day] = input.match(/\d+/);
    if (!ordinal) return;
    for (let i = 1; i <= 31; i += 1) {
      if (ordinal(i).replace(/\[|\]/g, "") === input) {
        this.day = i;
      }
    }
  }],
  M: [match1to2, addInput("month")],
  MM: [match2, addInput("month")],
  MMM: [matchWord, function(input) {
    const months = getLocalePart("months");
    const monthsShort = getLocalePart("monthsShort");
    const matchIndex = (monthsShort || months.map((_) => _.slice(0, 3))).indexOf(input) + 1;
    if (matchIndex < 1) {
      throw new Error();
    }
    this.month = matchIndex % 12 || matchIndex;
  }],
  MMMM: [matchWord, function(input) {
    const months = getLocalePart("months");
    const matchIndex = months.indexOf(input) + 1;
    if (matchIndex < 1) {
      throw new Error();
    }
    this.month = matchIndex % 12 || matchIndex;
  }],
  Y: [matchSigned, addInput("year")],
  YY: [match2, function(input) {
    this.year = parseTwoDigitYear(input);
  }],
  YYYY: [match4, addInput("year")],
  Z: zoneExpressions,
  ZZ: zoneExpressions
};
function correctHours(time) {
  const { afternoon } = time;
  if (afternoon !== void 0) {
    const { hours } = time;
    if (afternoon) {
      if (hours < 12) {
        time.hours += 12;
      }
    } else if (hours === 12) {
      time.hours = 0;
    }
    delete time.afternoon;
  }
}
function makeParser(format) {
  format = u(format, locale && locale.formats);
  const array = format.match(formattingTokens);
  const { length } = array;
  for (let i = 0; i < length; i += 1) {
    const token = array[i];
    const parseTo = expressions[token];
    const regex = parseTo && parseTo[0];
    const parser = parseTo && parseTo[1];
    if (parser) {
      array[i] = { regex, parser };
    } else {
      array[i] = token.replace(/^\[|\]$/g, "");
    }
  }
  return function(input) {
    const time = {};
    for (let i = 0, start = 0; i < length; i += 1) {
      const token = array[i];
      if (typeof token === "string") {
        start += token.length;
      } else {
        const { regex, parser } = token;
        const part = input.slice(start);
        const match = regex.exec(part);
        const value = match[0];
        parser.call(time, value);
        input = input.replace(value, "");
      }
    }
    correctHours(time);
    return time;
  };
}
var parseFormattedInput = (input, format, utc) => {
  try {
    if (["x", "X"].indexOf(format) > -1) return new Date((format === "X" ? 1e3 : 1) * input);
    const parser = makeParser(format);
    const {
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
      zone
    } = parser(input);
    const now = /* @__PURE__ */ new Date();
    const d = day || (!year && !month ? now.getDate() : 1);
    const y = year || now.getFullYear();
    let M2 = 0;
    if (!(year && !month)) {
      M2 = month > 0 ? month - 1 : now.getMonth();
    }
    const h = hours || 0;
    const m = minutes || 0;
    const s = seconds || 0;
    const ms = milliseconds || 0;
    if (zone) {
      return new Date(Date.UTC(y, M2, d, h, m, s, ms + zone.offset * 60 * 1e3));
    }
    if (utc) {
      return new Date(Date.UTC(y, M2, d, h, m, s, ms));
    }
    return new Date(y, M2, d, h, m, s, ms);
  } catch (e) {
    return /* @__PURE__ */ new Date("");
  }
};
var customParseFormat_default = (o, C, d) => {
  d.p.customParseFormat = true;
  if (o && o.parseTwoDigitYear) {
    ({ parseTwoDigitYear } = o);
  }
  const proto2 = C.prototype;
  const oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    const {
      date,
      utc,
      args
    } = cfg;
    this.$u = utc;
    const format = args[1];
    if (typeof format === "string") {
      const isStrictWithoutLocale = args[2] === true;
      const isStrictWithLocale = args[3] === true;
      const isStrict = isStrictWithoutLocale || isStrictWithLocale;
      let pl = args[2];
      if (isStrictWithLocale) [, , pl] = args;
      locale = this.$locale();
      if (!isStrictWithoutLocale && pl) {
        locale = d.Ls[pl];
      }
      this.$d = parseFormattedInput(date, format, utc);
      this.init();
      if (pl && pl !== true) this.$L = this.locale(pl).$L;
      if (isStrict && date != this.format(format)) {
        this.$d = /* @__PURE__ */ new Date("");
      }
      locale = {};
    } else if (format instanceof Array) {
      const len = format.length;
      for (let i = 1; i <= len; i += 1) {
        args[1] = format[i - 1];
        const result = d.apply(this, args);
        if (result.isValid()) {
          this.$d = result.$d;
          this.$L = result.$L;
          this.init();
          break;
        }
        if (i === len) this.$d = /* @__PURE__ */ new Date("");
      }
    } else {
      oldParse.call(this, cfg);
    }
  };
};

// src/plugin/dayOfYear/index.js
var dayOfYear_default = (o, c, d) => {
  const proto2 = c.prototype;
  proto2.dayOfYear = function(input) {
    const dayOfYear = Math.round((d(this).startOf("day") - d(this).startOf("year")) / 864e5) + 1;
    return input == null ? dayOfYear : this.add(input - dayOfYear, "day");
  };
};

// src/plugin/devHelper/index.js
var devHelper_default = (o, c, d) => {
  if (!process || true) {
    const proto2 = c.prototype;
    const oldParse = proto2.parse;
    proto2.parse = function(cfg) {
      const { date } = cfg;
      if (typeof date === "string" && date.length === 13) {
        console.warn(`To parse a Unix timestamp like ${date}, you should pass it as a Number. https://day.js.org/docs/en/parse/unix-timestamp-milliseconds`);
      }
      if (typeof date === "number" && String(date).length === 4) {
        console.warn(`Guessing you may want to parse the Year ${date}, you should pass it as a String ${date}, not a Number. Otherwise, ${date} will be treated as a Unix timestamp`);
      }
      if (cfg.args.length >= 2 && !d.p.customParseFormat) {
        console.warn(`To parse a date-time string like ${date} using the given format, you should enable customParseFormat plugin first. https://day.js.org/docs/en/parse/string-format`);
      }
      return oldParse.bind(this)(cfg);
    };
    const oldLocale = d.locale;
    d.locale = function(preset, object, isLocal) {
      if (typeof object === "undefined" && typeof preset === "string") {
        if (!d.Ls[preset]) {
          console.warn(`Guessing you may want to use locale ${preset}, you have to load it before using it. https://day.js.org/docs/en/i18n/loading-into-nodejs`);
        }
      }
      return oldLocale(preset, object, isLocal);
    };
  }
};

// src/plugin/duration/index.js
var MILLISECONDS_A_YEAR = MILLISECONDS_A_DAY * 365;
var MILLISECONDS_A_MONTH = MILLISECONDS_A_YEAR / 12;
var durationRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
var unitToMS = {
  years: MILLISECONDS_A_YEAR,
  months: MILLISECONDS_A_MONTH,
  days: MILLISECONDS_A_DAY,
  hours: MILLISECONDS_A_HOUR,
  minutes: MILLISECONDS_A_MINUTE,
  seconds: MILLISECONDS_A_SECOND,
  milliseconds: 1,
  weeks: MILLISECONDS_A_WEEK
};
var isDuration = (d) => d instanceof Duration;
var $d;
var $u;
var wrapper2 = (input, instance, unit) => new Duration(input, unit, instance.$l);
var prettyUnit2 = (unit) => `${$u.p(unit)}s`;
var isNegative = (number) => number < 0;
var roundNumber = (number) => isNegative(number) ? Math.ceil(number) : Math.floor(number);
var absolute = (number) => Math.abs(number);
var getNumberUnitFormat = (number, unit) => {
  if (!number) {
    return {
      negative: false,
      format: ""
    };
  }
  if (isNegative(number)) {
    return {
      negative: true,
      format: `${absolute(number)}${unit}`
    };
  }
  return {
    negative: false,
    format: `${number}${unit}`
  };
};
var Duration = class {
  constructor(input, unit, locale2) {
    this.$d = {};
    this.$l = locale2;
    if (input === void 0) {
      this.$ms = 0;
      this.parseFromMilliseconds();
    }
    if (unit) {
      return wrapper2(input * unitToMS[prettyUnit2(unit)], this);
    }
    if (typeof input === "number") {
      this.$ms = input;
      this.parseFromMilliseconds();
      return this;
    }
    if (typeof input === "object") {
      Object.keys(input).forEach((k) => {
        this.$d[prettyUnit2(k)] = input[k];
      });
      this.calMilliseconds();
      return this;
    }
    if (typeof input === "string") {
      const d = input.match(durationRegex);
      if (d) {
        const properties = d.slice(2);
        const numberD = properties.map((value) => value != null ? Number(value) : 0);
        [
          this.$d.years,
          this.$d.months,
          this.$d.weeks,
          this.$d.days,
          this.$d.hours,
          this.$d.minutes,
          this.$d.seconds
        ] = numberD;
        this.calMilliseconds();
        return this;
      }
    }
    return this;
  }
  calMilliseconds() {
    this.$ms = Object.keys(this.$d).reduce((total, unit) => total + (this.$d[unit] || 0) * unitToMS[unit], 0);
  }
  parseFromMilliseconds() {
    let { $ms } = this;
    this.$d.years = roundNumber($ms / MILLISECONDS_A_YEAR);
    $ms %= MILLISECONDS_A_YEAR;
    this.$d.months = roundNumber($ms / MILLISECONDS_A_MONTH);
    $ms %= MILLISECONDS_A_MONTH;
    this.$d.days = roundNumber($ms / MILLISECONDS_A_DAY);
    $ms %= MILLISECONDS_A_DAY;
    this.$d.hours = roundNumber($ms / MILLISECONDS_A_HOUR);
    $ms %= MILLISECONDS_A_HOUR;
    this.$d.minutes = roundNumber($ms / MILLISECONDS_A_MINUTE);
    $ms %= MILLISECONDS_A_MINUTE;
    this.$d.seconds = roundNumber($ms / MILLISECONDS_A_SECOND);
    $ms %= MILLISECONDS_A_SECOND;
    this.$d.milliseconds = $ms;
  }
  toISOString() {
    const Y2 = getNumberUnitFormat(this.$d.years, "Y");
    const M2 = getNumberUnitFormat(this.$d.months, "M");
    let days = +this.$d.days || 0;
    if (this.$d.weeks) {
      days += this.$d.weeks * 7;
    }
    const D2 = getNumberUnitFormat(days, "D");
    const H2 = getNumberUnitFormat(this.$d.hours, "H");
    const m = getNumberUnitFormat(this.$d.minutes, "M");
    let seconds = this.$d.seconds || 0;
    if (this.$d.milliseconds) {
      seconds += this.$d.milliseconds / 1e3;
      seconds = Math.round(seconds * 1e3) / 1e3;
    }
    const S2 = getNumberUnitFormat(seconds, "S");
    const negativeMode = Y2.negative || M2.negative || D2.negative || H2.negative || m.negative || S2.negative;
    const T = H2.format || m.format || S2.format ? "T" : "";
    const P = negativeMode ? "-" : "";
    const result = `${P}P${Y2.format}${M2.format}${D2.format}${T}${H2.format}${m.format}${S2.format}`;
    return result === "P" || result === "-P" ? "P0D" : result;
  }
  toJSON() {
    return this.toISOString();
  }
  format(formatStr) {
    const str = formatStr || "YYYY-MM-DDTHH:mm:ss";
    const matches = {
      Y: this.$d.years,
      YY: $u.s(this.$d.years, 2, "0"),
      YYYY: $u.s(this.$d.years, 4, "0"),
      M: this.$d.months,
      MM: $u.s(this.$d.months, 2, "0"),
      D: this.$d.days,
      DD: $u.s(this.$d.days, 2, "0"),
      H: this.$d.hours,
      HH: $u.s(this.$d.hours, 2, "0"),
      m: this.$d.minutes,
      mm: $u.s(this.$d.minutes, 2, "0"),
      s: this.$d.seconds,
      ss: $u.s(this.$d.seconds, 2, "0"),
      SSS: $u.s(this.$d.milliseconds, 3, "0")
    };
    return str.replace(REGEX_FORMAT, (match, $1) => $1 || String(matches[match]));
  }
  as(unit) {
    return this.$ms / unitToMS[prettyUnit2(unit)];
  }
  get(unit) {
    let base = this.$ms;
    const pUnit = prettyUnit2(unit);
    if (pUnit === "milliseconds") {
      base %= 1e3;
    } else if (pUnit === "weeks") {
      base = roundNumber(base / unitToMS[pUnit]);
    } else {
      base = this.$d[pUnit];
    }
    return base || 0;
  }
  add(input, unit, isSubtract) {
    let another;
    if (unit) {
      another = input * unitToMS[prettyUnit2(unit)];
    } else if (isDuration(input)) {
      another = input.$ms;
    } else {
      another = wrapper2(input, this).$ms;
    }
    return wrapper2(this.$ms + another * (isSubtract ? -1 : 1), this);
  }
  subtract(input, unit) {
    return this.add(input, unit, true);
  }
  locale(l) {
    const that = this.clone();
    that.$l = l;
    return that;
  }
  clone() {
    return wrapper2(this.$ms, this);
  }
  humanize(withSuffix) {
    return $d().add(this.$ms, "ms").locale(this.$l).fromNow(!withSuffix);
  }
  valueOf() {
    return this.asMilliseconds();
  }
  milliseconds() {
    return this.get("milliseconds");
  }
  asMilliseconds() {
    return this.as("milliseconds");
  }
  seconds() {
    return this.get("seconds");
  }
  asSeconds() {
    return this.as("seconds");
  }
  minutes() {
    return this.get("minutes");
  }
  asMinutes() {
    return this.as("minutes");
  }
  hours() {
    return this.get("hours");
  }
  asHours() {
    return this.as("hours");
  }
  days() {
    return this.get("days");
  }
  asDays() {
    return this.as("days");
  }
  weeks() {
    return this.get("weeks");
  }
  asWeeks() {
    return this.as("weeks");
  }
  months() {
    return this.get("months");
  }
  asMonths() {
    return this.as("months");
  }
  years() {
    return this.get("years");
  }
  asYears() {
    return this.as("years");
  }
};
var manipulateDuration = (date, duration, k) => date.add(duration.years() * k, "y").add(duration.months() * k, "M").add(duration.days() * k, "d").add(duration.hours() * k, "h").add(duration.minutes() * k, "m").add(duration.seconds() * k, "s").add(duration.milliseconds() * k, "ms");
var duration_default = (option, Dayjs2, dayjs2) => {
  $d = dayjs2;
  $u = dayjs2().$utils();
  dayjs2.duration = function(input, unit) {
    const $l = dayjs2.locale();
    return wrapper2(input, { $l }, unit);
  };
  dayjs2.isDuration = isDuration;
  const oldAdd = Dayjs2.prototype.add;
  const oldSubtract = Dayjs2.prototype.subtract;
  Dayjs2.prototype.add = function(value, unit) {
    if (isDuration(value)) {
      return manipulateDuration(this, value, 1);
    }
    return oldAdd.bind(this)(value, unit);
  };
  Dayjs2.prototype.subtract = function(value, unit) {
    if (isDuration(value)) {
      return manipulateDuration(this, value, -1);
    }
    return oldSubtract.bind(this)(value, unit);
  };
};

// src/plugin/isBetween/index.js
var isBetween_default = (o, c, d) => {
  c.prototype.isBetween = function(a, b, u2, i) {
    const dA = d(a);
    const dB = d(b);
    i = i || "()";
    const dAi = i[0] === "(";
    const dBi = i[1] === ")";
    return (dAi ? this.isAfter(dA, u2) : !this.isBefore(dA, u2)) && (dBi ? this.isBefore(dB, u2) : !this.isAfter(dB, u2)) || (dAi ? this.isBefore(dA, u2) : !this.isAfter(dA, u2)) && (dBi ? this.isAfter(dB, u2) : !this.isBefore(dB, u2));
  };
};

// src/plugin/isLeapYear/index.js
var isLeapYear_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.isLeapYear = function() {
    return this.$y % 4 === 0 && this.$y % 100 !== 0 || this.$y % 400 === 0;
  };
};

// src/plugin/isMoment/index.js
var isMoment_default = (o, c, f) => {
  f.isMoment = function(input) {
    return f.isDayjs(input);
  };
};

// src/plugin/isSameOrAfter/index.js
var isSameOrAfter_default = (o, c) => {
  c.prototype.isSameOrAfter = function(that, units) {
    return this.isSame(that, units) || this.isAfter(that, units);
  };
};

// src/plugin/isSameOrBefore/index.js
var isSameOrBefore_default = (o, c) => {
  c.prototype.isSameOrBefore = function(that, units) {
    return this.isSame(that, units) || this.isBefore(that, units);
  };
};

// src/plugin/isToday/index.js
var isToday_default = (o, c, d) => {
  const proto2 = c.prototype;
  proto2.isToday = function() {
    const comparisonTemplate = "YYYY-MM-DD";
    const now = d();
    return this.format(comparisonTemplate) === now.format(comparisonTemplate);
  };
};

// src/plugin/isTomorrow/index.js
var isTomorrow_default = (o, c, d) => {
  const proto2 = c.prototype;
  proto2.isTomorrow = function() {
    const comparisonTemplate = "YYYY-MM-DD";
    const tomorrow = d().add(1, "day");
    return this.format(comparisonTemplate) === tomorrow.format(comparisonTemplate);
  };
};

// src/plugin/isYesterday/index.js
var isYesterday_default = (o, c, d) => {
  const proto2 = c.prototype;
  proto2.isYesterday = function() {
    const comparisonTemplate = "YYYY-MM-DD";
    const yesterday = d().subtract(1, "day");
    return this.format(comparisonTemplate) === yesterday.format(comparisonTemplate);
  };
};

// src/plugin/isoWeek/index.js
var isoWeekPrettyUnit = "isoweek";
var isoWeek_default = (o, c, d) => {
  const getYearFirstThursday = (year, isUtc) => {
    const yearFirstDay = (isUtc ? d.utc : d)().year(year).startOf(Y);
    let addDiffDays = 4 - yearFirstDay.isoWeekday();
    if (yearFirstDay.isoWeekday() > 4) {
      addDiffDays += 7;
    }
    return yearFirstDay.add(addDiffDays, D);
  };
  const getCurrentWeekThursday = (ins) => ins.add(4 - ins.isoWeekday(), D);
  const proto2 = c.prototype;
  proto2.isoWeekYear = function() {
    const nowWeekThursday = getCurrentWeekThursday(this);
    return nowWeekThursday.year();
  };
  proto2.isoWeek = function(week) {
    if (!this.$utils().u(week)) {
      return this.add((week - this.isoWeek()) * 7, D);
    }
    const nowWeekThursday = getCurrentWeekThursday(this);
    const diffWeekThursday = getYearFirstThursday(this.isoWeekYear(), this.$u);
    return nowWeekThursday.diff(diffWeekThursday, W) + 1;
  };
  proto2.isoWeekday = function(week) {
    if (!this.$utils().u(week)) {
      return this.day(this.day() % 7 ? week : week - 7);
    }
    return this.day() || 7;
  };
  const oldStartOf = proto2.startOf;
  proto2.startOf = function(units, startOf) {
    const utils = this.$utils();
    const isStartOf = !utils.u(startOf) ? startOf : true;
    const unit = utils.p(units);
    if (unit === isoWeekPrettyUnit) {
      return isStartOf ? this.date(this.date() - (this.isoWeekday() - 1)).startOf("day") : this.date(this.date() - 1 - (this.isoWeekday() - 1) + 7).endOf("day");
    }
    return oldStartOf.bind(this)(units, startOf);
  };
};

// src/plugin/isoWeeksInYear/index.js
var isoWeeksInYear_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.isoWeeksInYear = function() {
    const isLeapYear = this.isLeapYear();
    const last = this.endOf("y");
    const day = last.day();
    if (day === 4 || isLeapYear && day === 5) {
      return 53;
    }
    return 52;
  };
};

// src/plugin/localeData/index.js
var localeData_default = (o, c, dayjs2) => {
  const proto2 = c.prototype;
  const getLocalePart2 = (part) => part && (part.indexOf ? part : part.s);
  const getShort = (ins, target, full, num, localeOrder) => {
    const locale2 = ins.name ? ins : ins.$locale();
    const targetLocale = getLocalePart2(locale2[target]);
    const fullLocale = getLocalePart2(locale2[full]);
    const result = targetLocale || fullLocale.map((f) => f.slice(0, num));
    if (!localeOrder) return result;
    const { weekStart } = locale2;
    return result.map((_, index) => result[(index + (weekStart || 0)) % 7]);
  };
  const getDayjsLocaleObject = () => dayjs2.Ls[dayjs2.locale()];
  const getLongDateFormat = (l, format) => l.formats[format] || t(l.formats[format.toUpperCase()]);
  const localeData = function() {
    return {
      months: (instance) => instance ? instance.format("MMMM") : getShort(this, "months"),
      monthsShort: (instance) => instance ? instance.format("MMM") : getShort(this, "monthsShort", "months", 3),
      firstDayOfWeek: () => this.$locale().weekStart || 0,
      weekdays: (instance) => instance ? instance.format("dddd") : getShort(this, "weekdays"),
      weekdaysMin: (instance) => instance ? instance.format("dd") : getShort(this, "weekdaysMin", "weekdays", 2),
      weekdaysShort: (instance) => instance ? instance.format("ddd") : getShort(this, "weekdaysShort", "weekdays", 3),
      longDateFormat: (format) => getLongDateFormat(this.$locale(), format),
      meridiem: this.$locale().meridiem,
      ordinal: this.$locale().ordinal
    };
  };
  proto2.localeData = function() {
    return localeData.bind(this)();
  };
  dayjs2.localeData = () => {
    const localeObject = getDayjsLocaleObject();
    return {
      firstDayOfWeek: () => localeObject.weekStart || 0,
      weekdays: () => dayjs2.weekdays(),
      weekdaysShort: () => dayjs2.weekdaysShort(),
      weekdaysMin: () => dayjs2.weekdaysMin(),
      months: () => dayjs2.months(),
      monthsShort: () => dayjs2.monthsShort(),
      longDateFormat: (format) => getLongDateFormat(localeObject, format),
      meridiem: localeObject.meridiem,
      ordinal: localeObject.ordinal
    };
  };
  dayjs2.months = () => getShort(getDayjsLocaleObject(), "months");
  dayjs2.monthsShort = () => getShort(getDayjsLocaleObject(), "monthsShort", "months", 3);
  dayjs2.weekdays = (localeOrder) => getShort(getDayjsLocaleObject(), "weekdays", null, null, localeOrder);
  dayjs2.weekdaysShort = (localeOrder) => getShort(getDayjsLocaleObject(), "weekdaysShort", "weekdays", 3, localeOrder);
  dayjs2.weekdaysMin = (localeOrder) => getShort(getDayjsLocaleObject(), "weekdaysMin", "weekdays", 2, localeOrder);
};

// src/plugin/localizedFormat/index.js
var localizedFormat_default = (o, c, d) => {
  const proto2 = c.prototype;
  const oldFormat = proto2.format;
  d.en.formats = englishFormats;
  proto2.format = function(formatStr = FORMAT_DEFAULT) {
    const { formats = {} } = this.$locale();
    const result = u(formatStr, formats);
    return oldFormat.call(this, result);
  };
};

// src/plugin/minMax/index.js
var minMax_default = (o, c, d) => {
  const sortBy = (method, dates) => {
    if (!dates || !dates.length || dates.length === 1 && !dates[0] || dates.length === 1 && Array.isArray(dates[0]) && !dates[0].length) {
      return null;
    }
    if (dates.length === 1 && dates[0].length > 0) {
      [dates] = dates;
    }
    dates = dates.filter((date) => date);
    let result;
    [result] = dates;
    for (let i = 1; i < dates.length; i += 1) {
      if (!dates[i].isValid() || dates[i][method](result)) {
        result = dates[i];
      }
    }
    return result;
  };
  d.max = function() {
    const args = [].slice.call(arguments, 0);
    return sortBy("isAfter", args);
  };
  d.min = function() {
    const args = [].slice.call(arguments, 0);
    return sortBy("isBefore", args);
  };
};

// src/plugin/objectSupport/index.js
var objectSupport_default = (o, c, dayjs2) => {
  const proto2 = c.prototype;
  const isObject = (obj) => obj !== null && !(obj instanceof Date) && !(obj instanceof Array) && !proto2.$utils().u(obj) && obj.constructor.name === "Object";
  const prettyUnit3 = (u2) => {
    const unit = proto2.$utils().p(u2);
    return unit === "date" ? "day" : unit;
  };
  const parseDate2 = (cfg) => {
    const { date, utc } = cfg;
    const $d2 = {};
    if (isObject(date)) {
      if (!Object.keys(date).length) {
        return /* @__PURE__ */ new Date();
      }
      const now = utc ? dayjs2.utc() : dayjs2();
      Object.keys(date).forEach((k) => {
        $d2[prettyUnit3(k)] = date[k];
      });
      const d = $d2.day || (!$d2.year && !($d2.month >= 0) ? now.date() : 1);
      const y = $d2.year || now.year();
      const M2 = $d2.month >= 0 ? $d2.month : !$d2.year && !$d2.day ? now.month() : 0;
      const h = $d2.hour || 0;
      const m = $d2.minute || 0;
      const s = $d2.second || 0;
      const ms = $d2.millisecond || 0;
      if (utc) {
        return new Date(Date.UTC(y, M2, d, h, m, s, ms));
      }
      return new Date(y, M2, d, h, m, s, ms);
    }
    return date;
  };
  const oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    cfg.date = parseDate2.bind(this)(cfg);
    oldParse.bind(this)(cfg);
  };
  const oldSet = proto2.set;
  const oldAdd = proto2.add;
  const oldSubtract = proto2.subtract;
  const callObject = function(call, argument, string, offset = 1) {
    const keys = Object.keys(argument);
    let chain = this;
    keys.forEach((key) => {
      chain = call.bind(chain)(argument[key] * offset, key);
    });
    return chain;
  };
  proto2.set = function(unit, value) {
    value = value === void 0 ? unit : value;
    if (unit.constructor.name === "Object") {
      return callObject.bind(this)(function(i, s) {
        return oldSet.bind(this)(s, i);
      }, value, unit);
    }
    return oldSet.bind(this)(unit, value);
  };
  proto2.add = function(value, unit) {
    if (value.constructor.name === "Object") {
      return callObject.bind(this)(oldAdd, value, unit);
    }
    return oldAdd.bind(this)(value, unit);
  };
  proto2.subtract = function(value, unit) {
    if (value.constructor.name === "Object") {
      return callObject.bind(this)(oldAdd, value, unit, -1);
    }
    return oldSubtract.bind(this)(value, unit);
  };
};

// src/plugin/pluralGetSet/index.js
var pluralGetSet_default = (o, c) => {
  const proto2 = c.prototype;
  const pluralAliases = [
    "milliseconds",
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "isoWeeks",
    "months",
    "quarters",
    "years",
    "dates"
  ];
  pluralAliases.forEach((alias) => {
    proto2[alias] = proto2[alias.replace(/s$/, "")];
  });
};

// src/plugin/preParsePostFormat/index.js
var preParsePostFormat_default = (option, dayjsClass) => {
  const oldParse = dayjsClass.prototype.parse;
  dayjsClass.prototype.parse = function(cfg) {
    if (typeof cfg.date === "string") {
      const locale2 = this.$locale();
      cfg.date = locale2 && locale2.preparse ? locale2.preparse(cfg.date) : cfg.date;
    }
    return oldParse.bind(this)(cfg);
  };
  const oldFormat = dayjsClass.prototype.format;
  dayjsClass.prototype.format = function(...args) {
    const result = oldFormat.call(this, ...args);
    const locale2 = this.$locale();
    return locale2 && locale2.postformat ? locale2.postformat(result) : result;
  };
  const oldFromTo = dayjsClass.prototype.fromToBase;
  if (oldFromTo) {
    dayjsClass.prototype.fromToBase = function(input, withoutSuffix, instance, isFrom) {
      const locale2 = this.$locale() || instance.$locale();
      return oldFromTo.call(
        this,
        input,
        withoutSuffix,
        instance,
        isFrom,
        locale2 && locale2.postformat
      );
    };
  }
};

// src/plugin/quarterOfYear/index.js
var quarterOfYear_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.quarter = function(quarter) {
    if (!this.$utils().u(quarter)) {
      return this.month(this.month() % 3 + (quarter - 1) * 3);
    }
    return Math.ceil((this.month() + 1) / 3);
  };
  const oldAdd = proto2.add;
  proto2.add = function(number, units) {
    number = Number(number);
    const unit = this.$utils().p(units);
    if (unit === Q) {
      return this.add(number * 3, M);
    }
    return oldAdd.bind(this)(number, units);
  };
  const oldStartOf = proto2.startOf;
  proto2.startOf = function(units, startOf) {
    const utils = this.$utils();
    const isStartOf = !utils.u(startOf) ? startOf : true;
    const unit = utils.p(units);
    if (unit === Q) {
      const quarter = this.quarter() - 1;
      return isStartOf ? this.month(quarter * 3).startOf(M).startOf(D) : this.month(quarter * 3 + 2).endOf(M).endOf(D);
    }
    return oldStartOf.bind(this)(units, startOf);
  };
};

// src/plugin/relativeTime/index.js
var relativeTime_default = (o, c, d) => {
  o = o || {};
  const proto2 = c.prototype;
  const relObj = {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  };
  d.en.relativeTime = relObj;
  proto2.fromToBase = (input, withoutSuffix, instance, isFrom, postFormat) => {
    const loc = instance.$locale().relativeTime || relObj;
    const T = o.thresholds || [
      { l: "s", r: 44, d: S },
      { l: "m", r: 89 },
      { l: "mm", r: 44, d: MIN },
      { l: "h", r: 89 },
      { l: "hh", r: 21, d: H },
      { l: "d", r: 35 },
      { l: "dd", r: 25, d: D },
      { l: "M", r: 45 },
      { l: "MM", r: 10, d: M },
      { l: "y", r: 17 },
      { l: "yy", d: Y }
    ];
    const Tl = T.length;
    let result;
    let out;
    let isFuture;
    for (let i = 0; i < Tl; i += 1) {
      let t2 = T[i];
      if (t2.d) {
        result = isFrom ? d(input).diff(instance, t2.d, true) : instance.diff(input, t2.d, true);
      }
      let abs = (o.rounding || Math.round)(Math.abs(result));
      isFuture = result > 0;
      if (abs <= t2.r || !t2.r) {
        if (abs <= 1 && i > 0) t2 = T[i - 1];
        const format = loc[t2.l];
        if (postFormat) {
          abs = postFormat(`${abs}`);
        }
        if (typeof format === "string") {
          out = format.replace("%d", abs);
        } else {
          out = format(abs, withoutSuffix, t2.l, isFuture);
        }
        break;
      }
    }
    if (withoutSuffix) return out;
    const pastOrFuture = isFuture ? loc.future : loc.past;
    if (typeof pastOrFuture === "function") {
      return pastOrFuture(out);
    }
    return pastOrFuture.replace("%s", out);
  };
  function fromTo(input, withoutSuffix, instance, isFrom) {
    return proto2.fromToBase(input, withoutSuffix, instance, isFrom);
  }
  proto2.to = function(input, withoutSuffix) {
    return fromTo(input, withoutSuffix, this, true);
  };
  proto2.from = function(input, withoutSuffix) {
    return fromTo(input, withoutSuffix, this);
  };
  const makeNow = (thisDay) => thisDay.$u ? d.utc() : d();
  proto2.toNow = function(withoutSuffix) {
    return this.to(makeNow(this), withoutSuffix);
  };
  proto2.fromNow = function(withoutSuffix) {
    return this.from(makeNow(this), withoutSuffix);
  };
};

// src/plugin/timezone/index.js
var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};
var dtfCache = {};
var getDateTimeFormat = (timezone, options = {}) => {
  const timeZoneName = options.timeZoneName || "short";
  const key = `${timezone}|${timeZoneName}`;
  let dtf = dtfCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName
    });
    dtfCache[key] = dtf;
  }
  return dtf;
};
var timezone_default = (o, c, d) => {
  let defaultTimezone;
  const makeFormatParts = (timestamp, timezone, options = {}) => {
    const date = new Date(timestamp);
    const dtf = getDateTimeFormat(timezone, options);
    return dtf.formatToParts(date);
  };
  const tzOffset = (timestamp, timezone) => {
    const formatResult = makeFormatParts(timestamp, timezone);
    const filled = [];
    for (let i = 0; i < formatResult.length; i += 1) {
      const { type, value } = formatResult[i];
      const pos = typeToPos[type];
      if (pos >= 0) {
        filled[pos] = parseInt(value, 10);
      }
    }
    const hour = filled[3];
    const fixedHour = hour === 24 ? 0 : hour;
    const utcString = `${filled[0]}-${filled[1]}-${filled[2]} ${fixedHour}:${filled[4]}:${filled[5]}:000`;
    const utcTs = d.utc(utcString).valueOf();
    let asTS = +timestamp;
    const over = asTS % 1e3;
    asTS -= over;
    return (utcTs - asTS) / (60 * 1e3);
  };
  const fixOffset = (localTS, o0, tz) => {
    let utcGuess = localTS - o0 * 60 * 1e3;
    const o2 = tzOffset(utcGuess, tz);
    if (o0 === o2) {
      return [utcGuess, o0];
    }
    utcGuess -= (o2 - o0) * 60 * 1e3;
    const o3 = tzOffset(utcGuess, tz);
    if (o2 === o3) {
      return [utcGuess, o2];
    }
    return [localTS - Math.min(o2, o3) * 60 * 1e3, Math.max(o2, o3)];
  };
  const proto2 = c.prototype;
  proto2.tz = function(timezone = defaultTimezone, keepLocalTime) {
    const oldOffset = this.utcOffset();
    const date = this.toDate();
    const target = date.toLocaleString("en-US", { timeZone: timezone });
    const diff = Math.round((date - new Date(target)) / 1e3 / 60);
    let ins = d(target, { locale: this.$L }).$set(MS, this.$ms).utcOffset(-Math.round(date.getTimezoneOffset() / 15) * 15 - diff, true);
    if (keepLocalTime) {
      const newOffset = ins.utcOffset();
      ins = ins.add(oldOffset - newOffset, MIN);
    }
    ins.$x.$timezone = timezone;
    return ins;
  };
  proto2.offsetName = function(type) {
    const zone = this.$x.$timezone || d.tz.guess();
    const result = makeFormatParts(this.valueOf(), zone, { timeZoneName: type }).find((m) => m.type.toLowerCase() === "timezonename");
    return result && result.value;
  };
  const oldStartOf = proto2.startOf;
  proto2.startOf = function(units, startOf) {
    if (!this.$x || !this.$x.$timezone) {
      return oldStartOf.call(this, units, startOf);
    }
    const withoutTz = d(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
    const startOfWithoutTz = oldStartOf.call(withoutTz, units, startOf);
    return startOfWithoutTz.tz(this.$x.$timezone, true);
  };
  d.tz = function(input, arg1, arg2) {
    const parseFormat = arg2 && arg1;
    const timezone = arg2 || arg1 || defaultTimezone;
    const previousOffset = tzOffset(+d(), timezone);
    if (typeof input !== "string") {
      return d(input).tz(timezone);
    }
    const localTs = d.utc(input, parseFormat).valueOf();
    const [targetTs, targetOffset] = fixOffset(localTs, previousOffset, timezone);
    const ins = d(targetTs).utcOffset(targetOffset);
    ins.$x.$timezone = timezone;
    return ins;
  };
  d.tz.guess = function() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  d.tz.setDefault = function(timezone) {
    defaultTimezone = timezone;
  };
};

// src/plugin/toArray/index.js
var toArray_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.toArray = function() {
    return [
      this.$y,
      this.$M,
      this.$D,
      this.$H,
      this.$m,
      this.$s,
      this.$ms
    ];
  };
};

// src/plugin/toObject/index.js
var toObject_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.toObject = function() {
    return {
      years: this.$y,
      months: this.$M,
      date: this.$D,
      hours: this.$H,
      minutes: this.$m,
      seconds: this.$s,
      milliseconds: this.$ms
    };
  };
};

// src/plugin/updateLocale/index.js
var updateLocale_default = (option, Dayjs2, dayjs2) => {
  dayjs2.updateLocale = function(locale2, customConfig) {
    const localeList = dayjs2.Ls;
    const localeConfig = localeList[locale2];
    if (!localeConfig) return;
    const customConfigKeys = customConfig ? Object.keys(customConfig) : [];
    customConfigKeys.forEach((c) => {
      localeConfig[c] = customConfig[c];
    });
    return localeConfig;
  };
};

// src/plugin/utc/index.js
var REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g;
var REGEX_OFFSET_HOURS_MINUTES_FORMAT = /([+-]|\d\d)/g;
function offsetFromString2(value = "") {
  const offset = value.match(REGEX_VALID_OFFSET_FORMAT);
  if (!offset) {
    return null;
  }
  const [indicator, hoursOffset, minutesOffset] = `${offset[0]}`.match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || ["-", 0, 0];
  const totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset;
  if (totalOffsetInMinutes === 0) {
    return 0;
  }
  return indicator === "+" ? totalOffsetInMinutes : -totalOffsetInMinutes;
}
var utc_default = (option, Dayjs2, dayjs2) => {
  const proto2 = Dayjs2.prototype;
  dayjs2.utc = function(date) {
    const cfg = { date, utc: true, args: arguments };
    return new Dayjs2(cfg);
  };
  proto2.utc = function(keepLocalTime) {
    const ins = dayjs2(this.toDate(), { locale: this.$L, utc: true });
    if (keepLocalTime) {
      return ins.add(this.utcOffset(), MIN);
    }
    return ins;
  };
  proto2.local = function() {
    return dayjs2(this.toDate(), { locale: this.$L, utc: false });
  };
  const oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    if (cfg.utc) {
      this.$u = true;
    }
    if (!this.$utils().u(cfg.$offset)) {
      this.$offset = cfg.$offset;
    }
    oldParse.call(this, cfg);
  };
  const oldInit = proto2.init;
  proto2.init = function() {
    if (this.$u) {
      const { $d: $d2 } = this;
      this.$y = $d2.getUTCFullYear();
      this.$M = $d2.getUTCMonth();
      this.$D = $d2.getUTCDate();
      this.$W = $d2.getUTCDay();
      this.$H = $d2.getUTCHours();
      this.$m = $d2.getUTCMinutes();
      this.$s = $d2.getUTCSeconds();
      this.$ms = $d2.getUTCMilliseconds();
    } else {
      oldInit.call(this);
    }
  };
  const oldUtcOffset = proto2.utcOffset;
  proto2.utcOffset = function(input, keepLocalTime) {
    const { u: u2 } = this.$utils();
    if (u2(input)) {
      if (this.$u) {
        return 0;
      }
      if (!u2(this.$offset)) {
        return this.$offset;
      }
      return oldUtcOffset.call(this);
    }
    if (typeof input === "string") {
      input = offsetFromString2(input);
      if (input === null) {
        return this;
      }
    }
    const offset = Math.abs(input) <= 16 ? input * 60 : input;
    let ins = this;
    if (keepLocalTime) {
      ins.$offset = offset;
      ins.$u = input === 0;
      return ins;
    }
    if (input !== 0) {
      const localTimezoneOffset = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
      ins = this.local().add(offset + localTimezoneOffset, MIN);
      ins.$offset = offset;
      ins.$x.$localOffset = localTimezoneOffset;
    } else {
      ins = this.utc();
    }
    return ins;
  };
  const oldFormat = proto2.format;
  const UTC_FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ss[Z]";
  proto2.format = function(formatStr) {
    const str = formatStr || (this.$u ? UTC_FORMAT_DEFAULT : "");
    return oldFormat.call(this, str);
  };
  proto2.valueOf = function() {
    const addedOffset = !this.$utils().u(this.$offset) ? this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset()) : 0;
    return this.$d.valueOf() - addedOffset * MILLISECONDS_A_MINUTE;
  };
  proto2.isUTC = function() {
    return !!this.$u;
  };
  proto2.toISOString = function() {
    return this.toDate().toISOString();
  };
  proto2.toString = function() {
    return this.toDate().toUTCString();
  };
  const oldToDate = proto2.toDate;
  proto2.toDate = function(type) {
    if (type === "s" && this.$offset) {
      return dayjs2(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate();
    }
    return oldToDate.call(this);
  };
  const oldDiff = proto2.diff;
  proto2.diff = function(input, units, float) {
    if (input && this.$u === input.$u) {
      return oldDiff.call(this, input, units, float);
    }
    const localThis = this.local();
    const localInput = dayjs2(input).local();
    return oldDiff.call(localThis, localInput, units, float);
  };
};

// src/plugin/weekOfYear/index.js
var weekOfYear_default = (o, c, d) => {
  const proto2 = c.prototype;
  proto2.week = function(week = null) {
    if (week !== null) {
      return this.add((week - this.week()) * 7, D);
    }
    const yearStart = this.$locale().yearStart || 1;
    if (this.month() === 11 && this.date() > 25) {
      const nextYearStartDay = d(this).startOf(Y).add(1, Y).date(yearStart);
      const thisEndOfWeek = d(this).endOf(W);
      if (nextYearStartDay.isBefore(thisEndOfWeek)) {
        return 1;
      }
    }
    const yearStartDay = d(this).startOf(Y).date(yearStart);
    const yearStartWeek = yearStartDay.startOf(W).subtract(1, MS);
    const diffInWeek = this.diff(yearStartWeek, W, true);
    if (diffInWeek < 0) {
      return d(this).startOf("week").week();
    }
    return Math.ceil(diffInWeek);
  };
  proto2.weeks = function(week = null) {
    return this.week(week);
  };
};

// src/plugin/weekYear/index.js
var weekYear_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.weekYear = function() {
    const month = this.month();
    const weekOfYear = this.week();
    const year = this.year();
    if (weekOfYear === 1 && month === 11) {
      return year + 1;
    }
    if (month === 0 && weekOfYear >= 52) {
      return year - 1;
    }
    return year;
  };
};

// src/plugin/weekday/index.js
var weekday_default = (o, c) => {
  const proto2 = c.prototype;
  proto2.weekday = function(input) {
    const weekStart = this.$locale().weekStart || 0;
    const { $W } = this;
    const weekday = ($W < weekStart ? $W + 7 : $W) - weekStart;
    if (this.$utils().u(input)) {
      return weekday;
    }
    return this.subtract(weekday, "day").add(input, "day");
  };
};

// src/entry.js
for (const key in plugin_exports) {
  src_default.extend(plugin_exports[key]);
}
var entry_default = src_default;
export {
  advancedFormat_default as advancedFormat,
  arraySupport_default as arraySupport,
  badMutable_default as badMutable,
  bigIntSupport_default as bigIntSupport,
  buddhistEra_default as buddhistEra,
  calendar_default as calendar,
  customParseFormat_default as customParseFormat,
  dayOfYear_default as dayOfYear,
  entry_default as default,
  devHelper_default as devHelper,
  duration_default as duration,
  isBetween_default as isBetween,
  isLeapYear_default as isLeapYear,
  isMoment_default as isMoment,
  isSameOrAfter_default as isSameOrAfter,
  isSameOrBefore_default as isSameOrBefore,
  isToday_default as isToday,
  isTomorrow_default as isTomorrow,
  isYesterday_default as isYesterday,
  isoWeek_default as isoWeek,
  isoWeeksInYear_default as isoWeeksInYear,
  localeData_default as localeData,
  localizedFormat_default as localizedFormat,
  minMax_default as minMax,
  objectSupport_default as objectSupport,
  pluralGetSet_default as pluralGetSet,
  preParsePostFormat_default as preParsePostFormat,
  quarterOfYear_default as quarterOfYear,
  relativeTime_default as relativeTime,
  timezone_default as timezone,
  toArray_default as toArray,
  toObject_default as toObject,
  updateLocale_default as updateLocale,
  utc_default as utc,
  weekOfYear_default as weekOfYear,
  weekYear_default as weekYear,
  weekday_default as weekday
};
//# sourceMappingURL=dayjs.plugin.js.map
