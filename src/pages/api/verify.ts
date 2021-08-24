import { NowRequest, NowResponse } from '@vercel/node';
import connectToDatabase from '../../databases/index'
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

type user = {
  imageUrl: string;
  rotate: number;
  zoom: number;
  email: string;
}

export async function verify(token:string){
  const db = await connectToDatabase(process.env.GODB_URI);
  const collection = db.collection("users");
  
  if(!token){
    throw new Error("Token is null");
  }

  const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)
  const id = new ObjectId(tokenDecoded["id"])
  
  const user = await collection.findOne({_id: id}) as user;

  if(user){
    return {
      error:false,
      user:{
        email:user.email,
        rotate:user.rotate,
        zoom:user.zoom,
        imageUrl:user.imageUrl,
      }
    };
  }else{
    throw new Error("Token Error");
  }
}

export default async (req:NowRequest, res:NowResponse) => {
  try{
    const token = req.headers['authorization'].replace(/^Bearer\s+/, "");
    const response = await verify(token);
    res.json(response)  

  }catch(err){
    res.status(401).json({error:true, errorMessage:err.message});
  }
  
}