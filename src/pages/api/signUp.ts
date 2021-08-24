import { NowRequest, NowResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import connectToDatabase from '../../databases/index'
import { CreateJwt } from './_libs/CreateJwt';
import { v4 as uuid } from 'uuid';


export default async (req:NowRequest, res:NowResponse) => {
  const {email,password, imageUrl, zoom, rotate} = req.body;

  try{

  const db = await connectToDatabase(process.env.GODB_URI);
  const collection = db.collection("users");

  const CheckEmail = await collection.findOne({email});
  if(CheckEmail){
    res.json({error:true, errorMessage:"This E-mail is already in use"});
  }else{
    bcrypt.hash(password, 10, async function(err, hash) {
      if(err){
        res.json({error:true, errorMessage:err.message});
        return
      }

      const refreshToken = uuid();
      const User = await collection.insertOne({
        email,
        password:hash,
        refreshToken,
        imageUrl,
        zoom,
        rotate,
        createAt: new Date()
      });
      const {_id} = User.ops[0]
      const token = CreateJwt({id:_id, email})
     
      res.json({error:false, token, refreshToken});
    });
  }
  }catch(err){
    res.json({error:true, errorMessage:"Something is wrong"});
  }
  
}