"use client";
import type {ReactNode} from "react";import {CartProvider} from "./CartContext";import {AuthProvider} from "./AuthContext";import {WishlistProvider} from "./WishlistContext";
export default function AppProviders({children}:{children:ReactNode}){return <AuthProvider><WishlistProvider><CartProvider>{children}</CartProvider></WishlistProvider></AuthProvider>}
