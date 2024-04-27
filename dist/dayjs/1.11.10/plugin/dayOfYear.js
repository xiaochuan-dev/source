(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_dayOfYear=f());})(this,(function(){'use strict';var index = (o, c, d) => {
  const proto = c.prototype;
  proto.dayOfYear = function (input) {
    // d(this) is for badMutable
    const dayOfYear = Math.round((d(this).startOf('day') - d(this).startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add(input - dayOfYear, 'day')
  };
};return index;}));//# sourceMappingURL=dayOfYear.js.map
