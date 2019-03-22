import {User} from './../models/user';
import { IUserDocument } from '../server';
import Mongoose from 'mongoose';

import { NextFunction } from 'connect';
import { Request, Response } from 'express';
import { AnyARecord } from 'dns';


export let auth = (req:any,res:any,next:NextFunction)=>{
    let token = req.cookies.auth;
    User.findByToken(token,(err:Error,user:IUserDocument)=>{
        if(err) throw err;
        if(!user) return res.status(401).send('no access');

        req.token= token;
        next();
    })
}


