import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '../../databases/index';
import { CreateJwt } from './_libs/CreateJwt';
import { v4 as uuid } from 'uuid';

export default async (req:NextApiRequest, res:NextApiResponse) => {
  const {refreshToken} = req.body;

  try{
    const db = await connectToDatabase(process.env.GODB_URI);
    
    const collection = db.collection("users");
    
    const newRefreshToken = uuid()
    const User = await collection.findOneAndUpdate(
      {refreshToken},{$set : {refreshToken:newRefreshToken}}
    );
    
    if(User.value){
      const { _id, email } = User.value;
      const token = CreateJwt({id:_id, email})
      res.send({error: false, token, refreshToken:newRefreshToken})
    } else {
      throw new Error()
    }
    
  } catch (err) {
    res.send({error: true})
  }
  
}