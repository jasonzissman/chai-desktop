const fs = require('fs').promises;
const ts = require("./timestamp-helper");

let logFilePromiseChain = Promise.resolve();

module.exports = {
    filename: "log.txt",
    setLogFilenameAndPath: function(newNameAndPath) {
        this.filename = newNameAndPath;
    },
    log: function(message) {
        let messageWithDate = ts.fullTimestamp() + " ::: " + message;
        console.log(messageWithDate);
        logFilePromiseChain = logFilePromiseChain.then(fs.appendFile(this.filename, messageWithDate + "\r\n"));
    }
};