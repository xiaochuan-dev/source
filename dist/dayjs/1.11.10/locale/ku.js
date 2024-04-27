(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('dayjs')):typeof define==='function'&&define.amd?define(['exports','dayjs'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.dayjs_locale_ku={},g.dayjs));})(this,(function(exports,dayjs){'use strict';function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var dayjs__default=/*#__PURE__*/_interopDefaultLegacy(dayjs);// Kurdish [ku]

const englishToArabicNumbersMap = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
  9: '٩',
  0: '٠'
};

const arabicToEnglishNumbersMap = {
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0'
};

const months = [
  'کانوونی دووەم',
  'شوبات',
  'ئادار',
  'نیسان',
  'ئایار',
  'حوزەیران',
  'تەممووز',
  'ئاب',
  'ئەیلوول',
  'تشرینی یەکەم',
  'تشرینی دووەم',
  'کانوونی یەکەم'
];

const locale = {
  name: 'ku',
  months,
  monthsShort: months,
  weekdays: 'یەکشەممە_دووشەممە_سێشەممە_چوارشەممە_پێنجشەممە_هەینی_شەممە'.split('_'),
  weekdaysShort: 'یەکشەم_دووشەم_سێشەم_چوارشەم_پێنجشەم_هەینی_شەممە'.split('_'),
  weekStart: 6,
  weekdaysMin: 'ی_د_س_چ_پ_هـ_ش'.split('_'),
  preparse(string) {
    return string
      .replace(/[١٢٣٤٥٦٧٨٩٠]/g, match => arabicToEnglishNumbersMap[match])
      .replace(/،/g, ',')
  },
  postformat(string) {
    return string
      .replace(/\d/g, match => englishToArabicNumbersMap[match])
      .replace(/,/g, '،')
  },
  ordinal: n => n,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd, D MMMM YYYY HH:mm'
  },
  meridiem: hour => (hour < 12 ? 'پ.ن' : 'د.ن'),
  relativeTime: {
    future: 'لە %s',
    past: 'لەمەوپێش %s',
    s: 'چەند چرکەیەک',
    m: 'یەک خولەک',
    mm: '%d خولەک',
    h: 'یەک کاتژمێر',
    hh: '%d کاتژمێر',
    d: 'یەک ڕۆژ',
    dd: '%d ڕۆژ',
    M: 'یەک مانگ',
    MM: '%d مانگ',
    y: 'یەک ساڵ',
    yy: '%d ساڵ'
  }
};

dayjs__default["default"].locale(locale, null, true);exports["default"]=locale;exports.englishToArabicNumbersMap=englishToArabicNumbersMap;Object.defineProperty(exports,'__esModule',{value:true});}));//# sourceMappingURL=ku.js.map
