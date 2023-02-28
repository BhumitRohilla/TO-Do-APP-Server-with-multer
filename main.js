const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const port = 3000;
const hostName = '127.0.0.1';
const upload = multer({dest: 'upload/'});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());

app.use(express.static('upload'));

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

app.post('/submittask',upload.single('task-img'),(req,res)=>{
    const data = Object.assign({},req.body);
    data.file = req.file.filename;
    data.id ='a'+crypto.randomBytes(20).toString('hex');
    data.status = false;
    data["task-name"] = data["task-name"].trim();
    if(data["task-name"] == ""){
        res.send(404);
        res.send();
        return ;
    }
    // console.log(data);
    readFile('./task.json',function(fdata){
        if(fdata.length == 0){
            fdata = []
        }else{
            fdata = JSON.parse(fdata);
        }
        fdata.push(data);
        
        fdata = JSON.stringify(fdata);
        
        writeFile('./task.json',fdata,function(){
            res.status = 200;
            res.send();
        },function(){
            res.statusCode = 404;
            res.send();
        })
    },function(){
        res.statusCode= 404;
        res.send();
    })
})


app.get('/getList',(req,res)=>{
    readFile('./task.json',function(data){
        data = JSON.parse(data);
        res.render('data.ejs',{'data':data});
    },function(){
        res.statusCode = 404;
        res.send();
    })
})


app.delete('/delList',(req,res)=>{
    // console.log(req.body);
    readFile('./task.json',function(data){
        data = JSON.parse(data);
        let imagevalue  = null ;
        data = data.filter((element)=>{
            if(element.id == req.body.id){
                imagevalue = element.file;
                return false;
            }
            return true;
        })
        // console.log(imagevalue);
        fs.unlink(`./upload/${imagevalue}`,function(err){

        });
        writeFile('./task.json',JSON.stringify(data),function(){
            res.statusCode = 200;
            res.send();
        },function(){
            res.statusCode = 303;
            res.send();
        })
    },function(){
        res.statusCode = 303;
        res.send();
    })

})

function readFile(fileName,callback,callback2){
    fs.readFile(fileName,(err,data)=>{
        if(err){
            callback2();
        }else{
            callback(data);
        }
    })
}

function writeFile(fileName,string,callback,callback2){
    fs.writeFile(fileName,string,function(err){
        if(!err){
            callback();
        }else{
            callback2();
        }
    });
}

app.put('/checkbox',(req,res)=>{
    // console.log(req.body);
    let id = req.body.id;
    readFile('./task.json',function(data){
        data = JSON.parse(data);
        data = data.map((element)=>{
            if(element.id == id){
                element.status = !element.status;
            }
            return element;
        })
        writeFile('./task.json',JSON.stringify(data),function(){
            res.statusCode == 200;
            res.send();
        },function(){
            res.statusCode = 303;
            res.send();
        })
    },function(){
        res.statusCode = 303;
        res.send();
    })
})

app.listen(port,hostName);