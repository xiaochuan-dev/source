(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_bi=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Bislama [bi]

const locale = {
  name: 'bi',
  weekdays: 'Sande_Mande_Tusde_Wenesde_Tosde_Fraede_Sarade'.split('_'),
  months: 'Januari_Februari_Maj_Eprel_Mei_Jun_Julae_Okis_Septemba_Oktoba_Novemba_Disemba'.split('_'),
  weekStart: 1,
  weekdaysShort: 'San_Man_Tus_Wen_Tos_Frae_Sar'.split('_'),
  monthsShort: 'Jan_Feb_Maj_Epr_Mai_Jun_Jul_Oki_Sep_Okt_Nov_Dis'.split('_'),
  weekdaysMin: 'San_Ma_Tu_We_To_Fr_Sar'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY h:mm A',
    LLLL: 'dddd, D MMMM YYYY h:mm A'
  },
  relativeTime: {
    future: 'lo %s',
    past: '%s bifo',
    s: 'sam seken',
    m: 'wan minit',
    mm: '%d minit',
    h: 'wan haoa',
    hh: '%d haoa',
    d: 'wan dei',
    dd: '%d dei',
    M: 'wan manis',
    MM: '%d manis',
    y: 'wan yia',
    yy: '%d yia'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=bi.js.map
