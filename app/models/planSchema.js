const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    PlanName: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('plan', planSchema);