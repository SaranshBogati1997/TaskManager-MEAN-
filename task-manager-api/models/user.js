const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        minlength:1
    },
    password: {
        type:String,
        required:true,
        minlength:8
    }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;