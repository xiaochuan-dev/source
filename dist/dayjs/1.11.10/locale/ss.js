(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_ss=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// siSwati [ss]

const locale = {
  name: 'ss',
  weekdays: 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
  months: "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
  weekStart: 1,
  weekdaysShort: 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
  monthsShort: 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
  weekdaysMin: 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
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
    future: 'nga %s',
    past: 'wenteka nga %s',
    s: 'emizuzwana lomcane',
    m: 'umzuzu',
    mm: '%d emizuzu',
    h: 'lihora',
    hh: '%d emahora',
    d: 'lilanga',
    dd: '%d emalanga',
    M: 'inyanga',
    MM: '%d tinyanga',
    y: 'umnyaka',
    yy: '%d iminyaka'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=ss.js.map
