const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = Schema({
    Phone:{
        type:String,
        require:true
    },
    Otp:{
        type:Number,
        require:true
    }
},
{
    timestamps: true
});
module.exports = mongoose.model('otp', otpSchema);