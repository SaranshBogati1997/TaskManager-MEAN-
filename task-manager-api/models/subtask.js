const mongoose = require('mongoose');
const subTaskSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    _taskId: {
        type:String,
        required:true
    }
});
const SubTask = mongoose.model('SubTask', subTaskSchema);
module.exports = SubTask;