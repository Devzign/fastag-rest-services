const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    AgentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    WalletPoints: {
        type: Number,
        required: true,
        default: 0
    },
     CurrentPoints: {
        type: Number,
        default: 0
    },
    Type:{
        type:String,
        enum:['credit', 'debit'],
        required:true
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('wallets', walletSchema);