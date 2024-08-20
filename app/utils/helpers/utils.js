const fs = require('fs');
module.exports = {
    btoa: function (str) {
        return Buffer.from(str).toString('base64')
    },
    atob: function (str) {
        return Buffer.from(str, 'base64').toString()
    },
    unsyncFile: function (fileName) {
        let filePath = 'temp/' + fileName;
        fs.unlinkSync(filePath);
    }
}