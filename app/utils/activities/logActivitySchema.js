const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppLog = Schema({
  moduleID:{
    type:Schema.Types.ObjectId,
  },
  activityLogModuleName: {
    type:String
  },
  actionLogType: {
      type: String
  },
  createdBy: {
    type: String
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
});
module.exports = mongoose.model('logActivities', AppLog);
