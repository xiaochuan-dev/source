(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isToday=f());})(this,(function(){'use strict';var index = (o, c, d) => {
  const proto = c.prototype;
  proto.isToday = function () {
    const comparisonTemplate = 'YYYY-MM-DD';
    const now = d();

    return this.format(comparisonTemplate) === now.format(comparisonTemplate)
  };
};return index;}));//# sourceMappingURL=isToday.js.map
