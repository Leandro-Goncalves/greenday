import { NowRequest, NowResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret } from '../../secrets/jwt.json'
import connectToDatabase from '../../databases/index'


export default async (req:NowRequest, res:NowResponse) => {
  const {token, email} = req.body;

  try{

  const db = await connectToDatabase(process.env.GODB_URI);
  const collection = db.collection("users");
  
  if(token){
    const user = await collection.findOne({token});
    if(user){
      res.json({error:false , user});
    }else{
      res.json({error:true});
    }
  }else{
    const user = await collection.findOne({email});
    if(!user){
      res.json({error:false});
    }else{
      res.json({error:true, errorMessage:"This E-mail is already in use"});
    }
  }
  }catch(err){
    res.json({error:true});
  }
  
}