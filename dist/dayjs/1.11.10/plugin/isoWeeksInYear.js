(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isoWeeksInYear=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;
  proto.isoWeeksInYear = function () {
    const isLeapYear = this.isLeapYear();
    const last = this.endOf('y');
    const day = last.day();
    if (day === 4 || (isLeapYear && day === 5)) {
      return 53
    }
    return 52
  };
};return index;}));//# sourceMappingURL=isoWeeksInYear.js.map
