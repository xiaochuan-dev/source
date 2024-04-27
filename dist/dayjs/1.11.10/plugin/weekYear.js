(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_weekYear=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;
  proto.weekYear = function () {
    const month = this.month();
    const weekOfYear = this.week();
    const year = this.year();
    if (weekOfYear === 1 && month === 11) {
      return year + 1
    }
    if (month === 0 && weekOfYear >= 52) {
      return year - 1
    }
    return year
  };
};return index;}));//# sourceMappingURL=weekYear.js.map
