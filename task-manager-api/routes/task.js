const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const SubTask = require('../models/subtask');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


//ADD TASKS 
router.post('', getUser, async (req,res) => {
    try{
        var title = req.body.title;
        var userId = req.user._id;
        var newTask = new Task({
            title: title,
            userId: userId
        });
        
        var addedTask = await newTask.save();
        res.json({status: 1 , data: addedTask });

    }
    catch(e){
        res.send({status:0,data:e})
    } 
});
//DELETE TASKS
router.delete('/:id', async (req,res) => {
    try{
        var task = await Task.findById(req.params.id);

        await task.delete();
        var subTasks = await SubTask.find({_taskId: req.params.id });
        await subTasks.delete();
        res.json({status: 1 , data: 'success'})
    }
    catch(e){
        res.send({status:0,data:e});
    } 
});
//EDIT TASKS
router.patch('/:id', async (req,res) => {
    try{
        var task = await Task.findById(req.params.id);
        task.title = req.body.title;
        var newTask = await task.save();
        res.json({status: 1 , data: newTask });
    }
    catch(e){
        res.json({status:0, data:e.message});
    }

});
//GET TASKS
router.get('/',getUser,  async (req,res) => {
    try{
        var userId = req.user._id;
        var result = await Task.find({userId: userId});
        console.log(result)
        res.json({status:1, data: result });       
    }
    catch(e){        
        res.send({status:0,data:e.message})
    } 
});
//get subtask under taskId 
router.get('/subtask/:id', async (req,res) => {
    try{

        var subTasks = await SubTask.find({ _taskId: req.params.id });
        res.json({status: 1, data: subTasks});
    }
    catch(e) {
        res.json({status: 0, data: e.message})
    }
});
function getUser(req,res,next){
    var bearerToken = req.headers["authorization"];
    var token = bearerToken.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) res.sendStatus(401);
        else{
            req.user = user;
        }
        next();
    })
}

module.exports = router;
