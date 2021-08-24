import axios, { AxiosError } from 'axios'
import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { signOut } from '../context/Authcontext';
import { AuthTokenError } from './Errors/AuthTokenError';


let isRefreshing = false;
let failedRequestQueue = [];

export function setupApiClient(ctx = null) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      Authorization: `Bearer ${cookies['greenday.token']}`
    }
  })
  
  api.interceptors.response.use(
    response=>response,
    (error: AxiosError) => {
      if(error.response.status === 401){
        if(error.response.data?.errorMessage === "jwt expired"){
          cookies = parseCookies(ctx);
          
          const { "greenday.refreshToken": refreshToken } = cookies;
          const originalConfig = error.config;
  
          if(!isRefreshing){
            isRefreshing = true;
            api.post("/refresh", {
              refreshToken
            }).then(response => {
              const { token, error } = response.data;
              if(error){
                return
              }
    
              setCookie(ctx,"greenday.token",token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/"
              });
    
              setCookie(ctx,"greenday.refreshToken", response.data.refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/"
              });
              
              api.defaults.headers['Authorization'] = `Bearer ${token}`
              failedRequestQueue.forEach(request => request.resolve(token))
              failedRequestQueue = [];
            }).catch(err => {
              failedRequestQueue.forEach(request => request.reject(err))
              failedRequestQueue = [];
  
              if (process.browser) {
                signOut()
              }
            }).finally(() => {
              isRefreshing = false;
            })
          }
  
          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              resolve: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`;
                resolve(api(originalConfig));
              },
              reject: (err: AxiosError) => {
                reject(err);
              },
            })
          });
        } else {
          if (process.browser) {
            signOut()
          } else {
            return Promise.reject(new AuthTokenError())
          }
        }
      }
      return Promise.reject(error);
    }
  )

  return api
}