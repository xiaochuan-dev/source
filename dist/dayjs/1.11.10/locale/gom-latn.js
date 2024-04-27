(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_gom_latn=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Konkani Latin script [gom-latn]

const locale = {
  name: 'gom-latn',
  weekdays: "Aitar_Somar_Mongllar_Budvar_Brestar_Sukrar_Son'var".split('_'),
  months: 'Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr'.split('_'),
  weekStart: 1,
  weekdaysShort: 'Ait._Som._Mon._Bud._Bre._Suk._Son.'.split('_'),
  monthsShort: 'Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.'.split('_'),
  weekdaysMin: 'Ai_Sm_Mo_Bu_Br_Su_Sn'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'A h:mm [vazta]',
    LTS: 'A h:mm:ss [vazta]',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY A h:mm [vazta]',
    LLLL: 'dddd, MMMM[achea] Do, YYYY, A h:mm [vazta]',
    llll: 'ddd, D MMM YYYY, A h:mm [vazta]'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=gom-latn.js.map
