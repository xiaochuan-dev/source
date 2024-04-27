(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_bigIntSupport=f());})(this,(function(){'use strict';// eslint-disable-next-line valid-typeof
const isBigInt = num => typeof num === 'bigint';
var index = (o, c, dayjs) => {
  const proto = c.prototype;
  const parseDate = (cfg) => {
    const { date } = cfg;
    if (isBigInt(date)) {
      return Number(date)
    }
    return date
  };

  const oldParse = proto.parse;
  proto.parse = function (cfg) {
    cfg.date = parseDate.bind(this)(cfg);
    oldParse.bind(this)(cfg);
  };


  const oldUnix = dayjs.unix;
  dayjs.unix = function (timestamp) {
    const ts = isBigInt(timestamp) ? Number(timestamp) : timestamp;
    return oldUnix(ts)
  };
};return index;}));//# sourceMappingURL=bigIntSupport.js.map
