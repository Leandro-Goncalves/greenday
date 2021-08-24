import axios from "axios";
import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/apiClient";

type User = {
  email: string;
  imageUrl: string;
  zoom: number;
  rotate: number;
}

type SignUpCredentials = {
  email: string;
  password: string;
  imageUrl: string;
  zoom: number;
  rotate: number;
}

type SignInCredentials = {
  email:string;
  password:string;
}

type AuthContextData = {
  signIn: (credentials:SignInCredentials) => Promise<void>;
  signUp: (credentials:SignUpCredentials) => Promise<void>;
  user: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export async function signOut(){
  destroyCookie(null, "greenday.token", {path: "/"})
  destroyCookie(null, "greenday.refreshToken", {path: "/"})

  Router.push("/")
}

export function AuthProvider({ children }:AuthProviderProps) {

  const [user, setUser] = useState<User>(null);
  
  const isAuthenticated = !!user

  useEffect(() => {
    const {'greenday.token': token} = parseCookies()

    if(token){
      api.post("/verify")
        .then((response) => {
          const user = response?.data?.user;
          if(user){
            setUser(user)
          }
        })
        .catch(() => {
          signOut()
        })
    }
  }, []);

  useEffect(()=>{
    console.log(user)
  },[user]);  

  async function signIn({email, password}:SignInCredentials){
    const {data:response} = await api.post('/signIn', {email, password});
    if(response.error){
      toast.error(response.message);
    }else{
      const { token, refreshToken, imageUrl, zoom, rotate } = response
      setUser({
        email,
        imageUrl,
        zoom,
        rotate
      })
      setCookie(null,"greenday.token",token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      });
      setCookie(null,"greenday.refreshToken",refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`
      Router.push("/home");
    }
  }

  async function signUp({
    email,
    password,
    imageUrl,
    rotate,
    zoom
  }:SignUpCredentials){
    const signUp = await api.post('/signUp', {
      email,
      password,
      imageUrl,
      zoom,
      rotate
    });
    const {error, errorMessage, token, refreshToken} = signUp.data;
    if(error){
      throw new Error(errorMessage);
    }
    setCookie(null,"greenday.token",token, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/"
    });
    setCookie(null,"greenday.refreshToken",refreshToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/"
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`
    Router.push("/home");
  }

  return(
    <AuthContext.Provider value={{
      signIn,
      user,
      signUp,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}