import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { Document } from 'mongoose';
import {User} from './models/user';
import { MongoCallback } from 'mongodb';
import { Hash } from 'crypto';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import {auth} from './middleware/auth';

export interface IUserDocument extends Document{
    _id:Hash;
    email:string;
    password:string;
    token:string;
    comparePassword:Function;
    generateToken:Function;
    findByToken:Function;
}
const app = express();

const config = {
    useNewUrlParser:true
}
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth',config)


app.use(bodyParser.json())
app.use(cookieParser());

app.post('/api/user',(req,res)=>{
    const user = new User({
        email:req.body.email,
        password:req.body.password
    })

    user.save((err:Error,doc:IUserDocument)=>{
        if(err) res.status(404).send(err)
        
        res.status(200).send(doc)
        
       
    })
})

app.post('/api/user/login',(req,res)=>{
    User.findOne({'email':req.body.email},(err,user)=>{
        if(!user) res.json({message:'Auth failed, user not found'})
        
       user!.comparePassword(req.body.password,(err:Error,isMatch:Boolean)=>{
            if(err) throw err;
            if(!isMatch) return res.status(400).json({
                message:'Wrong password'
            })
            user!.generateToken((err:Error,user:IUserDocument)=>{
                if(err) return res.status(400).send(err);
                
                res.cookie('auth',user.token).send('ok')
            })
       
    })
})
})


app.get('/user/profile',auth,(req:any,res)=>{
    console.log(req)
    res.status(200).send(req.token);
   
})


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`started on port ${port}`)
})

export {}
