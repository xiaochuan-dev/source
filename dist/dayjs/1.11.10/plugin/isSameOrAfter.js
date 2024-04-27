(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isSameOrAfter=f());})(this,(function(){'use strict';var index = (o, c) => {
  c.prototype.isSameOrAfter = function (that, units) {
    return this.isSame(that, units) || this.isAfter(that, units)
  };
};return index;}));//# sourceMappingURL=isSameOrAfter.js.map
