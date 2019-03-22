import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../server';
import { EndCallback } from 'mongodb';
import { Hash } from 'crypto';
import jwt from 'jsonwebtoken';

const SALT_I = 10;

const userSchema =new Schema({
    id: String,
    email:{
        type:String,
        require:true,
        trim:true,
        unique:1 //true
    },
    password:{
        type:String,
        required:true,
        minlength:6

    },
    token:{
        type:String
    }


})


userSchema.pre<IUserDocument>('save',function(next){
    let user= this;
    console.log('here'+user);
    
  
    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err,salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            }
        )
    })
    }
    else {
        next();
    }

})
//methods는 model전에
userSchema.methods.comparePassword = function(candidatePassword:Hash,cb:any){
    bcrypt.compare(candidatePassword,this!.password,(err,isMatch)=>{
        if(err) throw cb(err);
        
        cb(null,isMatch);
    })
}

userSchema.methods.generateToken = function(cb:any){
    let user = this;
    let token = jwt.sign(this._id.toHexString(),'supersecret');  //나중엔 두번째인자를 env로 따로해서 불러옴

    user.token = token;
    user.save(function(err:Error,user:IUserDocument){
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.statics.findByToken = function(token:string,cb:any){
    const user = this;
    
    jwt.verify(token,'supersecret',(err,decode)=>{
       user.findOne({"_id":decode,"token":token},(err:Error,user:IUserDocument)=>{
            if(err) return cb(err);
            cb(null,user);
       })
    });
}
export const User = mongoose.model<IUserDocument>('User',userSchema);

// module.exports = {User}
