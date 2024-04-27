(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_weekday=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;
  proto.weekday = function (input) {
    const weekStart = this.$locale().weekStart || 0;
    const { $W } = this;
    const weekday = ($W < weekStart ? $W + 7 : $W) - weekStart;
    if (this.$utils().u(input)) {
      return weekday
    }
    return this.subtract(weekday, 'day').add(input, 'day')
  };
};return index;}));//# sourceMappingURL=weekday.js.map
