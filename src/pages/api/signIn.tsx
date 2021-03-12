import { NowRequest, NowResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret } from '../../secrets/jwt.json'
import connectToDatabase from '../../databases/index'


export default async (req:NowRequest, res:NowResponse) => {
  const {email,password} = req.body;

  try{

    const db = await connectToDatabase(process.env.GODB_URI);
    const collection = db.collection("users");

    const User = await collection.findOne({email});
    if(User){
     
      bcrypt.compare(password, User.password, async function(err, result) {
        if(err){
          res.json({error:true, errorMessage:"Something is wrong"});
        }
        else if(result){
          const token = jwt.sign({
            data: email
          }, secret, { expiresIn: 600 * 60 });

          await collection.findOneAndUpdate({email},{$set : {token}});

          res.json({error:false, token});
        }else{
          res.json({error:true, errorMessage:"Invalid email and / or password "});
        }
      });
    }else {
      res.json({error:true, errorMessage:"Invalid email and / or password "});
    }
  }catch(err){
    res.json({error:true, errorMessage:"Something is wrong"});
  }
  
}