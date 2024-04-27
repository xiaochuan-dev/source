(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_af=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Afrikaans [af]

const locale = {
  name: 'af',
  weekdays: 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
  months: 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
  weekStart: 1,
  weekdaysShort: 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
  monthsShort: 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
  weekdaysMin: 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  relativeTime: {
    future: 'oor %s',
    past: '%s gelede',
    s: "'n paar sekondes",
    m: "'n minuut",
    mm: '%d minute',
    h: "'n uur",
    hh: '%d ure',
    d: "'n dag",
    dd: '%d dae',
    M: "'n maand",
    MM: '%d maande',
    y: "'n jaar",
    yy: '%d jaar'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=af.js.map
