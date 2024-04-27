(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_toArray=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;
  proto.toArray = function () {
    return [
      this.$y,
      this.$M,
      this.$D,
      this.$H,
      this.$m,
      this.$s,
      this.$ms
    ]
  };
};return index;}));//# sourceMappingURL=toArray.js.map
