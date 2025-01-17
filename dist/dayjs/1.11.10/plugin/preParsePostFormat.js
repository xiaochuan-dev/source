(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_preParsePostFormat=f());})(this,(function(){'use strict';// Plugin template from https://day.js.org/docs/en/plugin/plugin
var index = (option, dayjsClass) => {
  const oldParse = dayjsClass.prototype.parse;
  dayjsClass.prototype.parse = function (cfg) {
    if (typeof cfg.date === 'string') {
      const locale = this.$locale();
      cfg.date =
        locale && locale.preparse ? locale.preparse(cfg.date) : cfg.date;
    }
    // original parse result
    return oldParse.bind(this)(cfg)
  };

  // // overriding existing API
  // // e.g. extend dayjs().format()
  const oldFormat = dayjsClass.prototype.format;
  dayjsClass.prototype.format = function (...args) {
    // original format result
    const result = oldFormat.call(this, ...args);
    // return modified result
    const locale = this.$locale();
    return locale && locale.postformat ? locale.postformat(result) : result
  };

  const oldFromTo = dayjsClass.prototype.fromToBase;

  if (oldFromTo) {
    dayjsClass.prototype.fromToBase = function (
      input,
      withoutSuffix,
      instance,
      isFrom
    ) {
      const locale = this.$locale() || instance.$locale();

      // original format result
      return oldFromTo.call(
        this,
        input,
        withoutSuffix,
        instance,
        isFrom,
        locale && locale.postformat
      )
    };
  }
};return index;}));//# sourceMappingURL=preParsePostFormat.js.map
