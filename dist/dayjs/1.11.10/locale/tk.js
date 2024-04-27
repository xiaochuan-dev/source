(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_tk=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Turkmen [tk]

const locale = {
  name: 'tk',
  weekdays: 'Ýekşenbe_Duşenbe_Sişenbe_Çarşenbe_Penşenbe_Anna_Şenbe'.split('_'),
  weekdaysShort: 'Ýek_Duş_Siş_Çar_Pen_Ann_Şen'.split('_'),
  weekdaysMin: 'Ýk_Dş_Sş_Çr_Pn_An_Şn'.split('_'),
  months: 'Ýanwar_Fewral_Mart_Aprel_Maý_Iýun_Iýul_Awgust_Sentýabr_Oktýabr_Noýabr_Dekabr'.split('_'),
  monthsShort: 'Ýan_Few_Mar_Apr_Maý_Iýn_Iýl_Awg_Sen_Okt_Noý_Dek'.split('_'),
  weekStart: 1,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD.MM.YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  relativeTime: {
    future: '%s soň',
    past: '%s öň',
    s: 'birnäçe sekunt',
    m: 'bir minut',
    mm: '%d minut',
    h: 'bir sagat',
    hh: '%d sagat',
    d: 'bir gün',
    dd: '%d gün',
    M: 'bir aý',
    MM: '%d aý',
    y: 'bir ýyl',
    yy: '%d ýyl'
  },
  ordinal: n => `${n}.`
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=tk.js.map
