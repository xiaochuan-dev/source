(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_gd=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Scottish Gaelic [gd]

const locale = {
  name: 'gd',
  weekdays: 'Didòmhnaich_Diluain_Dimàirt_Diciadain_Diardaoin_Dihaoine_Disathairne'.split('_'),
  months: 'Am Faoilleach_An Gearran_Am Màrt_An Giblean_An Cèitean_An t-Ògmhios_An t-Iuchar_An Lùnastal_An t-Sultain_An Dàmhair_An t-Samhain_An Dùbhlachd'.split('_'),
  weekStart: 1,
  weekdaysShort: 'Did_Dil_Dim_Dic_Dia_Dih_Dis'.split('_'),
  monthsShort: 'Faoi_Gear_Màrt_Gibl_Cèit_Ògmh_Iuch_Lùn_Sult_Dàmh_Samh_Dùbh'.split('_'),
  weekdaysMin: 'Dò_Lu_Mà_Ci_Ar_Ha_Sa'.split('_'),
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
    future: 'ann an %s',
    past: 'bho chionn %s',
    s: 'beagan diogan',
    m: 'mionaid',
    mm: '%d mionaidean',
    h: 'uair',
    hh: '%d uairean',
    d: 'latha',
    dd: '%d latha',
    M: 'mìos',
    MM: '%d mìosan',
    y: 'bliadhna',
    yy: '%d bliadhna'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=gd.js.map
