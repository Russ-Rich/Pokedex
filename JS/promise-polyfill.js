(function (global) {
	function MyPromise(executor) {
		if (!(this instanceof MyPromise)) throw new Error("Must use the new keyword");
		if (typeof executor !== "function") throw new Error("Executor must be a function");

		this.state = "pending";
		this.value = undefined;
		this.onFulfilled = [];
		this.onRejected = [];

		var self = this;

		function resolve(value) {
			if (self.state !== "pending") return;
			self.state = "fulfilled";
			self.value = value;
			self.onFulfilled.forEach(function (cb) {
				cb(value);
			});
		}

		function reject(reason) {
			if (self.state !== "pending") return;
			self.state = "rejected";
			self.value = reason;
			self.onRejected.forEach(function (cb) {
				cb(reason);
			});
		}

		try {
			executor(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}

	MyPromise.prototype.then = function (onFulfilled, onRejected) {
		var self = this;
		return new MyPromise(function (resolve, reject) {
			if (self.state === "pending") {
				self.onFulfilled.push(function (value) {
					try {
						resolve(onFulfilled(value));
					} catch (error) {
						reject(error);
					}
				});
				self.onRejected.push(function (reason) {
					try {
						reject(onRejected(reason));
					} catch (error) {
						reject(error);
					}
				});
			} else if (self.state === "fulfilled") {
				try {
					resolve(onFulfilled(self.value));
				} catch (error) {
					reject(error);
				}
			} else if (self.state === "rejected") {
				try {
					reject(onRejected(self.value));
				} catch (error) {
					reject(error);
				}
			}
		});
	};

	global.MyPromise = MyPromise;
})(typeof window !== "undefined" ? window : global);
