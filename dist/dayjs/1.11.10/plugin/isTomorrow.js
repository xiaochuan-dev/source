(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isTomorrow=f());})(this,(function(){'use strict';var index = (o, c, d) => {
  const proto = c.prototype;
  proto.isTomorrow = function () {
    const comparisonTemplate = 'YYYY-MM-DD';
    const tomorrow = d().add(1, 'day');

    return (
      this.format(comparisonTemplate) === tomorrow.format(comparisonTemplate)
    )
  };
};return index;}));//# sourceMappingURL=isTomorrow.js.map
