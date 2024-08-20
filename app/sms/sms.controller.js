const keys = require('../utils/config/index');
const client = require('twilio')(keys.twilioSid, keys.twilioAuthToken);
const otpModel = require('../models/otpSchema')

const sendSMS = async (phone, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            to: "+"+phone, // Text your number
            from: keys.twilioNumber, // From a valid Twilio number
        });
        if (message) return { message: response, success: (response.sid ? true : false) }
        else return { message: "Unable to send SMS.", success: false }
    } catch (e) {
        return { message: "Failed to send SMS.", success: false }
    }
}
const sms = {
    sendOTP: async (phone) => {
        function generateOTP(limit) {
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < limit; i++) {
                OTP += digits[Math.floor(Math.random() * digits.length)];
            }
            return OTP;
        }
        const OTP = generateOTP(6);

        const smsResponse = await sendSMS(phone, `Your Laundry App verification code is: ${OTP}`)
        if (smsResponse.success) {
            async function updateOrCreateUser(phone, updatedFields) {
                try {
                    let user = await otpModel.findOne({ Phone: phone });

                    if (user) {
                        user.set(updatedFields);
                        await user.save();
                        return user;
                    } else {
                        user = new otpModel({
                            Phone: phone,
                            ...updatedFields,
                        });
                        await user.save();
                        return user;
                    }
                } catch (error) {
                    return error;
                }
            }

            const response = await updateOrCreateUser(phone, { Phone: phone, Otp: OTP });
            return {
                success: true, message: response._id
            }
        }
        else return {success:false}
    },
}
module.exports = sms;