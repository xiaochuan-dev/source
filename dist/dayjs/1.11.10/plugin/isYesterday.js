(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isYesterday=f());})(this,(function(){'use strict';var index = (o, c, d) => {
  const proto = c.prototype;
  proto.isYesterday = function () {
    const comparisonTemplate = 'YYYY-MM-DD';
    const yesterday = d().subtract(1, 'day');

    return (
      this.format(comparisonTemplate) === yesterday.format(comparisonTemplate)
    )
  };
};return index;}));//# sourceMappingURL=isYesterday.js.map
