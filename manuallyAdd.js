const path = require('path');
const fs = require('fs');
const serviceModel = require('./app/models/serviceSchema');
const colors = require('colors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// config env vars
dotenv.config({ path: './app/utils/config/config.env' });

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '_manuallyData', 'services.json'), 'utf-8'));
// const hashtags = JSON.parse(fs.readFileSync(path.join(__dirname, '_manuallyData', 'hashtags.json'), 'utf-8'));


const importData = async () => {
    try {
        await serviceModel.create(categories);
        console.log(' categories data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}
// const importData = async () => {
//     try {
//         await hastagModel.create(hashtags);
//         console.log(' hashtags data imported...'.green.inverse);
//         process.exit();
//     } catch (error) {
//         console.log(error);
//     }
// }

const deleteData = async () => {
    try {
        await categoryModel.deleteMany();
        console.log('categories data deleted...'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if (process.argv[2] === '-i') {
    importData();
}
if (process.argv[2] === 'd-') {
    deleteData();
}


// command to run to add data
// node manuallyAdd.js -i


