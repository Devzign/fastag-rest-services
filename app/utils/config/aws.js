const config = require('../config/index');
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency();

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
});

const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    signatureVersion: 'v4',
    region: config.aws.region
});

const ses = new AWS.SES({
    "apiVersion": '2010-12-01'
})

module.exports = {
    AWS,
    s3,
    ses
}