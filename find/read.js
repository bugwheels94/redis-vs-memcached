var Benchmark = require("benchmark");
var Redis = require("redis");
var redis = Redis.createClient(6379, "redis");
var memjs = require('memjs')
var memcached = memjs.Client.create()

var suite = new Benchmark.Suite();
var i = 0;
setTimeout(_ => {
	suite
		.add("Memcached SET", {
			defer: true,
			fn: function(def) {
				memcached.set("hello" + i++, "HELLO", {}, function(err, result) {
					if (err) console.error(err);
					def.resolve();
				});
			}
		})
		.add("Redis SET", {
			defer: true,
			fn: function(def) {
				redis.set("hello" + i++, "HELLO", (e, r) => {
					def.resolve();
				});
			}
		})
		.add("Redis - GET", {
			defer: true,
			fn: function(def) {
				redis.get("hello5", (e, r) => {
					def.resolve();
				});
			}
		})
		.add("Memcached - GET", {
			defer: true,
			fn: function(def) {
				memcached.get("hello5", (e, r) => {
					def.resolve();
				});
			}
		})
		.on("cycle", function(event) {
			i = 0;
			console.log(String(event.target));
		})
		.on("complete", function() {
			redis.flushdb( function (err, succeeded) {
    		console.log("REDIS FLUSH", succeeded); // will be true if successfull
			});
			memcached.flush( function (err, succeeded) {
    		console.log("MEMCACHED FLUSH", succeeded); // will be true if successfull
			});
			console.log("Fastest is " + this.filter("fastest").map("name"));
		})
		.run({ async: true });
}, 3000);
