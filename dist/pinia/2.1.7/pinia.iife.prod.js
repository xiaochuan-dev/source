/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
var Pinia=function(t,e){"use strict";let n;const i=t=>n=t,o=Symbol();function s(t){return t&&"object"==typeof t&&"[object Object]"===Object.prototype.toString.call(t)&&"function"!=typeof t.toJSON}var r;t.MutationType=void 0,(r=t.MutationType||(t.MutationType={})).direct="direct",r.patchObject="patch object",r.patchFunction="patch function";const c="undefined"!=typeof window;const a=()=>{};function u(t,n,i,o=a){t.push(n);const s=()=>{const e=t.indexOf(n);e>-1&&(t.splice(e,1),o())};return!i&&e.getCurrentScope()&&e.onScopeDispose(s),s}function p(t,...e){t.slice().forEach((t=>{t(...e)}))}const f=t=>t();function h(t,n){t instanceof Map&&n instanceof Map&&n.forEach(((e,n)=>t.set(n,e))),t instanceof Set&&n instanceof Set&&n.forEach(t.add,t);for(const i in n){if(!n.hasOwnProperty(i))continue;const o=n[i],r=t[i];t[i]=s(r)&&s(o)&&t.hasOwnProperty(i)&&!e.isRef(o)&&!e.isReactive(o)?h(r,o):o}return t}const l=Symbol();const{assign:d}=Object;function y(n,o,r={},c,y,v){let $;const b=d({actions:{}},r),_={deep:!0};let j,S,O,g=[],m=[];const R=c.state.value[n];let P;function w(i){let o;j=S=!1,"function"==typeof i?(i(c.state.value[n]),o={type:t.MutationType.patchFunction,storeId:n,events:O}):(h(c.state.value[n],i),o={type:t.MutationType.patchObject,payload:i,storeId:n,events:O});const s=P=Symbol();e.nextTick().then((()=>{P===s&&(j=!0)})),S=!0,p(g,o,c.state.value[n])}v||R||(c.state.value[n]={}),e.ref({});const A=v?function(){const{state:t}=r,e=t?t():{};this.$patch((t=>{d(t,e)}))}:a;function M(t,e){return function(){i(c);const o=Array.from(arguments),s=[],r=[];let a;p(m,{args:o,name:t,store:T,after:function(t){s.push(t)},onError:function(t){r.push(t)}});try{a=e.apply(this&&this.$id===n?this:T,o)}catch(t){throw p(r,t),t}return a instanceof Promise?a.then((t=>(p(s,t),t))).catch((t=>(p(r,t),Promise.reject(t)))):(p(s,a),a)}}const k={_p:c,$id:n,$onAction:u.bind(null,m),$patch:w,$reset:A,$subscribe(i,o={}){const s=u(g,i,o.detached,(()=>r())),r=$.run((()=>e.watch((()=>c.state.value[n]),(e=>{("sync"===o.flush?S:j)&&i({storeId:n,type:t.MutationType.direct,events:O},e)}),d({},_,o))));return s},$dispose:function(){$.stop(),g=[],m=[],c._s.delete(n)}},T=e.reactive(k);c._s.set(n,T);const x=(c._a&&c._a.runWithContext||f)((()=>c._e.run((()=>($=e.effectScope()).run(o)))));for(const t in x){const i=x[t];if(e.isRef(i)&&(!e.isRef(C=i)||!C.effect)||e.isReactive(i))v||(!R||s(E=i)&&E.hasOwnProperty(l)||(e.isRef(i)?i.value=R[t]:h(i,R[t])),c.state.value[n][t]=i);else if("function"==typeof i){const e=M(t,i);x[t]=e,b.actions[t]=i}}var E,C;return d(T,x),d(e.toRaw(T),x),Object.defineProperty(T,"$state",{get:()=>c.state.value[n],set:t=>{w((e=>{d(e,t)}))}}),c._p.forEach((t=>{d(T,$.run((()=>t({store:T,app:c._a,pinia:c,options:b}))))})),R&&v&&r.hydrate&&r.hydrate(T.$state,R),j=!0,S=!0,T}let v="Store";function $(t,e){return Array.isArray(e)?e.reduce(((e,n)=>(e[n]=function(){return t(this.$pinia)[n]},e)),{}):Object.keys(e).reduce(((n,i)=>(n[i]=function(){const n=t(this.$pinia),o=e[i];return"function"==typeof o?o.call(this,n):n[o]},n)),{})}const b=$;return t.PiniaVuePlugin=function(t){t.mixin({beforeCreate(){const t=this.$options;if(t.pinia){const e=t.pinia;if(!this._provided){const t={};Object.defineProperty(this,"_provided",{get:()=>t,set:e=>Object.assign(t,e)})}this._provided[o]=e,this.$pinia||(this.$pinia=e),e._a=this,c&&i(e)}else!this.$pinia&&t.parent&&t.parent.$pinia&&(this.$pinia=t.parent.$pinia)},destroyed(){delete this._pStores}})},t.acceptHMRUpdate=function(t,e){return()=>{}},t.createPinia=function(){const t=e.effectScope(!0),n=t.run((()=>e.ref({})));let s=[],r=[];const c=e.markRaw({install(t){i(c),c._a=t,t.provide(o,c),t.config.globalProperties.$pinia=c,r.forEach((t=>s.push(t))),r=[]},use(t){return this._a?s.push(t):r.push(t),this},_p:s,_a:null,_e:t,_s:new Map,state:n});return c},t.defineStore=function(t,s,r){let c,a;const u="function"==typeof s;function p(t,r){const p=e.hasInjectionContext();(t=t||(p?e.inject(o,null):null))&&i(t),(t=n)._s.has(c)||(u?y(c,s,a,t):function(t,n,o,s){const{state:r,actions:c,getters:a}=n,u=o.state.value[t];let p;p=y(t,(function(){u||(o.state.value[t]=r?r():{});const n=e.toRefs(o.state.value[t]);return d(n,c,Object.keys(a||{}).reduce(((n,s)=>(n[s]=e.markRaw(e.computed((()=>{i(o);const e=o._s.get(t);return a[s].call(e,e)}))),n)),{}))}),n,o,0,!0)}(c,a,t));return t._s.get(c)}return"string"==typeof t?(c=t,a=u?r:s):(a=t,c=t.id),p.$id=c,p},t.getActivePinia=()=>e.hasInjectionContext()&&e.inject(o)||n,t.mapActions=function(t,e){return Array.isArray(e)?e.reduce(((e,n)=>(e[n]=function(...e){return t(this.$pinia)[n](...e)},e)),{}):Object.keys(e).reduce(((n,i)=>(n[i]=function(...n){return t(this.$pinia)[e[i]](...n)},n)),{})},t.mapGetters=b,t.mapState=$,t.mapStores=function(...t){return t.reduce(((t,e)=>(t[e.$id+v]=function(){return e(this.$pinia)},t)),{})},t.mapWritableState=function(t,e){return Array.isArray(e)?e.reduce(((e,n)=>(e[n]={get(){return t(this.$pinia)[n]},set(e){return t(this.$pinia)[n]=e}},e)),{}):Object.keys(e).reduce(((n,i)=>(n[i]={get(){return t(this.$pinia)[e[i]]},set(n){return t(this.$pinia)[e[i]]=n}},n)),{})},t.setActivePinia=i,t.setMapStoreSuffix=function(t){v=t},t.skipHydrate=function(t){return Object.defineProperty(t,l,{})},t.storeToRefs=function(t){{t=e.toRaw(t);const n={};for(const i in t){const o=t[i];(e.isRef(o)||e.isReactive(o))&&(n[i]=e.toRef(t,i))}return n}},t}({},Vue);
//# sourceMappingURL=pinia.iife.prod.js.map
