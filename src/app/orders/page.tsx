"use client";

import Link from "next/link";
import { PackageSearch } from "lucide-react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import "./orders.css";

export default function Page() {
  const { user, ready } = useAuth();

  if (ready && !user) {
    return (
      <ProtectedActionPrompt
        title="Login to view orders"
        message="Your order history and delivery status are private. Login to continue."
        reason="Login to see your orders."
      />
    );
  }

  return (
    <main className="orders-page">
      <div><span>Account</span><h1>My Orders</h1></div>
      <section>
        <PackageSearch />
        <h2>No orders yet</h2>
        <p>When you place an order, its status and delivery updates will appear here.</p>
        <Link href="/store">Start Shopping</Link>
      </section>
    </main>
  );
}
