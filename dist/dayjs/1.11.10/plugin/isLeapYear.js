(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isLeapYear=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;
  proto.isLeapYear = function () {
    return ((this.$y % 4 === 0) && (this.$y % 100 !== 0)) || (this.$y % 400 === 0)
  };
};return index;}));//# sourceMappingURL=isLeapYear.js.map
