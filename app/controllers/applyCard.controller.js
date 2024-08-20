const __res_ = require('../../app/utils/helpers/send-response');
const keys = require('../utils/config/index');
const role = require('../utils/config/roles.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const applyCardModel = require('../models/applyCardSchema');
const projectModel = require('../models/projectSchema');
const agentModel = require('../models/userSchema');

module.exports = {
    createApplyCard: async (req, res) => {
        try {
            const {
                FirstName,
                LastName,
                DOB,
                PanNumber,
                AadhaarNumber,
                Mobile,
                ProjectId,
                AgentId,
                Status,
                EarnedMoney } = req.body;

            if (!Mobile || (typeof Mobile !== 'string')) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Mobile number is required.',
                });
            }

            if (!ProjectId || !ObjectId.isValid(ProjectId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid ProjectId',
                });
            }

            const project = await projectModel.findOne({ _id: ProjectId });
            if (!project) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Project not found.',
                });
            }

            if (!AgentId || !ObjectId.isValid(AgentId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid AgentId',
                });
            }

            const agent = await agentModel.findOne({ _id: AgentId, Type: 'agent' });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Agent not found.',
                });
            }

            const dateParts = DOB.split('-');
            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2];

            const DateOfBirth = new Date(`${year}-${month}-${day}`);

            if (isNaN(DateOfBirth.getTime())) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Date of birth.'
                });
            }

            const newApplyCard = new applyCardModel({
                FirstName,
                LastName,
                DOB: DateOfBirth,
                PanNumber,
                AadhaarNumber,
                Mobile,
                ProjectId,
                AgentId,
                Status,
                EarnedMoney
            });

            await newApplyCard.save();
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Apply card successfully!',
                data: newApplyCard,
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
    getApplyCard: async (req, res) => {
        try {
            const { adminId } = req.params;

            if (!adminId || !ObjectId.isValid(adminId)) {

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: 'Invalid AdminId.'
                });
            }

            const appliedCards = await applyCardModel.aggregate([
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'ProjectId',
                        foreignField: '_id',
                        as: 'project'
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
                        AgentId: 1,
                        ProjectId: 1,
                        FirstName: 1,
                        LastName: 1,
                        DOB: 1,
                        PanNumber: 1,
                        AadhaarNumber: 1,
                        Mobile: 1,
                        Status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        AgentFirstName: { $first: "$agent.FirstName" },
                        AgentLastName:{ $first: "$agent.LastName" },
                        AgentMobile:{ $first: "$agent.MobileNumber" },
                        ProjectName: { $first: "$project.ProjectName" },
                        ProjectTitle: { $first: "$project.Title" },
                        ProjectStatus: { $first: "$project.Status" },
                        ProjectType: { $first: "$project.Type" },
                        ProjectEarn: { $first: "$project.Earn" }
                    }
                }
            ]);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'successfully!',
                data: appliedCards
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
    getApplyCardByAgentId: async (req, res) => {
        try {
            const { agentId } = req.params;

            if (!agentId || !ObjectId.isValid(agentId)) {

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: 'Invalid agentId.'
                });
            }

            const appliedCards = await applyCardModel.aggregate([
                {
                    $match: {
                        AgentId: new ObjectId(agentId)
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'ProjectId',
                        foreignField: '_id',
                        as: 'project'
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
                        AgentId: 1,
                        ProjectId: 1,
                        FirstName: 1,
                        LastName: 1,
                        DOB: 1,
                        PanNumber: 1,
                        AadhaarNumber: 1,
                        Mobile: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        AgentFirstName: { $first: "$agent.FirstName" },
                        AgentLastName:{ $first: "$agent.LastName" },
                        AgentMobile:{ $first: "$agent.MobileNumber" },
                        ProjectName: { $first: "$project.ProjectName" },
                        ProjectTitle: { $first: "$project.Title" },
                        ProjectStatus: { $first: "$project.Status" },
                        ProjectType: { $first: "$project.Type" },
                        ProjectEarn: { $first: "$project.Earn" }
                    }
                }
            ]);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'successfully!',
                data: appliedCards
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
    updateApplyCardStatus: async (req, res) => {
        try {
            const { applyCardId } = req.params;
            const { Status } = req.body;

            if (!ObjectId.isValid(applyCardId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid CardId',
                    data: null
                })
            }

            const validateUpdateStatus = ['inprogress', 'approved', 'reject'];

            if (!validateUpdateStatus.includes(Status)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid Status Type !!',
                    data: null
                })
            }

            const id = new ObjectId(applyCardId)
            const applyCard = await applyCardModel.findOne({ _id: id })

            if (!applyCard) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'ApplyCard Not Exist !! ',
                    data: null
                })
            }
            applyCard.Status = Status;
            await applyCard.save()

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Status Updated Successfull',
                status: null
            })
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
};
