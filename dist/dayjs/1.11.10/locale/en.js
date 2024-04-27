(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_locale_en=f());})(this,(function(){'use strict';// English [en]
// We don't need weekdaysShort, weekdaysMin, monthsShort in en.js locale
var en = {
  name: 'en',
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  ordinal: (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `[${n}${(s[(v - 20) % 10] || s[v] || s[0])}]`
  }
};return en;}));//# sourceMappingURL=en.js.map
