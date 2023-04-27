const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/app')
const users = new mongoose.Schema({
    name:String,
    email:String,
    // date:String,
    // rollno:Number
})

module.exports = mongoose.model('users',users)