// Fallbacks for newer JavaScript features the admin (Sveltia CMS) uses, so it also works in
// older Safari / iPad versions. Each one is added only when the browser does not have it.
(function () {
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  if (!Uint8Array.prototype.toBase64) {
    Object.defineProperty(Uint8Array.prototype, 'toBase64', {
      configurable: true, writable: true,
      value: function (options) {
        var abc = options && options.alphabet === 'base64url' ? B64URL : B64;
        var pad = !(options && options.omitPadding);
        var out = '', i = 0, n = this.length;
        for (; i + 2 < n; i += 3) {
          var x = (this[i] << 16) | (this[i + 1] << 8) | this[i + 2];
          out += abc[x >> 18 & 63] + abc[x >> 12 & 63] + abc[x >> 6 & 63] + abc[x & 63];
        }
        if (n - i === 1) {
          var y = this[i] << 16;
          out += abc[y >> 18 & 63] + abc[y >> 12 & 63] + (pad ? '==' : '');
        } else if (n - i === 2) {
          var z = (this[i] << 16) | (this[i + 1] << 8);
          out += abc[z >> 18 & 63] + abc[z >> 12 & 63] + abc[z >> 6 & 63] + (pad ? '=' : '');
        }
        return out;
      },
    });
  }

  if (!Uint8Array.fromBase64) {
    Object.defineProperty(Uint8Array, 'fromBase64', {
      configurable: true, writable: true,
      value: function (str, options) {
        var s = String(str).replace(/\s+/g, '');
        if (options && options.alphabet === 'base64url') s = s.replace(/-/g, '+').replace(/_/g, '/');
        s = s.replace(/=+$/, '');
        var bin = atob(s + '==='.slice((s.length + 3) % 4));
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
      },
    });
  }

  if (!Promise.withResolvers) {
    Promise.withResolvers = function () {
      var resolve, reject;
      var promise = new Promise(function (res, rej) { resolve = res; reject = rej; });
      return { promise: promise, resolve: resolve, reject: reject };
    };
  }

  var groupInto = function (items, fn, add) {
    var i = 0;
    for (var item of items) add(fn(item, i++), item);
  };
  if (!Object.groupBy) {
    Object.groupBy = function (items, fn) {
      var out = Object.create(null);
      groupInto(items, fn, function (k, v) { (out[k] = out[k] || []).push(v); });
      return out;
    };
  }
  if (!Map.groupBy) {
    Map.groupBy = function (items, fn) {
      var out = new Map();
      groupInto(items, fn, function (k, v) { if (!out.has(k)) out.set(k, []); out.get(k).push(v); });
      return out;
    };
  }

  var setMethod = function (name, fn) {
    if (!Set.prototype[name]) Object.defineProperty(Set.prototype, name, { configurable: true, writable: true, value: fn });
  };
  setMethod('union', function (other) { var r = new Set(this); other.forEach(function (v) { r.add(v); }); return r; });
  setMethod('intersection', function (other) { var r = new Set(); this.forEach(function (v) { if (other.has(v)) r.add(v); }); return r; });
  setMethod('difference', function (other) { var r = new Set(); this.forEach(function (v) { if (!other.has(v)) r.add(v); }); return r; });
})();
