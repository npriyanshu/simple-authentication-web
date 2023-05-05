const mongoose = require('mongoose')
mongoose.connect('mongodb://0.0.0.0:27017/app')
const users = new mongoose.Schema({
    name:String,
    email:String,
    password:String
    // date:String,
    // rollno:Number
})

module.exports = mongoose.model('users',users)