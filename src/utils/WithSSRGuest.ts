import nookies from 'nookies';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export function WithSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps<P> {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const {"greenday.token":token} = nookies.get(ctx);
    if(token){
      //const response = await verify(token)
      return {
        redirect: {
          destination: '/home',
          permanent: false
        }
      }
    }
    return await fn(ctx)
  }
}