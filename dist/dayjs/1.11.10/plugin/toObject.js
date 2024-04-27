(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_toObject=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;
  proto.toObject = function () {
    return {
      years: this.$y,
      months: this.$M,
      date: this.$D,
      hours: this.$H,
      minutes: this.$m,
      seconds: this.$s,
      milliseconds: this.$ms
    }
  };
};return index;}));//# sourceMappingURL=toObject.js.map
