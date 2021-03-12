import { NowRequest, NowResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { secret } from '../../secrets/jwt.json'
import connectToDatabase from '../../databases/index'


export default async (req:NowRequest, res:NowResponse) => {
  const {email,password, image, zoom, rotate} = req.body;

  try{

  const db = await connectToDatabase(process.env.GODB_URI);
  const collection = db.collection("users");

  const checkUser = await collection.findOne({email});
  if(checkUser){
    res.json({error:true, errorMessage:"This E-mail is already in use"});
  }else{

    const token = jwt.sign({
      data: email
    }, secret, { expiresIn: 600 * 60 });

    bcrypt.hash(password, 10, async function(err, hash) {
      await collection.insertOne({
        email,
        password:hash,
        token,
        image,
        zoom,
        rotate,
        createAt: new Date()
      });
      res.json({error:false, token});
    });
  }
  }catch(err){
    res.json({error:true, errorMessage:"Something is wrong"});
  }
  
}