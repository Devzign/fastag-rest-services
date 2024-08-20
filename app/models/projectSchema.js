const mongoose = require('mongoose');
const { Schema } = mongoose;

const benefitSchema = new Schema({
    title: String,
    amount: Number
});

const offerPointSchema = new Schema({
    point: String,
});

const projectSchema = new Schema({
    ProjectName: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    ImageURL: {
        type: String,
        required: false
    },
    Status: {
        type: String,
        enum: ['Recommended','Active', 'ProjectonHold', null],
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Earn: {
        type: String,
        required: true
    },
    OfferPoints: {
        type: [offerPointSchema],
        required: true
    },
    Benefits: {
        type: [benefitSchema], // Change the type to an array of objects
        required: true
    },
    ShareLink: {
        type: String,
        required: true
    },
    // AddCustomer: {
    //     type: Boolean,
    //     required: false,
    //     default: false
    // },
    BestProjectToEarning:{
        type:Boolean,
        default:false
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
