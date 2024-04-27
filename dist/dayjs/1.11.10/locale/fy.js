(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_fy=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Frisian [fy]

const locale = {
  name: 'fy',
  weekdays: 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
  months: 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
  monthsShort: 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_'),
  weekStart: 1,
  weekdaysShort: 'si._mo._ti._wo._to._fr._so.'.split('_'),
  weekdaysMin: 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  relativeTime: {
    future: 'oer %s',
    past: '%s lyn',
    s: 'in pear sekonden',
    m: 'ien minút',
    mm: '%d minuten',
    h: 'ien oere',
    hh: '%d oeren',
    d: 'ien dei',
    dd: '%d dagen',
    M: 'ien moanne',
    MM: '%d moannen',
    y: 'ien jier',
    yy: '%d jierren'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=fy.js.map
