import { NowRequest, NowResponse } from '@vercel/node';
import bcrypt from 'bcrypt';
import connectToDatabase from '../../databases/index'
import { v4 as uuid } from 'uuid'
import { CreateJwt } from './_libs/CreateJwt';

async function signIn(email:string, password:string){
  const db = await connectToDatabase(process.env.GODB_URI);
  const collection = db.collection("users");

  const User = await collection.findOne({email});
    if(User){
    const compare = await bcrypt.compare(password, User.password);
    if(compare){
      const refreshToken = uuid()

      const token = CreateJwt({id:User._id, email:User.email})

      await collection.findOneAndUpdate({email},{$set : {refreshToken}});
      return {
        token,
        zoom:User.zoom,
        rotate:User.rotate,
        email:User.email,
        imageUrl: User.imageUrl,
        refreshToken
      };
    }else{
      throw new Error("Invalid email and / or password");
    }
  }else {
    throw new Error("Invalid email and / or password");
  }
}


export default async (req:NowRequest, res:NowResponse) => {
  const {email,password} = req.body;

  try{

    const response = await signIn(email, password);
    res.send({error: false, ...response});
    
  }catch(err){
    res.json({error:true, message:err.message});
  }
  
}