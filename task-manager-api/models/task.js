const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    userId: {
        type:String,
        required:true,
        trim:true
    }
});
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;