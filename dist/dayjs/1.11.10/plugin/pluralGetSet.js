(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_pluralGetSet=f());})(this,(function(){'use strict';var index = (o, c) => {
  const proto = c.prototype;

  const pluralAliases = [
    'milliseconds',
    'seconds',
    'minutes',
    'hours',
    'days',
    'weeks',
    'isoWeeks',
    'months',
    'quarters',
    'years',
    'dates'
  ];

  pluralAliases.forEach((alias) => {
    proto[alias] = proto[alias.replace(/s$/, '')];
  });
};return index;}));//# sourceMappingURL=pluralGetSet.js.map
