const userModel = require('../models/userSchema');
const otpModel = require('../models/otpSchema')
const __res_ = require('../utils/helpers/send-response');
const keys = require('../utils/config/index');
const jwt = require('jsonwebtoken');
const sms = require('../sms/sms.controller')
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');

module.exports = {
    // createUser: async function (req, res) {
    //     try {
    //         let dev = '0000';
    //         const otp = req.body.Otp;
    //         const userId = req.params.id;
    //         const user = await otpModel.findOne({ _id: req.params.id });
    //         userModel.findOne({ Phone: req.body.Phone }).then((userInfo) => {
    //             if ((userInfo && userInfo.Phone === req.body.Phone && otp && user.Otp == otp) || userInfo && userInfo.Phone === req.body.Phone && otp == dev) {
    //                 const payload = {
    //                     _id: userInfo._id,
    //                     Phone: userInfo.Phone,
    //                 };
    //                 jwt.sign(payload, keys.adminsecret, {
    //                     expiresIn: keys.jwtExpiredTime
    //                 }, async (err, token) => {
    //                     if (err) {
    //                         return __res_.out(req, res, {
    //                             status: "error",
    //                             statusCode: 500,
    //                             message: "Something went wrong",
    //                             data: err
    //                         });
    //                     } else {
    //                         await otpModel.findByIdAndDelete(userId)
    //                         token1 = `${token}`;
    //                         return __res_.out(req, res, {
    //                             status: true,
    //                             statusCode: 200,
    //                             message: "Login Successfully!!",
    //                             data: token1,
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 async function findUserByIdAndOTP(userId, otp) {
    //                     if ((otp && user.Otp == otp && user.Phone == req.body.Phone) || otp == dev) {
    //                         await otpModel.findByIdAndDelete(userId)
    //                         var userData = {
    //                             Phone: req.body.Phone
    //                         }
    //                         new userModel(userData).save().then((data) => {
    //                             if (data) {
    //                                 const payload = {
    //                                     _id: data._id,
    //                                     FirstName: data.FirstName,
    //                                     LastName: data.LastName,
    //                                 };
    //                                 jwt.sign(payload, keys.adminsecret, {
    //                                     expiresIn: keys.jwtExpiredTime
    //                                 }, (err, token) => {
    //                                     if (err) {
    //                                         return __res_.out(req, res, {
    //                                             status: "error",
    //                                             statusCode: 500,
    //                                             message: "Something went wrong",
    //                                             data: err
    //                                         });
    //                                     } else {
    //                                         token = `${token}`;
    //                                         return __res_.out(req, res, {
    //                                             status: true,
    //                                             statusCode: 200,
    //                                             message: "Signup Successfully!!",
    //                                             data: token,
    //                                         });
    //                                     }
    //                                 });
    //                             }
    //                         })
    //                     } else {
    //                         return __res_.out(req, res, {
    //                             status: true,
    //                             statusCode: 404,
    //                             message: "Wrong OTP!!!",
    //                         });
    //                     }
    //                 }
    //                 findUserByIdAndOTP(req.params.id, req.body.Otp);
    //             }
    //         }).catch((e) => {
    //             return __res_.out(req, res, {
    //                 status: true,
    //                 statusCode: 500,
    //                 message: "Internal server error!!!",
    //                 data: e
    //             });
    //         })
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
    signUp: async (req, res) => {
        try {

            const { FirstName, LastName, MobileNumber, Password } = req.body;

            function isMissing(field, keyName) {
                if (!field) {
                    return __res_.out(req, res, {
                        status: false,
                        statusCode: 400,
                        message: `${keyName} is missing.!!`,
                    });
                }
            }

            isMissing(MobileNumber, 'Mobile Number');
            isMissing(FirstName, 'First Number');
            isMissing(LastName, 'Last Name');
            isMissing(Password, 'Password');

            const user = await userModel.findOne({ MobileNumber ,Type:'user'});

            if (user) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "User already exists.!!",
                });
            }

            const hashPassword = bcrypt.hashSync(Password, keys.saltRounds);

            const newUser = await new userModel({
                FirstName,
                LastName,
                MobileNumber,
                Password: hashPassword,
                Type:'user'
            }).save();

            const payload = {
                _id: newUser._id,
                Phone: newUser.Phone,
            };
            jwt.sign(payload, keys.usersecret, {
                expiresIn: keys.jwtExpiredTime
            }, async (err, token) => {
                if (err) {
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 500,
                        message: "Something went wrong",
                        data: err
                    });
                } else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Login Successfully!!",
                        data: token,
                    });
                }
            });

        } catch (e) {
            console.log(e)
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    login: async (req, res) => {
        try {

            const { MobileNumber, Password } = req.body;

            if (!MobileNumber) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Mobile Number is missing.!!",
                });
            }
            if (!Password) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: "Password is missing.!!",
                });
            }

            const user = await userModel.findOne({ MobileNumber});

            if (!user) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "User not found.!!",
                });
            }

            const isPasswordMatched = bcrypt.compareSync(Password, user.Password);

            if (!isPasswordMatched) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: "Incorrect password.!!",
                });
            }

            const payload = {
                _id: user._id,
                Phone: user.Phone,
                Type:user.Type
            };
            jwt.sign(payload, keys.usersecret, {
                expiresIn: keys.jwtExpiredTime
            }, async (err, token) => {
                if (err) {
                    return __res_.out(req, res, {
                        status: "error",
                        statusCode: 500,
                        message: "Something went wrong",
                        data: err
                    });
                } else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Login Successfully!!",
                        data: token,
                    });
                }
            });

        } catch (e) {
            console.log(e)
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Get the requested page number from query parameter
            const pageSize = 20; // Number of records per page
            const skipCount = (page - 1) * pageSize;
            const totalCount = await userModel.countDocuments({
                Type:'user'
            });  // Get the total count of documents in the collection
            const users = await userModel.find({
                Type:'user'
            }).skip(skipCount)
                .limit(pageSize);
            if (users) {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Successfully!!",
                    data: {
                        totalRecords: totalCount,
                        currentPage: page,
                        pageSize: pageSize,
                        records: users,
                    }
                });
            }
            else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 404,
                    message: "No Users found.!!",
                });
            }

        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    updateUserById: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const id = new ObjectId(req.params.id);

                const { FirstName,
                    LastName,
                    Email,
                    MobileNumber,
                    DateOfBirth,
                    Address,
                    City,
                    Pincode,
                    State,
                    TollName,
                    Dhampur,
                    BankDetails,
                    AaddharNumber:AadhaarNumber,
                    PanNumber } = req.body;

                const user = await userModel.updateOne({ _id: id}, {
                    $set: {
                        FirstName,
                        LastName,
                        Email,
                        MobileNumber,
                        DateOfBirth,
                        Address,
                        City,
                        Pincode,
                        State,
                        TollName,
                        Dhampur,
                        BankDetails,
                        AadhaarNumber,
                        PanNumber
                    }
                })
                if (user.modifiedCount > 0) {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 200,
                        message: "Successfully!!",
                    });
                }
                else {
                    return __res_.out(req, res, {
                        status: true,
                        statusCode: 404,
                        message: "User Not found.!!",
                    });
                }

            }
            else {
                return __res_.out(req, res, {
                    status: "error",
                    statusCode: 500,
                    message: "Invalid Id.",
                    data: err
                });
            }

        } catch (e) {
            return __res_.out(req, res, {
                status: true,
                statusCode: 500,
                message: "Internal server error!!!",
                data: e
            });
        }
    },
    // sendOtpToUser: async (req, res) => {
    //     try {
    //         if (req.body.Phone.length > 10) {
    //             const response = await sms.sendOTP(req.body.Phone)
    //             if (response.success) {
    //                 return __res_.out(req, res, {
    //                     status: true,
    //                     statusCode: 200,
    //                     message: "OTP send Successfully.!!",
    //                     data: {
    //                         token: response.message
    //                     }
    //                 });
    //             } else {
    //                 return __res_.out(req, res, {
    //                     status: true,
    //                     statusCode: 500,
    //                     message: "Failed to send SMS!!!",
    //                     data: e
    //                 });
    //             }
    //         }
    //         else {
    //             return __res_.out(req, res, {
    //                 status: "error",
    //                 statusCode: 500,
    //                 message: "Invalid Phone Number.",
    //                 data: err
    //             });
    //         }
    //     } catch (e) {
    //         return __res_.out(req, res, {
    //             status: true,
    //             statusCode: 500,
    //             message: "Internal server error!!!",
    //             data: e
    //         });
    //     }
    // },
    getUserByUserId: async (req, res) => {
        try {

            const{ userId } =  req.params;

            if (!userId && !ObjectId.isValid(userId)) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 400,
                    message: 'Invalid userId'
                });
            }

            const id = new ObjectId(userId);
            const user = await userModel.findOne({
                _id: id
            }, {
                Password: 0
            });

            if (!user) {
                return __res_.out(req, res, {
                    status: false,
                    statusCode: 404,
                    message: 'User not found'
                });
            }

            return __res_.out(req, res, {
                status: true,
                statusCode: 200,
                message: 'Successfully',
                data: user
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
    getAllUsersWithNoPagination: async (req, res) => {
        try {
            const totalCount = await userModel.countDocuments({ Type: 'user' });
            const users = await userModel.find({ Type: 'user' });
            if(users){
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: 'Agents retrieved successfully',
                    data: {
                        totalRecords: totalCount,
                        records: users
                    }
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

}