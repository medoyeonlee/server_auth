import bcrypt from 'bcrypt';
import {MD5} from 'crypto-js';
import jwt from 'jsonwebtoken';


// bcrypt.genSalt(10,(err,salt)=>{
//     if(err) return  next(err);

//     bcrypt.hash('password123',salt,(err,hash)=>{
//         if(err) return next(err);
//         console.log(hash);
//     })
// })

// const secret = 'mysecretpassword';
// const secretSalt = 'haha';

// const user = {
//     id:1,
//     token:MD5('hahaha').toString() + secretSalt
// }

// const receivedToken = '101a6ec9f938885df0a44f20458d2eb4haha'

// if(receivedToken === user.token){
//     console.log('move forward')
// }
// console.log(user)

const id = '1000';
const secret = 'supersecret';
const receivedToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.L9PmEqLlZjettygguzj25agunJu6NkvVtG9RFRBnK2Y'
const token = jwt.sign(id,secret);  //encode
 const decodeToken = jwt.verify(receivedToken,secret); //decode

console.log(token);
console.log(decodeToken);