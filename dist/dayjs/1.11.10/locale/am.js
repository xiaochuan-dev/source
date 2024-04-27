(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_am=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Amharic [am]

const locale = {
  name: 'am',
  weekdays: 'እሑድ_ሰኞ_ማክሰኞ_ረቡዕ_ሐሙስ_አርብ_ቅዳሜ'.split('_'),
  weekdaysShort: 'እሑድ_ሰኞ_ማክሰ_ረቡዕ_ሐሙስ_አርብ_ቅዳሜ'.split('_'),
  weekdaysMin: 'እሑ_ሰኞ_ማክ_ረቡ_ሐሙ_አር_ቅዳ'.split('_'),
  months: 'ጃንዋሪ_ፌብሯሪ_ማርች_ኤፕሪል_ሜይ_ጁን_ጁላይ_ኦገስት_ሴፕቴምበር_ኦክቶበር_ኖቬምበር_ዲሴምበር'.split('_'),
  monthsShort: 'ጃንዋ_ፌብሯ_ማርች_ኤፕሪ_ሜይ_ጁን_ጁላይ_ኦገስ_ሴፕቴ_ኦክቶ_ኖቬም_ዲሴም'.split('_'),
  weekStart: 1,
  yearStart: 4,
  relativeTime: {
    future: 'በ%s',
    past: '%s በፊት',
    s: 'ጥቂት ሰከንዶች',
    m: 'አንድ ደቂቃ',
    mm: '%d ደቂቃዎች',
    h: 'አንድ ሰዓት',
    hh: '%d ሰዓታት',
    d: 'አንድ ቀን',
    dd: '%d ቀናት',
    M: 'አንድ ወር',
    MM: '%d ወራት',
    y: 'አንድ ዓመት',
    yy: '%d ዓመታት'
  },
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'MMMM D ፣ YYYY',
    LLL: 'MMMM D ፣ YYYY HH:mm',
    LLLL: 'dddd ፣ MMMM D ፣ YYYY HH:mm'
  },
  ordinal: n => `${n}ኛ`
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=am.js.map
