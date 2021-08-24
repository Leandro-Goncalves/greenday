import { NowRequest, NowResponse } from '@vercel/node';
import connectToDatabase from '../../databases/index'

type user = {
  image: string;
  rotate: number;
  zoom: number;
}

export default async (req:NowRequest, res:NowResponse) => {
  const {email} = req.body;

  try{
    const db = await connectToDatabase(process.env.GODB_URI);
    const collection = db.collection("users");
    const User = await collection.findOne({email}) as user;
    if(User){
      return res.json({error:true, errorMessage:"This E-mail is already in use"});
    }
    return res.json({error:false});
  }catch(err){
    res.json({error:true, errorMessage:err.message});
  }
  
}