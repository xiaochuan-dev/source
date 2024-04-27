(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isBetween=f());})(this,(function(){'use strict';var index = (o, c, d) => {
  c.prototype.isBetween = function (a, b, u, i) {
    const dA = d(a);
    const dB = d(b);
    i = i || '()';
    const dAi = i[0] === '(';
    const dBi = i[1] === ')';

    return ((dAi ? this.isAfter(dA, u) : !this.isBefore(dA, u)) &&
           (dBi ? this.isBefore(dB, u) : !this.isAfter(dB, u)))
        || ((dAi ? this.isBefore(dA, u) : !this.isAfter(dA, u)) &&
           (dBi ? this.isAfter(dB, u) : !this.isBefore(dB, u)))
  };
};return index;}));//# sourceMappingURL=isBetween.js.map
