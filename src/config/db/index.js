const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/todo_app');
        console.log("thanh cong");
    } catch (error) {
        console.log("fail");
    }
}

module.exports = { connect };