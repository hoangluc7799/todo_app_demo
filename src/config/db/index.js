const mongoose = require('mongoose');

async function connect() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app';

        await mongoose.connect(mongoURI);
        console.log("thanh cong");
    } catch (error) {
        console.log("fail");
    }
}

module.exports = { connect };