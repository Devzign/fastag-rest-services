const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({

    FirstName: {
        type: String,
        required: false
    },
    LastName: {
        type: String,
        required: false
    },
    Email: {
        type: String,
        required: false
    },
    MobileNumber: {
        type: Number,
        required: true,
        unique: true
    },
    OTP: {
        type: Number,
    },
    OTPExpiration: {
        type: Date,
    },
    DateOfBirth: {
        type: String,
        required: false
    },
    Password: {
        type: String,
        required: true
    },
    TLId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teamlead',
        required: false
    },
    PlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plans',
        required: false,
        default: null
    },
    WalletPoints:{
        type:Number,
        default:0
    },
    Address: {
        type: String,
        required: false
    },
    City: {
        type: String,
        required: false,
    },
    Pincode: {
        type: Number,
        required: false,
    },
    State: {
        type: String,
        required: false,
    },
    TollName: {
        type: String,
        required: false
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teamlead',
        required: false
    },
    Type: {
        type: String,
        enum: ['user', 'agent'],
        default: 'user',
        required: false
    },
    AgentCode: {
        type: String,
        required: false
    },
    BankDetails: {
        AccountNumber: {
            type: Number,
            default: 0
        },
        IfscCode: {
            type: String,
            default: ""
        },
        AccountHolderName: {
            type: String,
            default: ""
        },
        BranchName: {
            type: String,
            default: ""
        },
        AccountType: {
            type: String,
            default: ""
        }
    },
    AadhaarNumber: {
        type: Number,
        default: 0
    },
    PanNumber: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);
