(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('dayjs')):typeof define==='function'&&define.amd?define(['dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_lo=f(g.dayjs));})(this,(function(dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Lao [lo]

const locale = {
  name: 'lo',
  weekdays: 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
  months: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
  weekdaysShort: 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
  monthsShort: 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
  weekdaysMin: 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
  ordinal: n => n,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'ວັນdddd D MMMM YYYY HH:mm'
  },
  relativeTime: {
    future: 'ອີກ %s',
    past: '%sຜ່ານມາ',
    s: 'ບໍ່ເທົ່າໃດວິນາທີ',
    m: '1 ນາທີ',
    mm: '%d ນາທີ',
    h: '1 ຊົ່ວໂມງ',
    hh: '%d ຊົ່ວໂມງ',
    d: '1 ມື້',
    dd: '%d ມື້',
    M: '1 ເດືອນ',
    MM: '%d ເດືອນ',
    y: '1 ປີ',
    yy: '%d ປີ'
  }
};

dayjs__default["default"].locale(locale, null, true);return locale;}));//# sourceMappingURL=lo.js.map
