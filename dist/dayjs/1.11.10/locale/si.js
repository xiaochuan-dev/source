(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_si=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Sinhalese [si]

const locale = {
  name: 'si',
  weekdays: 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
  months: 'දුරුතු_නවම්_මැදින්_බක්_වෙසක්_පොසොන්_ඇසළ_නිකිණි_බිනර_වප්_ඉල්_උඳුවප්'.split('_'),
  weekdaysShort: 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
  monthsShort: 'දුරු_නව_මැදි_බක්_වෙස_පොසො_ඇස_නිකි_බින_වප්_ඉල්_උඳු'.split('_'),
  weekdaysMin: 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'a h:mm',
    LTS: 'a h:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY MMMM D',
    LLL: 'YYYY MMMM D, a h:mm',
    LLLL: 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
  },
  relativeTime: {
    future: '%sකින්',
    past: '%sකට පෙර',
    s: 'තත්පර කිහිපය',
    m: 'විනාඩිය',
    mm: 'විනාඩි %d',
    h: 'පැය',
    hh: 'පැය %d',
    d: 'දිනය',
    dd: 'දින %d',
    M: 'මාසය',
    MM: 'මාස %d',
    y: 'වසර',
    yy: 'වසර %d'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=si.js.map
