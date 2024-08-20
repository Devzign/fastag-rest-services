const agentModel = require('../models/userSchema');
const TeamLead = require('../models/teamLeadSchema');
const __res_ = require("../utils/helpers/send-response");
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require("bcryptjs");
const keys = require('../utils/config/index');
const adminModel = require('../models/adminSchema');
const walletModel = require('../models/walletSchema');
const activatedFastagModel = require('../models/activatedFastagSchema');
const planModel = require('../models/planSchema');
const moment = require('moment-timezone');

function generateUniqueAgentCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
module.exports = {
    createAgent: async (req, res) => {
        try {
            const { FirstName, LastName, Email, MobileNumber, DateOfBirth, Address, City, Pincode, State, TollName, BankDetails, AadhaarNumber, PanNumber, Password } = req.body;

            const { tlId } = req.params;

            if (!MobileNumber || MobileNumber === null) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'MobileNumber is required and cannot be null',
                });
            }

            const existingTeamLead = await TeamLead.findById(tlId);
            if (!existingTeamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found!',
                });
            }

            const existingAgent = await agentModel.findOne({ $or: [{ Email }, { MobileNumber }] });
            if (existingAgent) {
                if (existingAgent.TLId && existingAgent.TLId.toString() !== tlId) {
                    return __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: 'Agent already part of another Team Lead!',
                    });
                } else {
                    return __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: 'Agent already exists!',
                    });
                }
            }

            async function checkUniqueAgentCode(AgentCode) {
                const agent = await agentModel.findOne({ AgentCode });

                if (!agent) {
                    return AgentCode;
                }
                return checkUniqueAgentCode(generateUniqueAgentCode())
            }

            const AgentCode = await checkUniqueAgentCode(generateUniqueAgentCode());

            const hashPassword = bcrypt.hashSync(Password, keys.saltRounds);

            const agent = new agentModel({
                FirstName,
                LastName,
                Email,
                MobileNumber,
                DateOfBirth,
                Address,
                City,
                State,
                Pincode,
                Password: hashPassword,
                CreatedBy: tlId,
                Type: 'agent',
                TLId: tlId,
                TollName,
                AgentCode,
                BankDetails,
                AadhaarNumber,
                PanNumber
            });

            await agent.save();

            const successMessage = 'Agent created successfully!';

            const { Password: agentHashPassword, ...agentDetails } = agent._doc;

            // await walletModel.create({
            //     AgentId: agentDetails._id,
            //     CreatedBy:agent._id,
            //     Type:'credit'
            // });

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: successMessage,
                data: agentDetails
            });

        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },

    getAllAgents: async (req, res) => {
        try {

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            const totalCount = await agentModel.countDocuments({ Type: 'agent' });

            const agents = await agentModel.aggregate([
                {
                    $match: {
                        Type: 'agent'
                    }
                },
                {
                    $lookup: {
                        from: 'teamleads',
                        localField: 'CreatedBy',
                        foreignField: '_id',
                        as: 'TeamLead'
                    }
                },
                {
                    $lookup: {
                        from: 'plans',
                        localField: 'PlanId',
                        foreignField: '_id',
                        as: 'plan'
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $project: {
                        FirstName: 1,
                        LastName: 1,
                        Email: 1,
                        MobileNumber: 1,
                        DateOfBirth: 1,
                        PlanId: 1,
                        TLId: 1,
                        Address: 1,
                        City: 1,
                        Pincode: 1,
                        State: 1,
                        TollName: 1,
                        CreatedBy: 1,
                        AgentCode: 1,
                        BankDetails: 1,
                        AadhaarNumber: 1,
                        WalletPoints: 1,
                        PanNumber: 1,
                        "TlFirstName": { $first: "$TeamLead.FirstName" },
                        "TlLastName": { $first: "$TeamLead.LastName" },
                        "PlanName": { $first: "$plan.PlanName" },
                    }
                },
                {
                    $skip: skipCount
                },
                {
                    $limit: pageSize
                }
            ]);
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agents retrieved successfully',
                data: {
                    totalRecords: totalCount,
                    currentPage: page,
                    pageSize: pageSize,
                    records: agents
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getAllAgentsNoPagination: async (req, res) => {
        try {
            const totalCount = await agentModel.countDocuments({ Type: 'agent' });

            const agents = await agentModel.aggregate([
                {
                    $match: {
                        Type: 'agent'
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: 'teamleads',
                        localField: 'CreatedBy',
                        foreignField: '_id',
                        as: 'TeamLead'
                    }
                },
                {
                    $lookup: {
                        from: 'plans',
                        localField: 'PlanId',
                        foreignField: '_id',
                        as: 'plan'
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $project: {
                        FirstName: 1,
                        LastName: 1,
                        Email: 1,
                        MobileNumber: 1,
                        DateOfBirth: 1,
                        PlanId: 1,
                        TLId: 1,
                        Address: 1,
                        City: 1,
                        Pincode: 1,
                        State: 1,
                        TollName: 1,
                        CreatedBy: 1,
                        WalletPoints: 1,
                        AgentCode: 1,
                        BankDetails: 1,
                        AadhaarNumber: 1,
                        PanNumber: 1,
                        "TlFirstName": { $first: "$TeamLead.FirstName" },
                        "TlLastName": { $first: "$TeamLead.LastName" },
                        "PlanName": { $first: "$plan.PlanName" },
                    }
                }
            ]);
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agents retrieved successfully',
                data: {
                    totalRecords: totalCount,
                    records: agents
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getAgentById: async (req, res) => {
        try {
            const agentId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(agentId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid agent ID',
                });
            }

            const id = new ObjectId(agentId);

            const agent = await agentModel.aggregate([
                {
                    $match: {
                        _id: id,
                        Type: 'agent'
                    }
                },
                {
                    $lookup: {
                        from: 'teamleads',
                        localField: 'CreatedBy',
                        foreignField: '_id',
                        as: 'TeamLead'
                    }
                },
                {
                    $lookup: {
                        from: 'plans',
                        localField: 'PlanId',
                        foreignField: '_id',
                        as: 'Plan'
                    }
                },
                {
                    $project: {
                        FirstName: 1,
                        LastName: 1,
                        Email: 1,
                        MobileNumber: 1,
                        DateOfBirth: 1,
                        TLId: 1,
                        Address: 1,
                        City: 1,
                        Pincode: 1,
                        State: 1,
                        TollName: 1,
                        CreatedBy: 1,
                        AgentCode: 1,
                        BankDetails: 1,
                        AadhaarNumber: 1,
                        PanNumber: 1,
                        "TlFirstName": { $first: "$TeamLead.FirstName" },
                        "TlLastName": { $first: "$TeamLead.LastName" },
                        "PlanName": { $first: "$Plan.PlanName" },
                        "PlanPrice": { $first: "$Plan.Price" },
                    }
                }
            ]);
            if (agent.length === 0) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found',
                });
            }
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agent retrieved successfully',
                data: agent[0],
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getAgentsByTLId: async (req, res) => {
        try {
            const { tlId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Team Lead ID',
                });
            }

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            // const totalCount = await agentModel.countDocuments({ Type: 'agent' });

            const teamLead = await TeamLead.findById(tlId);

            if (!teamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found',
                });
            }
            const TLId = new ObjectId(tlId);

            const agents = await agentModel.aggregate([
                {
                    $match: {
                        Type: 'agent',
                        TLId
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: 'teamleads',
                        localField: 'CreatedBy',
                        foreignField: '_id',
                        as: 'TeamLead'
                    }
                },
                {
                    $project: {
                        FirstName: 1,
                        LastName: 1,
                        Email: 1,
                        MobileNumber: 1,
                        DateOfBirth: 1,
                        TLId: 1,
                        Address: 1,
                        City: 1,
                        Pincode: 1,
                        State: 1,
                        TollName: 1,
                        CreatedBy: 1,
                        AgentCode: 1,
                        BankDetails: 1,
                        AadhaarNumber: 1,
                        PanNumber: 1,
                        "TlFirstName": { $first: "$TeamLead.FirstName" },
                        "TlLastName": { $first: "$TeamLead.LastName" }
                    }
                },
                {
                    $skip: skipCount
                },
                {
                    $limit: pageSize
                }
            ]);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agents retrieved successfully',
                data:
                {

                    records: agents
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getAgentsByTLIdNoPagination: async (req, res) => {
        try {
            const { tlId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Team Lead ID',
                });
            }

            const totalCount = await agentModel.countDocuments({ Type: 'agent' });

            const teamLead = await TeamLead.findById(tlId);

            if (!teamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found',
                });
            }
            const TLId = new ObjectId(tlId);

            const agents = await agentModel.aggregate([
                {
                    $match: {
                        Type: 'agent',
                        TLId
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $project: {
                        FirstName: 1,
                        LastName: 1
                    }
                }
            ]);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agents retrieved successfully',
                data:
                {
                    totalRecords: totalCount,
                    records: agents
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    updateAgentByAdminId: async (req, res) => {
        try {
            const { id, adminId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid agent ID',
                });
            }

            if (!mongoose.Types.ObjectId.isValid(adminId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid admin ID',
                });
            }

            const isAdminExist = await adminModel.findById(adminId);
            if (!isAdminExist) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Admin not found!',
                });
            }

            const existingAgent = await agentModel.findOne({ _id: id, Type: 'agent' }, { Password: 0 });
            if (!existingAgent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found.',
                });
            }

            const { Email, Password, Type, PlanId, ...updatedFields } = req.body;

            if (!PlanId || !ObjectId.isValid(PlanId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'PlanId is invalid',
                });
            }

            const isPlanExist = await planModel.findOne({
                _id: PlanId
            })

            if (!isPlanExist) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `PlanId is invalid.`,
                });
            }

            if (Email || Password) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Email and Password cannot be updated using this endpoint',
                });
            }

            if (Type && Type !== 'Agent' && Type !== 'Supervisor') {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Type. Type can only be "Agent" or "Supervisor".',
                });
            }

            Object.assign(existingAgent, { PlanId, ...updatedFields });
            await existingAgent.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agent updated successfully!',
                data: existingAgent,
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },

    deleteAgentByTLId: async (req, res) => {
        try {
            const { tlId, agentId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Team Lead ID',
                });
            }
            if (!mongoose.Types.ObjectId.isValid(agentId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Agent ID',
                });
            }
            const existingTeamLead = await TeamLead.findById(tlId);
            if (!existingTeamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found',
                });
            }
            const existingAgent = await agentModel.findOne({ _id: agentId, TLId: tlId });
            if (!existingAgent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found for this Team Lead',
                });
            }
            await agentModel.findByIdAndDelete(agentId);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agent deleted successfully',
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message,
            });
        }
    },
    makeUserAgentByTLId: async (req, res) => {
        try {
            const { tlId, userId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Team Lead ID',
                });
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid User ID',
                });
            }
            const existingTeamLead = await TeamLead.findById(tlId);
            if (!existingTeamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found',
                });
            }
            const existingUser = await agentModel.findById(userId);
            if (!existingUser) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'User not found',
                });
            }

            if (existingUser.Type === 'agent') {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Not eligible to update user to agent.',
                });
            }

            existingUser.Type = 'agent';
            existingUser.TLId = tlId;

            async function checkUniqueAgentCode(AgentCode) {
                const agent = await agentModel.findOne({ AgentCode });

                if (!agent) {
                    return AgentCode;
                }
                return checkUniqueAgentCode(generateUniqueAgentCode())
            }

            existingUser.AgentCode = await checkUniqueAgentCode(generateUniqueAgentCode());

            await existingUser.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'User successfully updated to agent',
                data: existingUser,
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message,
            });
        }
    },
    // updateUserById: async (req, res) => {
    //     try {
    //         if (ObjectId.isValid(req.params.id)) {
    //             const id = new ObjectId(req.params.id);

    //             const user = await agentModel.findById(id);

    //             if (!user) {
    //                 return __res_.out(req, res, {
    //                     status: true,
    //                     statusCode: 404,
    //                     message: "User not found.",
    //                 });
    //             }

    //             if (user.Type === 'agent') {
    //                 return __res_.out(req, res, {
    //                     status: false,
    //                     statusCode: 400,
    //                     message: "Not eligible to update agent.",
    //                 });
    //             }

    //             const updatedUser = await agentModel.updateOne({ _id: id }, {
    //                 $set: req.body
    //             });

    //             if (updatedUser.modifiedCount > 0) {
    //                 return __res_.out(req, res, {
    //                     status: true,
    //                     statusCode: 200,
    //                     message: "Successfully updated!",
    //                 });
    //             } else {
    //                 return __res_.out(req, res, {
    //                     status: true,
    //                     statusCode: 404,
    //                     message: "User not found.",
    //                 });
    //             }

    //         } else {
    //             return __res_.out(req, res, {
    //                 status: "error",
    //                 statusCode: 400,
    //                 message: "Invalid Id.",
    //             });
    //         }

    //     } catch (e) {
    //         console.log(e)
    //         return __res_.out(req, res, {
    //             status: true,
    //             statusCode: 500,
    //             message: "Internal server error!!!",
    //             data: e

    //         });
    //     }
    // },
    activateFastagByAgentId: async (req, res) => {
        try {
            const { id } = req.params;
            const { SRNo } = req.body;
    
            if (!id || !ObjectId.isValid(id)) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid agent id.",
                });
            }
    
            const agentId = new ObjectId(id);
    
            const agent = await agentModel.findOne({
                _id: agentId,
                Type: 'agent'
            });
    
            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Agent not found.",
                });
            }
    
            const plan = await planModel.findOne({
                _id: agent.PlanId
            });
    
            if (!plan) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Plan not found.",
                });
            }

            if (agent.WalletPoints < plan.Price) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `Add More Points to Activate Tag. You have less points as per your plan. Your plan is ${plan.Price}. Contact To Admin!!`,
                });
            }
    
            const fastTagBySRNo = await activatedFastagModel.findOne({
                SRNo: SRNo
            });
    
            if (!fastTagBySRNo) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Tag not found for this SRNo or Tag not mapped. Contact to Admin.",
                });
            }
    
            if (fastTagBySRNo.Activated) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Tag for this SRNo is already activated. Use another one.",
                });
            }
    
            const findFastTag = await activatedFastagModel.findOne({
                Activated: false,
                SRNo: SRNo,
                AgentCode: agent.AgentCode
            });
    
            if (!findFastTag) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Agent and Tag not found. Contact to Admin.",
                });
            }
    
            // All checks passed
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "Agent have valid SRNo, Plan, Wallet.",
            });
    
        } catch (e) {
            console.error(e);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: e
            });
        }
    },
    
    getActivatedFastags: async (req, res) => {
        try {

            const { id } = req.params;
            const { activated } = req.query;

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            const agentId = new ObjectId(id);

            const agent = await agentModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found!',
                });
            }

            const fastagQuery = {
                AgentCode: agent.AgentCode
            };

            if (activated === 'true') {
                fastagQuery.Activated = true;
            }
            if (activated === 'false') {
                fastagQuery.Activated = false;
            }

            const totalCount = await activatedFastagModel.countDocuments(fastagQuery);

            let activatedFastags;
            if (activated === 'false') {
                activatedFastags = await activatedFastagModel.aggregate([
                    {
                        $match: fastagQuery
                    }, {
                        $sort: {
                            updatedAt: -1
                        }
                    },
                    {
                        $skip: skipCount
                    },
                    {
                        $limit: pageSize
                    }
                ]);
            } else {
                activatedFastags = await activatedFastagModel.aggregate([
                    {
                        $match: fastagQuery
                    },
                    {
                        $sort: {
                            "ActivateDetails.ActivateDate": -1,
                            "ActivateDetails.ActivateTime": -1
                        }
                    },
                    {
                        $skip: skipCount
                    },
                    {
                        $limit: pageSize
                    }
                ]);
            }
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Fastags retrieved successfully',
                data: {
                    totalRecords: totalCount,
                    currentPage: page,
                    pageSize: pageSize,
                    records: activatedFastags
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getTotalCountbyAgentId: async (req, res) => {
        try {

            const { id } = req.params;
            const agentId = new ObjectId(id);

            const agent = await agentModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found!',
                });
            }
            const totalCount = await activatedFastagModel.aggregate([
                {
                    $match: {
                        AgentCode: agent.AgentCode
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAssignFastags: { $sum: { $cond: [{ $eq: ['$Activated', false] }, 1, 0] } }, // Count all documents
                        totalEarning: { $sum: "$ActivateDetails.EarnMoney" }, // Count total documents (assuming each document contributes to earnings)
                        totalActivatedFastags: { $sum: { $cond: [{ $eq: ['$Activated', true] }, 1, 0] } }, // Count total documents (same logic as above)
                    }
                }
            ]);

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found!',
                });
            }

            const { _id, ...totalCountDetail } = totalCount[0];
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Successfully',
                data: totalCountDetail
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getEarningListbyAgentId: async (req, res) => {
        try {

            const { id } = req.params;
            const agentId = new ObjectId(id);

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            const agent = await agentModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found!',
                });
            }
            const earningsCount = await activatedFastagModel.countDocuments({ AgentCode: agent.AgentCode });

            const earnings = await activatedFastagModel.aggregate([
                {
                    $match: {
                        AgentCode: agent.AgentCode
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: skipCount
                },
                {
                    $limit: pageSize
                },
                {
                    $project: {
                        CustomerNumber: "$ActivateDetails.CustomerNumber",
                        VehicalNumber: "$ActivateDetails.VehicalNumber",
                        EarnMoney: "$ActivateDetails.EarnMoney",
                        ActivatedDate: "$createdAt"
                    }
                }

            ]);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Successfully',
                data: {
                    totalRecords: earningsCount,
                    currentPage: page,
                    pageSize: pageSize,
                    records: earnings
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getTransactionsbyAgentId: async (req, res) => {
        try {

            const { id } = req.params;
            const agentId = new ObjectId(id);

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            const agent = await agentModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found!',
                });
            }
            const transactionsCount = await walletModel.countDocuments({ AgentId: agentId });

            const transactionsHistory = await walletModel.aggregate([
                {
                    $match: {
                        AgentId: agentId
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'AgentId',
                        foreignField: '_id',
                        as: 'agent'
                    }
                },
                {
                    $project: {
                        TransactionDate: 1,
                        TransactionTime: 1,
                        AgentId: 1,
                        WalletPoints: 1,
                        CurrentPoints: 1,
                        Type: 1,
                        CreatedBy: 1,
                        AgentCode: { $first: "$agent.AgentCode" },
                        createdAt: 1
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip: skipCount
                },
                {
                    $limit: pageSize
                },
                {
                    $project: {
                        _id: 0,
                        updatedAt: 0,
                        __v: 0
                    }
                }
            ]);

            function getIstTime(utcDate) {
                const IST_Date = new Date(utcDate).toLocaleString("en-us", {
                    timeZone: "Asia/kolkata",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true // Use 24-hour format
                });
                return IST_Date
            }

            function getIstDate(utcDate) {
                const IST_Date = new Date(utcDate).toLocaleString("en-us", {
                    timeZone: "Asia/kolkata",
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                });
                return IST_Date
            }
            const transactionsList = transactionsHistory.map(({ createdAt, ...transaction }) => ({ TransactionDate: getIstDate(createdAt), TransactionTime: getIstTime(createdAt), ...transaction }))
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Successfully',
                data: {
                    totalRecords: transactionsCount,
                    currentPage: page,
                    pageSize: pageSize,
                    records: transactionsList
                }
            });
        } catch (error) {
            console.error(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    updateAssignTagAndCutWallet: async (req, res) => {
        try {
            const { id } = req.params;
            const { CustomerNumber, VehicalNumber, SRNo } = req.body;

            if (!id || !ObjectId.isValid(id)) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid agent id.",
                });
            }

            const agentId = new ObjectId(id);

            const agent = await agentModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "Agent not found.",
                });
            }

            const plan = await planModel.findOne({
                _id: agent.PlanId
            });

            if (!plan) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: `Plan not found.`,
                });
            }

            if (agent.WalletPoints < plan.Price) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `Add more points to activate tag`,
                });
            }

            const fastTagBySRNo = await activatedFastagModel.findOne({
                SRNo: SRNo
            });

            if (!fastTagBySRNo) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: `Tag not found for this SRNo.`,
                });
            }
            if (fastTagBySRNo.Activated) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `Tag for this SRNo is already activated.`,
                });
            }

            const findFastTag = await activatedFastagModel.findOne({
                Activated: false,
                SRNo: SRNo,
                AgentCode: agent.AgentCode
            });

            if (!findFastTag) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: `Agent and Tag SRNo not found!!`,
                });
            }

            // Activate the Fastag and update activation details
            findFastTag.ActivateDetails.ActivateDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
            findFastTag.ActivateDetails.ActivateTime = moment().tz("Asia/Kolkata").format("h:mm:ss A");
            findFastTag.ActivateDetails.CustomerNumber = CustomerNumber;
            findFastTag.ActivateDetails.VehicalNumber = VehicalNumber;
            findFastTag.ActivateDetails.EarnMoney = '100';
            findFastTag.Activated = true;

            // Deduct balance from agent's wallet
            agent.WalletPoints -= plan.Price;

            const wallet = new walletModel({
                CurrentPoints: agent.WalletPoints,
                AgentId: agentId,
                CreatedBy: agentId,
                Type: 'debit',
                WalletPoints: plan.Price
            });

            await wallet.save();
            await findFastTag.save();
            await agent.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "Tag Activated And Wallet Cut Successfully.",
                data: findFastTag
            });

        } catch (e) {
            console.log(e);
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
}