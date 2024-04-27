(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_localizedFormat=f());})(this,(function(){'use strict';const FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ';// eslint-disable-next-line import/prefer-default-export
const t = format =>
  format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (_, a, b) => a || b.slice(1));

const englishFormats = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A'
};

const u = (formatStr, formats) => formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (_, a, b) => {
  const B = b && b.toUpperCase();
  return a || formats[b] || englishFormats[b] || t(formats[B])
});var index = (o, c, d) => {
  const proto = c.prototype;
  const oldFormat = proto.format;

  d.en.formats = englishFormats;
  proto.format = function (formatStr = FORMAT_DEFAULT) {
    const { formats = {} } = this.$locale();
    const result = u(formatStr, formats);
    return oldFormat.call(this, result)
  };
};return index;}));//# sourceMappingURL=localizedFormat.js.map
