// const { v4: uuidv4 } = require('uuid');
module.exports = {
    generateUniquePassword: function(length=10){
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
            let password = '';
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * charset.length);
              password += charset[randomIndex];
            }
            return password;
          
    }

}