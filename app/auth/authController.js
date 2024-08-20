const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/userSchema');
const generateOTP = require('../utils/helpers/generateOTP');
const keys = require('../utils/config/index');

module.exports = {
    sendotp: async (req, res) => {
        const { MobileNumber } = req.body;
        try {
            let user = await User.findOne({ MobileNumber }); 
            const otp = generateOTP(6);
            const otpExpiration = new Date(Date.now() + 5 * 60000);
            if (!user) {
                user = new User({ MobileNumber });
            }
            user.OTP = otp;
            user.OTPExpiration = otpExpiration;

            await user.save();

            console.log('User saved with OTP:', user);
            res.json({ message: 'OTP sent successfully', otp });

        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    verify: async (req, res) => {
        const { MobileNumber, OTP } = req.body;
        try {
            const user = await User.findOne({ MobileNumber });
            if (!user || !user.OTP || !user.OTPExpiration) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            if (user.OTP !== OTP || new Date(user.OTPExpiration) < new Date()) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            user.OTP = null;
            user.OTPExpiration = null;
            await user.save();
            const token = jwt.sign({ MobileNumber }, keys.usersecret, { expiresIn: keys.jwtExpiredTime });
            return res.json({ message: 'Logged in successfully', token });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
