(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isSameOrBefore=f());})(this,(function(){'use strict';var index = (o, c) => {
  c.prototype.isSameOrBefore = function (that, units) {
    return this.isSame(that, units) || this.isBefore(that, units)
  };
};return index;}));//# sourceMappingURL=isSameOrBefore.js.map
