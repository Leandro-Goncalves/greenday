import jwt from 'jsonwebtoken';

type CreateJwtProps = {
  id: string;
  email: string
}

export function CreateJwt({id, email}:CreateJwtProps) {
  return( 
    jwt.sign({
      id:id
    }, process.env.JWT_SECRET, { expiresIn: 15, subject:email })
  )
}