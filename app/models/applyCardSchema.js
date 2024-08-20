const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const ApplySchema = new Schema({

    AgentId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    ProjectId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    FirstName:{
        type:String
    },
    LastName:{
        type:String
    },
    DOB:{
        type:Date
    },
    PanNumber:{
        type:String
    },
    AadhaarNumber:{
        type:String
    },
    Mobile:{
        type:String
    },
    Status: {
        type: String,
        enum: ['inprogress', 'approved', 'reject'], 
        required: false,
    },
    EarnedMoney:{
        type:String,
        required:false,
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('applycard', ApplySchema);