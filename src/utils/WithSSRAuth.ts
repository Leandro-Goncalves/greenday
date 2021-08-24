import nookies, { destroyCookie } from 'nookies';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { AuthTokenError } from '../services/Errors/AuthTokenError';

export function WithSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps<P> {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const {"greenday.token":token} = nookies.get(ctx);
    if(!token){
      //const response = await verify(token)
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
    try{
      return await fn(ctx)
    } catch(err) {
      if(err instanceof AuthTokenError){
        destroyCookie(ctx, "greenday.token");
        destroyCookie(ctx, "greenday.refreshToken");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          }
        }
      }
    }
  }
}