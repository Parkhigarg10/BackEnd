
const express=require('express');
const app=express();
const fs=require('fs');
const path=require('path');
const logFilePath = path.join(__dirname, 'requests.log');

app.use((req,res,next)=>{
    const logEntry={
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        hostname: req.hostname,
    };
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    next();
});

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.get('/about',(req,res)=>{
    res.send('About Us');
});

app.get('/profile/:commentId/:Id',(req,res)=>{
    console.log(req.params);
    const {commentId,Id}=req.params;
    res.send('Comment ID: ${req.params.commentId} and ID: ${req.params.Id}');
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});