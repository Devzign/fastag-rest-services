const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activatedFastTagSchema = new Schema({
    SRNo: {
        type: String,
        required: true
    },
    TagID: {
        type: String,
        required: true
    },
    ClassID: {
        type: String,
        required: true
    },
    SystemID: {
        type: String,
        required: true
    },
    ProviderID: {
        type: String,
        required: true
    },
    AgentCode: {
        type: String
    },
    AgentFirstName: {
        type: String
    },
    AgentLastName: {
        type: String
    },
    Activated: {
        type:Boolean,
        default: false
    },
    ActivateDetails: {
        ActivateTime:{
            type:String,
            default:null
        },
        ActivateDate:{
            type:String,
            default:null
        },
        CustomerName: {
            type: String,
            default: null
        },
        CustomerNumber: {
            type: Number,
            default: null
        },
        VehicalNumber: {
            type: String,
            default: null
        },
        EarnMoney:{
            type:Number,
            default:0
        }
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model('activatedfastag', activatedFastTagSchema);