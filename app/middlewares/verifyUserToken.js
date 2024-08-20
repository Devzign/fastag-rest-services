const jwt = require('jsonwebtoken');
const keys = require('../utils/config/index');
const UserModel = require('../models/userSchema');
const __res_ = require('../utils/helpers/send-response');

module.exports = async (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized user",
            data: 'Authorization failed. No access token provided.'
        });
    }
    const token = authToken.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, keys.usersecret);
        const user = await UserModel.findOne({ _id: decodedToken._id });
        if(user){
            req.user = user;
        }
        else{
            throw new Error('Username not found.');
        }

    } catch (err) {
        console.log(err)
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized user",
            data: 'Authorization failed. Invalid token.'
        });
    }

    next();
};