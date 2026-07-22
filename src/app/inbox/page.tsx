"use client";

import { Inbox } from "lucide-react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import "./inbox.css";

export default function Page() {
  const { user, ready } = useAuth();

  if (ready && !user) {
    return (
      <ProtectedActionPrompt
        title="Login to view inbox"
        message="Messages, order updates and support notifications are private. Login to continue."
        reason="Login to read your inbox messages."
      />
    );
  }

  return (
    <main className="inbox-page">
      <h1>Inbox</h1>
      <section>
        <Inbox />
        <h2>Your inbox is empty</h2>
        <p>Order updates, offers and support messages will appear here.</p>
      </section>
    </main>
  );
}
