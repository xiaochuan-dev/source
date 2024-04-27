(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_ht=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Haitian Creole (Haiti) [ht]

const locale = {
  name: 'ht',
  weekdays: 'dimanch_lendi_madi_mèkredi_jedi_vandredi_samdi'.split('_'),
  months: 'janvye_fevriye_mas_avril_me_jen_jiyè_out_septanm_oktòb_novanm_desanm'.split('_'),
  weekdaysShort: 'dim._len._mad._mèk._jed._van._sam.'.split('_'),
  monthsShort: 'jan._fev._mas_avr._me_jen_jiyè._out_sept._okt._nov._des.'.split('_'),
  weekdaysMin: 'di_le_ma_mè_je_va_sa'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  relativeTime: {
    future: 'nan %s',
    past: 'sa gen %s',
    s: 'kèk segond',
    m: 'yon minit',
    mm: '%d minit',
    h: 'inèdtan',
    hh: '%d zè',
    d: 'yon jou',
    dd: '%d jou',
    M: 'yon mwa',
    MM: '%d mwa',
    y: 'yon ane',
    yy: '%d ane'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=ht.js.map
