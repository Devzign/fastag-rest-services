const jwt = require('jsonwebtoken');
const keys = require('../utils/config/index');
const AdminModel = require('../models/adminSchema');
const __res_ = require('../utils/helpers/send-response');

module.exports = async (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken) {
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized admin",
            data: 'Authorization failed. No access token provided.'
        });
    }
    const token = authToken.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, keys.adminsecret);
        const user = await AdminModel.findOne({ _id: decodedToken._id });
        if(user){
            req.user = user;
        }
        else{
            throw new Error('Username not found.');
        }

    } catch (err) {
        return __res_.out(req, res, {
            status: true,
            statusCode: 401,
            message: "Unauthorized admin",
            data: 'Authorization failed. Invalid token.'
        });
    }

    next();
};