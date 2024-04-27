(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_weekOfYear=f());})(this,(function(){'use strict';// English locales
const MS = 'millisecond';
const D = 'day';
const W = 'week';
const Y = 'year';var index = (o, c, d) => {
  const proto = c.prototype;
  proto.week = function (week = null) {
    if (week !== null) {
      return this.add((week - this.week()) * 7, D)
    }
    const yearStart = this.$locale().yearStart || 1;
    if (this.month() === 11 && this.date() > 25) {
      // d(this) is for badMutable
      const nextYearStartDay = d(this).startOf(Y).add(1, Y).date(yearStart);
      const thisEndOfWeek = d(this).endOf(W);
      if (nextYearStartDay.isBefore(thisEndOfWeek)) {
        return 1
      }
    }
    const yearStartDay = d(this).startOf(Y).date(yearStart);
    const yearStartWeek = yearStartDay.startOf(W).subtract(1, MS);
    const diffInWeek = this.diff(yearStartWeek, W, true);
    if (diffInWeek < 0) {
      return d(this).startOf('week').week()
    }
    return Math.ceil(diffInWeek)
  };

  proto.weeks = function (week = null) {
    return this.week(week)
  };
};return index;}));//# sourceMappingURL=weekOfYear.js.map
