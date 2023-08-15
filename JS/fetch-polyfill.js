(function (global) {
	"use strict";

	if (global.fetch) {
		return;
	}

	function normalizeName(name) {
		if (typeof name !== "string") {
			name = String(name);
		}
		if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
			throw new TypeError("Invalid character in header field name");
		}
		return name.toLowerCase();
	}

	function Headers(headers) {
		this.map = {};

		if (headers instanceof Headers) {
			headers.forEach(function (value, name) {
				this.append(name, value);
			}, this);
		} else if (headers) {
			Object.getOwnPropertyNames(headers).forEach(function (name) {
				this.append(name, headers[name]);
			}, this);
		}
	}

	Headers.prototype.append = function (name, value) {
		name = normalizeName(name);
		var oldValue = this.map[name];
		this.map[name] = oldValue ? oldValue + ", " + value : value;
	};

	Headers.prototype["delete"] = function (name) {
		delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function (name) {
		name = normalizeName(name);
		return this.map.hasOwnProperty(name) ? this.map[name] : null;
	};

	Headers.prototype.has = function (name) {
		return this.map.hasOwnProperty(normalizeName(name));
	};

	Headers.prototype.set = function (name, value) {
		this.map[normalizeName(name)] = value;
	};

	function fetch(url, options) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			var headers = new Headers(options.headers);

			xhr.open(options.method || "GET", url, true);

			xhr.onload = function () {
				var status = xhr.status === 1223 ? 204 : xhr.status;

				if (status < 100 || status > 599) {
					reject(new TypeError("Network request failed"));
					return;
				}

				var options = {
					status: status,
					statusText: xhr.statusText,
					headers: parseHeaders(xhr.getAllResponseHeaders()),
				};

				resolve(new Response(xhr.responseText, options));
			};

			xhr.onerror = function () {
				reject(new TypeError("Network request failed"));
			};

			headers.forEach(function (value, name) {
				xhr.setRequestHeader(name, value);
			});

			xhr.send(options.body);
		});
	}

	function Response(body, options) {
		this.body = body;
		this.status = options.status;
		this.statusText = options.statusText;
		this.headers = options.headers;
	}

	global.fetch = fetch;
	global.Headers = Headers;
})(typeof self !== "undefined" ? self : this);
