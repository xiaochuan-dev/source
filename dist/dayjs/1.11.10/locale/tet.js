(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_tet=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Tetun Dili (East Timor) [tet]

const locale = {
  name: 'tet',
  weekdays: 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu'.split('_'),
  months: 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juñu_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
  weekStart: 1,
  weekdaysShort: 'Dom_Seg_Ters_Kua_Kint_Sest_Sab'.split('_'),
  monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
  weekdaysMin: 'Do_Seg_Te_Ku_Ki_Ses_Sa'.split('_'),
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
    future: 'iha %s',
    past: '%s liuba',
    s: 'minutu balun',
    m: 'minutu ida',
    mm: 'minutu %d',
    h: 'oras ida',
    hh: 'oras %d',
    d: 'loron ida',
    dd: 'loron %d',
    M: 'fulan ida',
    MM: 'fulan %d',
    y: 'tinan ida',
    yy: 'tinan %d'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=tet.js.map
