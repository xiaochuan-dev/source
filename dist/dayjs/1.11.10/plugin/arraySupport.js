(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_arraySupport=f());})(this,(function(){'use strict';var index = (o, c, dayjs) => {
  const proto = c.prototype;
  const parseDate = (cfg) => {
    const { date, utc } = cfg;
    if (Array.isArray(date)) {
      if (utc) {
        if (!date.length) {
          return new Date()
        }
        return new Date(Date.UTC.apply(null, date))
      }
      if (date.length === 1) {
        return dayjs(String(date[0])).toDate()
      }
      return new (Function.prototype.bind.apply(Date, [null].concat(date)))()
    }
    return date
  };

  const oldParse = proto.parse;
  proto.parse = function (cfg) {
    cfg.date = parseDate.bind(this)(cfg);
    oldParse.bind(this)(cfg);
  };
};return index;}));//# sourceMappingURL=arraySupport.js.map
