(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_ga=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Irish or Irish Gaelic [ga]

const locale = {
  name: 'ga',
  weekdays: 'Dé Domhnaigh_Dé Luain_Dé Máirt_Dé Céadaoin_Déardaoin_Dé hAoine_Dé Satharn'.split('_'),
  months: 'Eanáir_Feabhra_Márta_Aibreán_Bealtaine_Méitheamh_Iúil_Lúnasa_Meán Fómhair_Deaireadh Fómhair_Samhain_Nollaig'.split('_'),
  weekStart: 1,
  weekdaysShort: 'Dom_Lua_Mái_Céa_Déa_hAo_Sat'.split('_'),
  monthsShort: 'Eaná_Feab_Márt_Aibr_Beal_Méit_Iúil_Lúna_Meán_Deai_Samh_Noll'.split('_'),
  weekdaysMin: 'Do_Lu_Má_Ce_Dé_hA_Sa'.split('_'),
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
    future: 'i %s',
    past: '%s ó shin',
    s: 'cúpla soicind',
    m: 'nóiméad',
    mm: '%d nóiméad',
    h: 'uair an chloig',
    hh: '%d uair an chloig',
    d: 'lá',
    dd: '%d lá',
    M: 'mí',
    MM: '%d mí',
    y: 'bliain',
    yy: '%d bliain'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=ga.js.map
