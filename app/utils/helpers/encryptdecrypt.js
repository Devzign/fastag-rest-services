const keys = require('../config/index');
const crypto = require('crypto');
const secretKey = process.env.BAJAJFT_SECRET_KEY; 
const IV = Buffer.from(process.env.BAJAJFT_IV_KEY);

// Encrypt function
function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), IV);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Decrypt function
function decrypt(text) {
   try{ const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), IV);
    let decrypted = decipher.update(text, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}catch (error){
    console.error('Error decrypting data:', error);
        throw error;
}
}
module.exports = {
    encrypt,
    decrypt
}

// const encryptedData = encrypt(JSON.stringify(dataToEncrypt));
// console.log('Encrypted:', encryptedData);

// const decryptedData = decrypt(encryptedData);
// console.log('Decrypted:', decryptedData);
