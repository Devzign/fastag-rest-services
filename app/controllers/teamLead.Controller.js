const teamLeadModel = require('../models/teamLeadSchema');
const adminModel = require('../models/adminSchema');
const userModel = require("../models/userSchema");
const activatedFastagModel = require('../models/activatedFastagSchema')
const __res_ = require('../../app/utils/helpers/send-response');
const keys = require('../utils/config/index');
const role = require('../utils/config/roles.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    createTeamLead: async (req, res) => {
        try {
            const {
                Email,
                MobileNumber,
                Password,
                BankDetails,
                AadhaarNumber,
                PanNumber } = req.body;
            const { adminId } = req.params;

            const {
                AccountNumber,
                IfscCode,
                AccountHolderName,
                BranchName,
                AccountType
            } = BankDetails || {};

            // if (PanNumber && (typeof PanNumber !== 'string')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid PanNumber.',
            //     });
            // }
            // if (AadhaarNumber && (typeof AadhaarNumber !== 'number')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid AadhaarNumber.',
            //     });
            // }

            // if (AccountNumber && (typeof AccountNumber !== 'number')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid AccountNumber.',
            //     });
            // }

            // if (IfscCode && (typeof IfscCode !== 'string')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid IfscCode.',
            //     });
            // }

            // if (AccountHolderName && (typeof AccountHolderName !== 'string')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid AccountHolderName.',
            //     });
            // }
            // if (BranchName && (typeof BranchName !== 'string')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid BranchName.',
            //     });
            // }
            // if (AccountType && (typeof AccountType !== 'string')) {
            //     return __res_.out(req, res, {
            //         status: false,
            //         statusCode: 400,
            //         message: 'Invalid AccountType.',
            //     });
            // }

            if (!mongoose.Types.ObjectId.isValid(adminId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid ID. Please provide a valid Admin ID.',
                });
            }

            const saltRounds = parseInt(keys.saltRounds, 10);
            if (isNaN(saltRounds)) {
                throw new Error('Invalid salt rounds configuration');
            }

            const newPassword = bcrypt.hashSync(Password, saltRounds);

            const existingAdmin = await adminModel.findById(adminId);
            if (!existingAdmin) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Admin not found!',
                });
            }
            const existingTeamLead = await teamLeadModel.findOne({
                $or: [{ Email }, { MobileNumber }]
            });

            if (existingTeamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Team Lead already exists!',
                });
            }
            const teamLeadData = {
                ...req.body,
                AdminId: adminId,
                Password: newPassword,
                BankDetails: {
                    AccountNumber,
                    IfscCode,
                    AccountHolderName,
                    BranchName,
                    AccountType
                },
                AadhaarNumber,
                PanNumber,
                Permissions: role[1]
            };

            const teamLead = new teamLeadModel(teamLeadData);
            await teamLead.save();
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Team Lead created successfully!',
                data: teamLead,
            });
        } catch (error) {
            console.log(error)
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },

    getAllTeamLeads: async (req, res) => {
        try {
            const allTeamLeads = await teamLeadModel.find({},
                { Password: 0, Permissions: 0 }
            ).sort({ createdAt: -1 });

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'All Team Leads retrieved successfully!',
                data: allTeamLeads
            });
        } catch (error) {
            console.log(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getAllTeamLeadsNameOnly: async (req, res) => {
        try {
            const allTeamLeads = await teamLeadModel.find().select('FirstName LastName').sort({ createdAt: -1 });

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'All Team Leads retrieved successfully!',
                data: allTeamLeads
            });
        } catch (error) {
            console.log(error);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    getTeamLeadById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid ID. Please provide a valid Team Lead ID.',
                });
            }
            const teamLead = await teamLeadModel.findById(id);
            if (!teamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found!',
                });
            }

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Team Lead retrieved successfully!',
                data: teamLead
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

    updateTeamLeadById: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid ID. Please provide a valid Team Lead ID.',
                });
            }
            const updatedTeamLead = await teamLeadModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedTeamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found!',
                });
            }

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Team Lead updated successfully!',
                data: updatedTeamLead
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

    teamLeadLogin: async function (req, res) {
        try {
            const teamLeadInfo = await teamLeadModel.findOne({ Email: req.body.Email });
            console.log(teamLeadInfo);

            if (!teamLeadInfo) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "User Does Not Exist!!",
                    data: null
                });
            }

            const { Password } = req.body;
            const { Password: hashedPassword } = teamLeadInfo;

            if (typeof Password !== 'string' || typeof hashedPassword !== 'string') {
                console.error('One of the arguments is not a string');
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid input data"
                });
            }

            if (bcrypt.compareSync(Password, hashedPassword)) {
                const payload = {
                    _id: teamLeadInfo._id,
                    Email: teamLeadInfo.Email,
                    FirstName: teamLeadInfo.FirstName,
                    Permissions: teamLeadInfo.Permissions
                };

                const token = jwt.sign(payload, keys.adminsecret, {
                    expiresIn: keys.jwtExpiredTime
                });

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Login Successfully!!",
                    data: token
                });
            } else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 401,
                    message: "Invalid Credentials"
                });
            }
        } catch (e) {
            console.log(e);
            return __res_.out(req, res, {
                status: "error",
                statusCode: 500,
                message: "Something went wrong",
                data: e.message
            });
        }
    },
    updateUserTypeByUserId: async function (req, res) {
        try {

            const { userId } = req.params;
            const { Type } = req.body;

            const validUpdateType = ['user', 'agent'];

            if (!ObjectId.isValid(userId)) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid userId!!",
                    data: null
                });
            }

            if (!validUpdateType.includes(Type)) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 400,
                    message: "Invalid Update Type!!",
                    data: null
                });
            }

            const id = new ObjectId(userId);
            const user = await userModel.findOne({ _id: id });

            if (!user) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "User Does Not Exist!!",
                    data: null
                });
            }

            user.Type = Type;
            await user.save();

            return __res_.out(req, res, {
                status: "success",
                statusCode: 200,
                message: "User updated successfully!!",
                data: null
            });

        } catch (e) {
            console.log(e);
            return __res_.out(req, res, {
                status: "error",
                statusCode: 500,
                message: "Something went wrong",
                data: e.message
            });
        }
    },
    getAgentFastagsByTlIdAndAgentId: async (req, res) => {
        try {
            const { tlId, agentId } = req.params;
            const { activated } = req.query;

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            if (!ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Tl ID. Please provide a valid Team Lead ID.',
                });
            }
            if (!ObjectId.isValid(agentId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Agent ID.. Please provide a valid Team Lead ID.',
                });
            }
            const teamLead = await teamLeadModel.findById(tlId);
            if (!teamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found!',
                });
            }

            const agent = await userModel.findOne({
                _id: agentId,
                Type: 'agent',
                TLId: tlId
            })

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found!',
                });
            }

            const totalCount = await activatedFastagModel.countDocuments({
                AgentCode: agent.AgentCode
            });

            const fastagQuery = [
                {
                    $match: {
                        AgentCode: agent.AgentCode
                    }
                },
                {
                    $skip: skipCount
                },
                {
                    $limit: pageSize
                }
            ];
            if (activated === 'true') {
                fastagQuery[0].$match.Activated = true;
            }

            const activatedFastags = await activatedFastagModel.aggregate(fastagQuery);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agent fastag retrieved successfully!',
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
    getTotalCountByTlId: async (req, res) => {
        try {
            const { tlId } = req.params;

            if (!ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Tl ID. Please provide a valid Team Lead ID.',
                });
            }

            const teamLead = await teamLeadModel.findById(tlId);
            if (!teamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found!',
                });
            }

            const totalAgent = await userModel.countDocuments({
                Type: 'agent',
                TLId: tlId
            })

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Successfully!',
                data: {
                    totalAgent
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
    getAgentsFastagsByTlId: async (req, res) => {
        try {
            const { tlId } = req.params;
            const { activated } = req.query;

            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;

            if (!ObjectId.isValid(tlId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Tl ID. Please provide a valid Team Lead ID.',
                });
            }

            const teamLead = await teamLeadModel.findById(tlId);
            if (!teamLead) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Team Lead not found!',
                });
            }

            const fastagQuery = [];

            if (activated === 'true') {

                fastagQuery.push({ $match: { Activated: true } });
            }
            if (activated === 'false') {

                fastagQuery.push({ $match: { Activated: false } });
            }

            fastagQuery.push(
                {
                    $lookup: {
                        from: "users",
                        localField: "AgentCode",
                        foreignField: "AgentCode",
                        as: "agent"
                    }
                },
                {
                    $match: {
                        "agent.TLId": new ObjectId(tlId)
                    }
                }, {
                $project: {
                    agent: 0
                }
            }
            );

            const countResponse = await activatedFastagModel.aggregate([...fastagQuery, {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 }
                }
            }]);

            const totalCount = countResponse.length > 0 ? countResponse[0]?.totalCount : 0;

            fastagQuery.push({

                $skip: skipCount
            },
                {
                    $limit: pageSize
                });
            const activatedFastags = await activatedFastagModel.aggregate(fastagQuery);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Agent fastag retrieved successfully!',
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
};
