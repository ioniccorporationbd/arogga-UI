/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
export type AuthUser={phone:string;name:string};
type Value={user:AuthUser|null;ready:boolean;login:(phone:string)=>void;logout:()=>void};
const C=createContext<Value|null>(null);const KEY="arogga-auth-user";
export function AuthProvider({children}:{children:ReactNode}){const[user,setUser]=useState<AuthUser|null>(null);const[ready,setReady]=useState(false);useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setUser(JSON.parse(raw))}catch{}setReady(true)},[]);const login=useCallback((phone:string)=>{const next={phone,name:"Arogga User"};localStorage.setItem(KEY,JSON.stringify(next));setUser(next)},[]);const logout=useCallback(()=>{localStorage.removeItem(KEY);setUser(null)},[]);const value=useMemo(()=>({user,ready,login,logout}),[user,ready,login,logout]);return <C.Provider value={value}>{children}</C.Provider>};
export function useAuth(){const v=useContext(C);if(!v)throw new Error("useAuth must be used inside AuthProvider");return v}
