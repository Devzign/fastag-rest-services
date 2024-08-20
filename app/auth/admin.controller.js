const jwt = require('jsonwebtoken');
const keys = require('../utils/config/index');
const role = require('../utils/config/roles.json');
const adminModel = require("../models/adminSchema");
const superAdminModel = require("../models/adminSchema");
const walletModel = require('../models/walletSchema');
const userModel = require("../models/userSchema");
const projectModel = require('../models/projectSchema');
const planModel = require('../models/planSchema')
const teamLeadModel = require("../models/teamLeadSchema")
const activatedFastagModel = require('../models/activatedFastagSchema');
const __res_ = require("../utils/helpers/send-response");
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require("mongoose").Types;
const moment = require('moment-timezone');
module.exports = {
    createAdmin: async function (req, res) {
        try {

            const { Password, Role, FirstName, LastName, Email } = req.body;

            function isMissing(field, keyName) {
                if (!field) {
                    __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `${keyName} is missing.!!`,
                    });
                    return true
                }
                return false
            }

            if (isMissing(Role, "Role")) return;
            if (isMissing(Password, "Password")) return;
            if (isMissing(FirstName, "FirstName")) return;
            if (isMissing(LastName, "Last Name")) return;
            if (isMissing(Email, "Email")) return;

            const password = req.body.Password;
            const newPassword = bcrypt.hashSync(password, keys.saltRounds);

            // Using async/await for better readability
            const userInfo = await adminModel.findOne({ Email: req.body.Email });

            if (userInfo) {
                // User already exists
                return __res_.out(req, res, {
                    status: "found",
                    statusCode: 200,
                    message: "This User Already Exists!!"
                });
            } else {
                // User doesn't exist, proceed to create
                var empData = {
                    FirstName: req.body.FirstName,
                    LastName: req.body.LastName,
                    Email: req.body.Email,
                    Password: newPassword,
                    Role: req.body.Role,
                    Permissions: role[0]
                };

                const data = await new adminModel(empData).save();

                // Generating JWT token
                const payload = {
                    _id: data._id,
                    Email: data.Email,
                    FirstName: data.FirstName,
                    Permissions: data.Permissions
                };

                const token = jwt.sign(payload, keys.adminsecret, {
                    expiresIn: keys.jwtExpiredTime
                });

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Signup Successfully!!",
                    data: token
                });
            }
        } catch (e) {
            console.log(e)
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e.message
            });
        }
    },

    // Will authenticate the user with email and password
    adminLogin: async function (req, res, next) {
        try {
            const userInfo = await adminModel.findOne({ Email: req.body.Email });

            if (!userInfo) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "User Does Not Exist!!",
                    data: null
                });
            } else if (bcrypt.compareSync(req.body.Password, userInfo.Password)) {
                const payload = {
                    _id: userInfo._id,
                    Email: userInfo.Email,
                    FirstName: userInfo.FirstName,
                    Permissions: userInfo.Permissions
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
            return __res_.out(req, res, {
                status: "error",
                statusCode: 500,
                message: "Something went wrong",
                data: e.message
            });
        }
    },
    updateAdminPasswordByAdminId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id && ObjectId.isValid(id)) {

                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "AdminId is a required parameter."
                });
            }
            const user = await adminModel.findOne({ _id: id });

            if (!user) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Admin not found."
                });
            }

            const { Password } = req.body;

            if (!Password) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Password is missing."
                });
            }

            const hashPassword = bcrypt.hashSync(Password, keys.saltRounds);
            user.Password = hashPassword;
            await user.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "Admin Password Updated!!",
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },

    // superAdminLogin: async function (req, res, next) {
    //     try {
    //         const userInfo = await superAdminModel.findOne({ Email: req.body.Email });

    //         if (!userInfo) {
    //             return __res_.out(req, res, {
    //                 status: "error",
    //                 statusCode: 404,
    //                 message: "Admin Does Not Exist!!",
    //                 data: null
    //             });
    //         } else if (bcrypt.compareSync(req.body.Password, userInfo.Password)) {
    //             const payload = {
    //                 _id: userInfo._id,
    //                 Email: userInfo.Email,
    //                 FirstName: userInfo.FirstName
    //             };

    //             const token = jwt.sign(payload, keys.adminsecret, {
    //                 expiresIn: keys.jwtExpiredTime
    //             });

    //             return __res_.out(req, res, {
    //                 status: true,
    //                 statusCode: 200,
    //                 message: "Login Successfully!!",
    //                 data: token
    //             });
    //         } else {
    //             return __res_.out(req, res, {
    //                 status: "error",
    //                 statusCode: 401,
    //                 message: "Invalid Credentials"
    //             });
    //         }
    //     } catch (e) {
    //         return __res_.out(req, res, {
    //             status: "error",
    //             statusCode: 500,
    //             message: "Something went wrong",
    //             data: e.message
    //         });
    //     }
    // },
    getallrole: async (req, res) => {
        try {
            const roles = await adminModel.find();
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "All rolees get successfully",
                result: roles
            });
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: error, message })

        }
    },
    getroleById: async (req, res) => {
        const roleesid = req.params.id
        try {
            if (!mongoose.Types.ObjectId.isValid(roleesid)) {
                return res.status(400).json({ message: "Invalid Id" });
            }
            const role = await adminModel.findById(roleesid);

            if (!role) {
                return res.status(404).json({ message: 'role not found' });
            }
            res.status(200).json({ role });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    updaterole: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "_id is a required parameter."
                });
            }
            const existingrole = await adminModel.findById(id);
            if (!existingrole) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "role not found."
                });
            }
            // Extract updated fields from request body, excluding Email and Password
            const { Email, Password, ...updatedFields } = req.body;

            // Check if Email or Password are attempted to be updated
            if (Email || Password) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Email and Password cannot be updated using this endpoint."
                });
            }

            // Update client data, excluding Email and Password
            for (const key in updatedFields) {
                if (Object.hasOwnProperty.call(updatedFields, key)) {
                    existingrole[key] = updatedFields[key];
                }
            }

            // Save updated client data
            await existingrole.save();

            // Return success response
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "role Updated Successfully!",
            });
        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    deleterole: async (req, res) => {
        try {
            const roleToDelete = adminModel.findById(req.params.id);
            if (!roleToDelete) {
                return res.status(400).json({ message: 'role Not found' })
            }
            await adminModel.deleteOne({ _id: roleToDelete._id });
            res.status(200).json({ message: 'role deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    updateUserByUserId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id && ObjectId.isValid(id)) {

                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Userid is a required parameter."
                });
            }

            const { Password, ...updateDetails } = req.body;

            const user = await userModel.updateOne({ _id: id }, {
                $set: updateDetails
            })
            if (user.modifiedCount > 0) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "User Updated Successfully!!",
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "User Not found.!!",
                });
            }

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    updateUserPasswordByUserId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id && ObjectId.isValid(id)) {

                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Userid is a required parameter."
                });
            }

            const { Password } = req.body;

            if (!Password) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Password is missing."
                });
            }

            const hashPassword = bcrypt.hashSync(Password, keys.saltRounds);

            const user = await userModel.updateOne({ _id: id }, {
                $set: {
                    Password: hashPassword
                }
            })
            if (user.modifiedCount > 0) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "User Password Updated!!",
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "User Not found.!!",
                });
            }

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    updateTLPasswordByTLId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id && ObjectId.isValid(id)) {

                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Userid is a required parameter."
                });
            }

            const { Password } = req.body;

            if (!Password) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Password is missing."
                });
            }

            const hashPassword = bcrypt.hashSync(Password, keys.saltRounds);

            const user = await teamLeadModel.updateOne({ _id: id }, {
                $set: {
                    Password: hashPassword
                }
            })
            if (user.modifiedCount > 0) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "TL Password Updated!!",
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "TL Not found.!!",
                });
            }

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    deleteUserByUserId: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id && ObjectId.isValid(id)) {

                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Userid is a required parameter."
                });
            }

            const user = await userModel.deleteOne({ _id: id });

            if (user && user?.deletedCount > 0) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "User Deleted Successfully!!",
                });
            }
            return __res_.out(req, res, {
                status: false,
                statusCode: 404,
                message: "User not found.",
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    getSumOfUserAgentTlProject: async (req, res) => {
        try {

            const totalAgent = await userModel.countDocuments({
                Type: 'agent'
            });
            const totalUser = await userModel.countDocuments({
                Type: 'user'
            });
            const totalProject = await projectModel.countDocuments();
            const totalTl = await teamLeadModel.countDocuments();

            const today = new Date();
            const todayFormatted = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

        const activatedFastagToday = await activatedFastagModel.countDocuments({
            "ActivateDetails.ActivateDate": todayFormatted,
            Activated: true
        });
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: "Successfully!!",
                data: {
                    totalUser: totalUser,
                    totalAgent: totalAgent,
                    totalTl: totalTl,
                    totalProject: totalProject,
                    activatedFastagToday: activatedFastagToday,
                }
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    addPointToAgentWalletByAgentId: async (req, res) => {
        try {

            const { AddPoints, CreatedById } = req.body;
            const { agentId } = req.params;

            function isMissing(field, keyName) {
                if (!field) {
                    __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `${keyName} is missing.!!`,
                    });
                    return true
                }
                return false
            }
            if (AddPoints < 0) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "AddPoints Must Be Greter Then 0"
                });
            }
            if (isMissing(AddPoints, "AddPoints")) return;


            const agent = await userModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Agent not found!!"
                });
            }

            agent.WalletPoints = AddPoints + agent.WalletPoints;

            await agent.save();

            if (!CreatedById || !ObjectId.isValid(CreatedById)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Invalid CreatedById !!"
                });
            }

            const wallet = new walletModel({
                AgentId: agentId,
                Type: "credit",
                CreatedBy: CreatedById
            });

            wallet.WalletPoints = AddPoints;
            wallet.CurrentPoints = agent.WalletPoints;

            await wallet.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `${AddPoints} Points added Successfully!!`,
                data: wallet
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    updatePointToAgentWalletByAgentId: async (req, res) => {
        try {

            const { TransactionId, Points } = req.body;
            const { agentId } = req.params;

            if (typeof Points !== 'number') {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Points is missing.!!"
                });
            }

            if (Points < 0) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Points must be greater than zero.!!"
                });
            }

            const agent = await userModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Agent not found!!"
                });
            }

            const wallet = await walletModel.findOne({ _id: TransactionId });

            if (!wallet) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Transaction not found!!"
                });
            }

            let agentPoints = agent.WalletPoints;
            agentPoints = agentPoints - wallet.WalletPoints;
            agentPoints = agentPoints + Points;
            wallet.WalletPoints = Points;
            agent.WalletPoints = agentPoints;

            await wallet.save();
            await agent.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `Points updated  Successfully!!`,
                data: wallet
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    setPointToAgentWalletByAgentId: async (req, res) => {
        try {

            const { Points } = req.body;
            const { agentId } = req.params;

            if (typeof Points !== 'number') {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Points is missing.!!"
                });
            }

            if (Points < 0) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Points must be greater than zero.!!"
                });
            }

            const agent = await userModel.findOne({
                _id: agentId,
                Type: 'agent'
            });

            if (!agent) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Agent not found!!"
                });
            }

            agent.WalletPoints = Points;
            await agent.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `Points updated  Successfully!!`,
                data: agent
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    createPlan: async (req, res) => {
        try {

            const { PlanName, Price } = req.body;

            function isMissing(field, keyName) {
                if (!field) {
                    __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `${keyName} is missing.!!`,
                    });
                    return true
                }
                return false
            }

            if (isMissing(PlanName, "PlanName")) return;
            if (isMissing(Price, "Price")) return;

            const plan = await new planModel({
                PlanName,
                Price
            }).save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `Plan created Successfully!!`,
                data: plan
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    updatePlan: async (req, res) => {
        try {

            const { PlanName, Price } = req.body;

            if (!ObjectId.isValid(req.params.id)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: `Invalid plan id!!`,
                });

            }

            function isMissing(field, keyName) {
                if (!field) {
                    __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `${keyName} is missing.!!`,
                    });
                    return true
                }
                return false
            }

            if (isMissing(PlanName, "PlanName")) return;
            if (isMissing(Price, "Price")) return;

            const plan = await planModel.findOne({ _id: req.params.id });

            if (!plan) {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 404,
                    message: "Plan not found!!",
                });
            }

            plan.PlanName = PlanName;
            plan.Price = Price;

            await plan.save();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `Plan created Successfully!!`,
                data: plan
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },
    getPlans: async (req, res) => {
        try {

            const plans = await planModel.find();

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `Successfully!!`,
                data: plans
            });

        } catch (error) {
            console.error("Error occurred:", error);
            // Error handling
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error.",
                data: error.message
            });
        }
    },

    getActivateFastags: async (req, res) => {
        try {
            const { page, activated, agentcode, startdate, enddate, tlid } = req.query;

            const fastagQuery = {};
            if (activated === 'true') { fastagQuery.Activated = true; }
            if (activated === 'false') { fastagQuery.Activated = false; }

            if (agentcode) fastagQuery.AgentCode = agentcode;

            function makeDate(dateString) {
                const [day, month, year] = dateString.split("-");
                return new Date(year, month - 1, day);
            }

            if (startdate) {
                const startedDate = makeDate(startdate);
                if (!fastagQuery.createdAt) fastagQuery.createdAt = {};
                fastagQuery.createdAt.$gte = startedDate;
            }

            if (enddate) {
                const endedDate = makeDate(enddate);
                if (!fastagQuery.createdAt) fastagQuery.createdAt = {};
                fastagQuery.createdAt.$lte = endedDate;
            }

            const filterFastag = [
                { $match: fastagQuery },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'AgentCode',
                        foreignField: 'AgentCode',
                        as: 'agent'
                    }
                },
                    { $unwind: '$agent' },
                {
                    $lookup: {
                        from: 'plans',
                        localField: 'agent.PlanId',
                        foreignField: '_id',
                        as: 'plan'
                    }
                },
                { $unwind: '$plan' },
                {
                    $project: {
                        SRNo: 1,
                        TagID: 1,
                        ClassID: 1,
                        SystemID: 1,
                        ProviderID: 1,
                        AgentCode: 1,
                        AgentFirstName: 1,
                        AgentLastName: 1,
                        Activated: 1,
                        ActivateDetails: 1,
                        PlanName: '$plan.PlanName',
                        createdAt: 1,
                        updatedAt: 1,
                        'agent.TLId': 1
                    }
                }
            ];

            if (tlid && !ObjectId.isValid(tlid)) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: 'Invalid TlId.',
                });
            }

            if (tlid && ObjectId.isValid(tlid)) {
                filterFastag.push({ $match: { 'agent.TLId': new ObjectId(tlid) } });
            }

            if (activated === 'false') {
                filterFastag.push({ $sort: { updatedAt: -1 } });
            } else {
                filterFastag.push({ $sort: { "ActivateDetails.ActivateDate": -1, "ActivateDetails.ActivateTime": -1 } });
            }

            // Uncomment these lines if you need to implement pagination
            // const pageNo = parseInt(page) || 1;
            // const pageSize = 20;
            // const skipCount = (pageNo - 1) * pageSize;

            // const countResponse = await activatedFastagModel.aggregate([...filterFastag, {
            //     $group: {
            //         _id: null,
            //         totalCount: { $sum: 1 }
            //     }
            // }]);

            // const totalCount = countResponse.length > 0 ? countResponse[0]?.totalCount : 0;

            // filterFastag.push({ $skip: skipCount }, { $limit: pageSize });

            const activateFastags = await activatedFastagModel.aggregate(filterFastag);

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Fastags retrieved successfully',
                data: {
                    // totalRecords: totalCount,
                    // currentPage: pageNo,
                    // pageSize: pageSize,
                    records: activateFastags
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

    deleteFastagsByFastagId: async (req, res) => {
        try {

            const { fastagId } = req.params;

            if (fastagId && !ObjectId.isValid(fastagId)) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: 'Invaild Fastag id.'
                });
            }

            const response = await activatedFastagModel.deleteOne({ _id: fastagId });

            if (response.deletedCount > 0) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: 'Fastags deleted successfully'
                });
            } else {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'Fastags not found.'
                });
            }

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

    getAllWallets: async (req, res) => {
        try {

            const { agentid, startdate, enddate, tlid } = req.query;

            const walletFilter = {};

            if (agentid && !ObjectId.isValid(agentid)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid agent id'
                });
            }

            if (agentid && ObjectId.isValid(agentid)) {
                walletFilter.AgentId = new ObjectId(agentid);
            }

            function makeDate(dateString) {
                const [day, month, year] = dateString.split("-");
                const date = new Date(year, month - 1, day);
                return date
            }

            if (startdate) {
                const startedDate = makeDate(startdate);

                if (!walletFilter.createdAt) walletFilter.createdAt = {}

                walletFilter.createdAt.$gte = startedDate
            }

            if (enddate) {
                const endedDate = makeDate(enddate);

                if (!walletFilter.createdAt) walletFilter.createdAt = {}

                walletFilter.createdAt.$lte = endedDate
            }

            // const transactionsCount = await walletModel.countDocuments(walletFilter);

            const transactionQuery = [
                {
                    $match: walletFilter
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
                    $sort: { createdAt: -1 }
                },
                // {
                //     $skip: skipCount
                // },
                // {
                //     $limit: pageSize
                // },

            ];

            if (tlid && !ObjectId.isValid(tlid)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid tlid id'
                });
            }

            if (tlid) {

                transactionQuery.push({
                    $match: {
                        "agent.TLId": new ObjectId(tlid)
                    }
                })
            }

            transactionQuery.push({
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
            });

            const transactionsHistory = await walletModel.aggregate(transactionQuery);

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
                    // totalRecords: transactionsCount,
                    // currentPage: page,
                    // pageSize: pageSize,
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

    updateAllFastagDateTime: async (req, res) => {
        try {
            const batchSize = 100;
            let skip = 0;
            let totalUpdated = 0;
    
            while (true) {
                // Fetch a batch of records
                const fastTags = await activatedFastagModel.find().skip(skip).limit(batchSize);
    
                if (fastTags.length === 0) {
                    break; // Exit the loop if no more records are found
                }
    
                // Update each record in the batch
                for (const fastTag of fastTags) {
                    if (fastTag.Activated) {
                        // Check if ActivateDate does not match the expected format
                        if (!moment(fastTag.ActivateDetails.ActivateDate, "DD-MM-YYYY", true).isValid()) {
                            fastTag.ActivateDetails.ActivateDate = moment(fastTag.ActivateDetails.ActivateDate, ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY"]).format("DD-MM-YYYY");
                        }
    
                        // Check if ActivateTime does not match the expected format
                        if (!moment(fastTag.ActivateDetails.ActivateTime, "hh:mm:ss A", true).isValid()) {
                            fastTag.ActivateDetails.ActivateTime = moment(fastTag.ActivateDetails.ActivateTime, ["hh:mm:ss A", "HH:mm:ss"]).format("hh:mm:ss A");
                        }
    
                        await fastTag.save();
                        totalUpdated++;
                    }
                }
    
                skip += batchSize; // Move to the next batch
            }
    
            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: `Success, updated ${totalUpdated} records.`,
            });
    
        } catch (e) {
            console.log(e);
            return __res_.out(req, res, {
                status: false,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    }
}