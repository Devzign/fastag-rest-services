const __res_ = require('../utils/helpers/send-response');
const { encrypt, decrypt } = require('../utils/helpers/encryptdecrypt');
const axios = require('axios')
module.exports = {
    validateCustReqAndSendOTP: async (req, res) => {
        try {
            const reqBody = req.body;
            const dataString = JSON.stringify(reqBody);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            console.log("encryptedText===>", encryptedText)

            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };
            const apiurl = `${process.env.BAJAJFT_API_URL}/v2/sendOtp`;
            try {
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log("response===>", response.data)
                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                console.log(error)
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };
            const apiurl = `${process.env.BAJAJFT_API_URL}/v2/validateCustomerDetails`;
            try {
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);
                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    createCustomer: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };

            const apiurl = `${process.env.BAJAJFT_API_URL}/v1/createCustomer`;


            try {
                console.log("===>", apiurl)
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);

                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    vehicleMakerList: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };
            const apiurl = `${process.env.BAJAJFT_API_URL}/v1/vehicleMakerList`;
            try {
                console.log("===>", apiurl)
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);

                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    vehicleModelList: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };

            const apiurl = `${process.env.BAJAJFT_API_URL}/v1/vehicleModelList`;


            try {
                console.log("===>", apiurl)
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);

                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    registerFastag: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };
            const apiurl = `${process.env.BAJAJFT_API_URL}/v2/registerFastag `;
            try {
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);

                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    replaceFastag: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };
            const apiurl = `${process.env.BAJAJFT_API_URL}/v2/replaceFastag `;
            try {
                console.log("===>", apiurl)
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);

                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
    uploadDocument: async (req, res) => {
        try {
            const reqBody = req.body;
            const customerData = { ...reqBody };
            const dataString = JSON.stringify(customerData);
            const encryptedText = encrypt(dataString); // Assuming you have an encrypt function
            const headers = {
                'Content-Type': 'application/json',
                'aggr_channel': process.env.BAJAJFT_AGGR_CHANNEL,
                'Ocp-Apim-Subscription-Key': process.env.BAJAJFT_OCPAPIM_SUBSCRIPTION_KEY
            };
            const apiurl = `${process.env.BAJAJFT_API_URL}/v1/uploadDocument `;
            try {
                console.log("===>", apiurl)
                const response = await axios.post(apiurl, encryptedText, { headers });
                console.log('Response:', response.data);

                // Assuming you have a decrypt function
                const decryptedText = decrypt(response.data);
                console.log('Decrypted:', decryptedText);

                return __res_.out(req, res, {
                    status: true,
                    statusCode: 200,
                    message: "Data decrypted successfully",
                    data: decryptedText
                });
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error status:', error.response.status);
                    console.error('Error message:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server');
                } else {
                    console.error('Error setting up request:', error.message);
                }
            }
        } catch (e) {
            console.log(e);
            if (e.name === "ValidationError" || e.name === "CastError") {
                let errorMessage = '';
                for (const key in e.errors) {
                    errorMessage += e.errors[key].message + ". ";
                }
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 400,
                    message: e.name,
                    data: errorMessage
                });
            } else {
                return __res_.out(req, res, {
                    status: true,
                    statusCode: 500,
                    message: "Internal server error!!!",
                    data: e
                });
            }
        }
    },
}