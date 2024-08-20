const mongoose = require('mongoose');
const ActivityLogDetails = require('./logActivitySchema')

module.exports = (newActivity) => {
    return new Promise((resolve, reject) => {
        ActivityLogDetails(newActivity).save().then((r) => resolve(r)).catch(e => reject(e));
    });
}