const debuglogger = require('./debug-logger')
const productionLogger = require('./production-logger')
let Log = null;

if (process.env.NODE_ENV != 'production') {
    Log = debuglogger();
}
if (process.env.NODE_ENV == 'production') {
    Log = productionLogger();
}
module.exports = Log;