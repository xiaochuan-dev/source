(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_isMoment=f());})(this,(function(){'use strict';var index = (o, c, f) => {
  f.isMoment = function (input) {
    return f.isDayjs(input)
  };
};return index;}));//# sourceMappingURL=isMoment.js.map
