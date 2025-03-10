(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_relativeTime=f());})(this,(function(){'use strict';const S = 'second';
const MIN = 'minute';
const H = 'hour';
const D = 'day';
const M = 'month';
const Y = 'year';var index = (o, c, d) => {
  o = o || {};
  const proto = c.prototype;
  const relObj = {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  };
  d.en.relativeTime = relObj;
  proto.fromToBase = (input, withoutSuffix, instance, isFrom, postFormat) => {
    const loc = instance.$locale().relativeTime || relObj;
    const T = o.thresholds || [
      { l: 's', r: 44, d: S },
      { l: 'm', r: 89 },
      { l: 'mm', r: 44, d: MIN },
      { l: 'h', r: 89 },
      { l: 'hh', r: 21, d: H },
      { l: 'd', r: 35 },
      { l: 'dd', r: 25, d: D },
      { l: 'M', r: 45 },
      { l: 'MM', r: 10, d: M },
      { l: 'y', r: 17 },
      { l: 'yy', d: Y }
    ];
    const Tl = T.length;
    let result;
    let out;
    let isFuture;

    for (let i = 0; i < Tl; i += 1) {
      let t = T[i];
      if (t.d) {
        result = isFrom
          ? d(input).diff(instance, t.d, true)
          : instance.diff(input, t.d, true);
      }
      let abs = (o.rounding || Math.round)(Math.abs(result));
      isFuture = result > 0;
      if (abs <= t.r || !t.r) {
        if (abs <= 1 && i > 0) t = T[i - 1]; // 1 minutes -> a minute, 0 seconds -> 0 second
        const format = loc[t.l];
        if (postFormat) {
          abs = postFormat(`${abs}`);
        }
        if (typeof format === 'string') {
          out = format.replace('%d', abs);
        } else {
          out = format(abs, withoutSuffix, t.l, isFuture);
        }
        break
      }
    }
    if (withoutSuffix) return out
    const pastOrFuture = isFuture ? loc.future : loc.past;
    if (typeof pastOrFuture === 'function') {
      return pastOrFuture(out)
    }
    return pastOrFuture.replace('%s', out)
  };

  function fromTo(input, withoutSuffix, instance, isFrom) {
    return proto.fromToBase(input, withoutSuffix, instance, isFrom)
  }

  proto.to = function (input, withoutSuffix) {
    return fromTo(input, withoutSuffix, this, true)
  };
  proto.from = function (input, withoutSuffix) {
    return fromTo(input, withoutSuffix, this)
  };

  const makeNow = thisDay => (thisDay.$u ? d.utc() : d());

  proto.toNow = function (withoutSuffix) {
    return this.to(makeNow(this), withoutSuffix)
  };
  proto.fromNow = function (withoutSuffix) {
    return this.from(makeNow(this), withoutSuffix)
  };
};return index;}));//# sourceMappingURL=relativeTime.js.map
