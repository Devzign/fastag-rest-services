const mongoose = require('mongoose');

const teamLeadSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        // required: true
    },
    LastName: {
        type: String,
        // required: true
    },
    MobileNumber: {
        type: Number,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
        minlength: 6,
    },
    Address: {
        type: String,
    },
    State: {
        type: String,
    },
    City: {
        type: String,
    },
    AdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    BankDetails: {
        AccountNumber: {
            type: Number,
        },
        IfscCode: {
            type: String
        },
        AccountHolderName: {
            type: String
        },
        BranchName: {
            type: String
        },
        AccountType: {
            type: String
        }
    },
    AadhaarNumber: {
        type: Number
    },
    PanNumber: {
        type: String
    },
    Permissions: [],
}, {
    timestamps: true
});

module.exports = mongoose.model('TeamLead', teamLeadSchema);
