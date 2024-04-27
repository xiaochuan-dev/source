(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.dayjs_plugin_quarterOfYear=f());})(this,(function(){'use strict';const D = 'day';
const M = 'month';
const Q = 'quarter';var index = (o, c) => {
  const proto = c.prototype;
  proto.quarter = function (quarter) {
    if (!this.$utils().u(quarter)) {
      return this.month((this.month() % 3) + ((quarter - 1) * 3))
    }
    return Math.ceil((this.month() + 1) / 3)
  };

  const oldAdd = proto.add;
  proto.add = function (number, units) {
    number = Number(number); // eslint-disable-line no-param-reassign
    const unit = this.$utils().p(units);
    if (unit === Q) {
      return this.add(number * 3, M)
    }
    return oldAdd.bind(this)(number, units)
  };

  const oldStartOf = proto.startOf;
  proto.startOf = function (units, startOf) {
    const utils = this.$utils();
    const isStartOf = !utils.u(startOf) ? startOf : true;
    const unit = utils.p(units);
    if (unit === Q) {
      const quarter = this.quarter() - 1;
      return isStartOf ? this.month(quarter * 3)
        .startOf(M).startOf(D) :
        this.month((quarter * 3) + 2).endOf(M).endOf(D)
    }
    return oldStartOf.bind(this)(units, startOf)
  };
};return index;}));//# sourceMappingURL=quarterOfYear.js.map
