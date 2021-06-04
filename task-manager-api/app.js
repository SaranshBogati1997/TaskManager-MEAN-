require('dotenv').config();

const express = require('express');
const app  = express();
const port = process.env.PORT | 3000;
const taskRouter = require('./routes/task');
const subTaskRouter = require('./routes/subtask');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const cors = require('cors');

const { json } = require('body-parser');

mongoose.connect(process.env.DB, {useNewUrlParser:true, useUnifiedTopology:true}).then( _ => {
    console.log('connected to database');
})
.catch(err => {
    console.log(err);
});

app.use(cors());
app.use(json());

app.use('/api/task',taskRouter);
app.use('/api/subtask',subTaskRouter);
app.use('/api/user',userRouter);

app.listen(port, () => {
    console.log('server running in port ' + port);
})
