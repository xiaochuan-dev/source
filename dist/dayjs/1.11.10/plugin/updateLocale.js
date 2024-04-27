(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_updateLocale=f());})(this,(function(){'use strict';var index = (option, Dayjs, dayjs) => {
  dayjs.updateLocale = function (locale, customConfig) {
    const localeList = dayjs.Ls;
    const localeConfig = localeList[locale];
    if (!localeConfig) return
    const customConfigKeys = customConfig ? Object.keys(customConfig) : [];
    customConfigKeys.forEach((c) => {
      localeConfig[c] = customConfig[c];
    });
    return localeConfig // eslint-disable-line consistent-return
  };
};return index;}));//# sourceMappingURL=updateLocale.js.map
