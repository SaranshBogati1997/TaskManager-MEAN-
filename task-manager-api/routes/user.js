const express = require('express');
const userRoute = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Token = require('../models/token');

// register user
userRoute.post('/register', async (req,res) => {
    try{
        var username = req.body.username;
        var password = req.body.password;
        var user = new User({
            username : username,
            password: password
        });
        var response = await user.save();
        var token = jwt.sign({username: user.username , _id: response._id },process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m" });
        var refreshToken = jwt.sign({username: user.username, _id: response._id },process.env.REFRESH_TOKEN_SECRET);

        //save refresh token to database 
        var refToken = new Token({ token: refreshToken });
        await Token.save( refToken );

        res.json({status: 1 , data: { accessToken: token, refreshToken: refreshToken, loggedIn: true } })
        
    }
    catch(e){
        res.json({ status: 0, data: e.message });
    }
})

//validate user
userRoute.post('/login', async (req,res) => {
    try{
        console.log('request body is ',req.body)
        var username = req.body.username;
        var password = req.body.password;

        var user = await User.findOne({ username:username, password:password });


        if(!user){
            res.json({status: 0 , data:"Invalid username/password", loggedIn: false })
        }
        else{
            //create access token and refresh token 
            var token = jwt.sign({ username: user.username, _id: user._id },process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m" });
            var refreshToken = jwt.sign({username: user.username, _id: user._id },process.env.REFRESH_TOKEN_SECRET);

            //save refresh token to database 
            var refToken = new Token({ token: refreshToken });
            await refToken.save();

            res.json({status: 1 , data: { accessToken: token, refreshToken: refreshToken, loggedIn: true } })
        }
    }
    catch(e){
        console.log(e)
        res.json({ status: 0, data: e.message });

    }
})

//create new access token from refresh token 
userRoute.post('/token', async  (req,res) => {
    var refreshToken = req.body.token;

    //check to see if the token exists in database 
    var token = await Token.find({token: refreshToken });
    if(token) {
        //if token is present create new access token and send back 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err){
                res.json({status: 0, data: err.message })
            }
            else{
                //create new token 
                var newToken = jwt({username: user.username, _id: user._id }, process.env.ACCESS_TOKEN_SECRET,{expiresIn: "15m"});
                res.json({ staus:1, data: newToken })
            }
        });
    }
})

//logout and delete the refresh token 
userRoute.post('/logout', async  (req,res) => {
    var refreshToken = req.body.token;
    //check to see if the token exists in database 
    var token = await Token.find({ token: refreshToken });
    if(token) {
       await token.delete(); 
    }
});

module.exports = userRoute;