"use client";

import { useEffect, useState } from "react";
import { notify } from "@/lib/notify";
import { addressSchema, type LocalAddress, upsertAddress, removeAddress, setDefaultAddress } from "@/lib/account/address-domain";
import { markMessageRead, markAllRead, archiveMessage, deleteMessage, type InboxMessage } from "@/lib/account/account-summary";
import type { LocalOrder } from "@/lib/orders/local-order-repository";

const phone = "local";
function readJson<T>(key: string, fallback: T): T { if (typeof window === "undefined") return fallback; try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
function writeJson<T>(key: string, value: T) { if (typeof window !== "undefined") { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event("arogga-account-updated")); } }
const orderKey = `arogga-orders:${phone}`; const inboxKey = `arogga-inbox:${phone}`; const addrKey = `arogga-addresses:${phone}`;
export function useLocalOrders(){const [orders,setOrders]=useState<LocalOrder[]>([]);useEffect(()=>{const sync=()=>setOrders(readJson(orderKey,[]));sync();window.addEventListener("arogga-account-updated",sync);return()=>window.removeEventListener("arogga-account-updated",sync)},[]);return orders;}
export function useLocalInbox(){const [messages,setMessages]=useState<InboxMessage[]>([]);useEffect(()=>{const sync=()=>setMessages(readJson(inboxKey,[]));sync();window.addEventListener("arogga-account-updated",sync);return()=>window.removeEventListener("arogga-account-updated",sync)},[]);function save(next:InboxMessage[]){setMessages(next);writeJson(inboxKey,next)}return {messages,markRead:(id:string)=>save(markMessageRead(messages,id)),markAll:()=>save(markAllRead(messages,phone)),archive:(id:string)=>save(archiveMessage(messages,id)),remove:(id:string)=>save(deleteMessage(messages,id))};}
export function useLocalAddresses(){const [addresses,setAddresses]=useState<LocalAddress[]>([]);useEffect(()=>{const sync=()=>setAddresses(readJson(addrKey,[]));sync();window.addEventListener("arogga-account-updated",sync);return()=>window.removeEventListener("arogga-account-updated",sync)},[]);function save(next:LocalAddress[]){setAddresses(next);writeJson(addrKey,next)}return {addresses,saveAddress:(input:LocalAddress)=>{const parsed=addressSchema.parse(input);save(upsertAddress(addresses,parsed));notify.address.saved()},remove:(id:string)=>{save(removeAddress(addresses,id));notify.success("Address removed")},setDefault:(id:string)=>{save(setDefaultAddress(addresses,id));notify.success("Default address changed")}};}
