const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Fastag = require('../models/activatedFastagSchema');
const upload = multer({ dest: 'uploads/' });
const __res_ = require("../utils/helpers/send-response");

module.exports = {
    uploadCsv: upload.single('file'),
    allocateFastags: (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded',
                status: false
            });
        }
        const results = [];
        const BATCH_SIZE = 10;
        const filePath = path.resolve(req.file.path);

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {

                    const dupSRNo = new Set();
                    for (const result of results) {
                        if (dupSRNo.has(result.SRNo)) {
                            return __res_.out(req, res, {
                                status: false,
                                statusCode: 400,
                                message: `CSV file contains duplicate SRNo: ${result.SRNo}`
                            })
                        }
                        dupSRNo.add(result.SRNo);
                    }

                    let batchDataOperations = [];
                    let batchProcess = [];
                    let resultSize = results.length;

                    for (let index = 0; index < resultSize; index++) {

                        const isFastagExist = await Fastag.findOne({ SRNo: results[index].SRNo });

                        // Skip this document if SRNo already exists
                        if (isFastagExist) {
                            return __res_.out(req, res, {
                                status: false,
                                statusCode: 400,
                                message: `CSV file contains some duplicate(SRNo:${isFastagExist?.SRNo}) Fastags data.`,
                            });
                        }
                        break;
                    }

                    for (let index = 0; index < resultSize; index++) {
                        batchDataOperations.push({
                            insertOne: {
                                document: {
                                    SRNo: results[index].SRNo,
                                    TagID: results[index].TagID,
                                    ClassID: results[index].ClassID,
                                    SystemID: results[index].SystemID,
                                    ProviderID: results[index].ProviderID,
                                    AgentCode: results[index].AgentCode || null,
                                    AgentFirstName: results[index].AgentFirstName,
                                    AgentLastName: results[index].AgentLastName
                                }
                            }
                        });

                        if (batchDataOperations.length === BATCH_SIZE || resultSize === index + 1) {
                            batchProcess.push(Fastag.bulkWrite(batchDataOperations));
                            batchDataOperations = [];
                        }


                    }
                    fs.unlinkSync(filePath);

                    return Promise.all(batchProcess).then(() => {
                        return __res_.out(req, res, {
                            status: true,
                            statusCode: 200,
                            message: `CSV file read and Fastags(${resultSize}) allocated successfully`,
                        });
                    })
                        .catch((error) => {
                            return __res_.out(req, res, {
                                status: false,
                                statusCode: 500,
                                message: 'Internal server error',
                                data: error.message
                            });
                        })

                } catch (error) {
                    fs.unlinkSync(filePath);

                    return __res_.out(req, res, {
                        status: false,
                        statusCode: 500,
                        message: 'Error allocating Fastags',
                        data: error.message
                    });
                }
            })
            .on('error', (error) => {
                fs.unlinkSync(filePath);

                return __res_.out(req, res, {
                    status: false,
                    statusCode: 500,
                    message: 'Error reading CSV file',
                    data: error.message
                });
            });
    },
    checkIsFastagIsAssigned: async (req, res) => {
        try {

            const { SrnNo } = req.params;

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
}
