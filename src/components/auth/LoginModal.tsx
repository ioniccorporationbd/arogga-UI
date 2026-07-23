/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FormEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Phone, RotateCcw, ShieldCheck, Sparkles, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { notify } from "@/lib/notify";
import styles from "./LoginModal.module.css";

const OTP_LENGTH = 6;
const EMPTY_OTP = Array(OTP_LENGTH).fill("");

function normalizeLocalPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits.slice(2, 13);
  return digits.slice(0, 11);
}

function validBangladeshPhone(value: string) {
  return /^01[3-9]\d{8}$/.test(normalizeLocalPhone(value));
}

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, loginReason } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const [resendIn, setResendIn] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const normalizedPhone = normalizeLocalPhone(phone);
  const phoneErrorId = error && step === "phone" ? "login-phone-error" : undefined;
  const otpErrorId = error && step === "otp" ? "login-otp-error" : undefined;

  useEffect(() => {
    if (!open) {
      setStep("phone"); setOtp(EMPTY_OTP); setError(""); setLoading(false); setResendIn(0); setExpiresIn(0); setAttemptsLeft(maxAttempts);
      return;
    }
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => phoneRef.current?.focus(), 60);
    function keydown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose, maxAttempts]);

  useEffect(() => {
    if (!open || step !== "otp" || (resendIn <= 0 && expiresIn <= 0)) return;
    const id = window.setInterval(() => {
      setResendIn((value) => Math.max(0, value - 1));
      setExpiresIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, step, resendIn, expiresIn]);

  if (!open) return null;

  async function requestOtp() {
    const response = await fetch("/api/auth/request-otp", {
      method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode, phone: normalizedPhone }),
    });
    const data = await response.json();
    if (!response.ok || !data?.ok) throw new Error(data?.error || "Could not send OTP");
    return data as { expiresInSeconds: number; resendInSeconds: number; maxAttempts: number };
  }

  async function submitPhone(event: FormEvent) {
    event.preventDefault();
    if (!validBangladeshPhone(phone)) { setError("Enter a valid Bangladeshi mobile number."); return; }
    setError(""); setLoading(true);
    try {
      const data = await requestOtp();
      setStep("otp"); setExpiresIn(data.expiresInSeconds || 300); setResendIn(data.resendInSeconds || 60);
      setMaxAttempts(data.maxAttempts || 5); setAttemptsLeft(data.maxAttempts || 5); setOtp(EMPTY_OTP);
      notify.auth.otpSent();
      window.setTimeout(() => refs.current[0]?.focus(), 60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send OTP";
      setError(message); notify.auth.loginFailed(message);
    } finally { setLoading(false); }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    const otpValue = otp.join("");
    if (!/^\d{6}$/.test(otpValue)) { setError("Enter the 6-digit OTP."); return; }
    if (expiresIn <= 0) { setError("OTP expired. Please request a new code."); return; }
    setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode, phone: normalizedPhone, otp: otpValue }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.error || "OTP verification failed");
      login(data.user || { phone: `+88${normalizedPhone}`, name: "Arogga User" });
      onClose();
    } catch (err) {
      setAttemptsLeft((value) => Math.max(0, value - 1));
      const message = err instanceof Error ? err.message : "OTP verification failed";
      setError(message); notify.auth.loginFailed(message);
    } finally { setLoading(false); }
  }

  async function resendOtp() {
    if (resendIn > 0 || loading) return;
    setLoading(true); setError("");
    try {
      const data = await requestOtp();
      setExpiresIn(data.expiresInSeconds || 300); setResendIn(data.resendInSeconds || 60); setAttemptsLeft(data.maxAttempts || maxAttempts); setOtp(EMPTY_OTP);
      notify.auth.otpSent(); window.setTimeout(() => refs.current[0]?.focus(), 60);
    } catch (err) { const message = err instanceof Error ? err.message : "Could not resend OTP"; setError(message); notify.auth.loginFailed(message); }
    finally { setLoading(false); }
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1); const next = [...otp]; next[index] = digit; setOtp(next); setError("");
    if (digit && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  }
  function keyOtp(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  }
  function pasteOtp(event: ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH); if (!digits) return;
    event.preventDefault(); const next = EMPTY_OTP.map((_, i) => digits[i] || ""); setOtp(next); refs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="login-title" aria-describedby="login-description">
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close login modal"><X /></button>
        <div className={styles.visual}>
          <div className={styles.orbit} /><div className={styles.visualIcon}>{step === "phone" ? <Phone /> : <ShieldCheck />}</div>
          <span className={styles.secureBadge}><Sparkles size={14} /> Secure Arogga access</span>
          <h2>{step === "phone" ? "Quick mobile login" : "Verify your mobile"}</h2>
          <p id="login-description">{step === "phone" ? loginReason : `We sent a 6-digit code to ${countryCode} ${normalizedPhone}.`}</p>
        </div>
        <div className={styles.formSide}>
          <div className={styles.kicker}>AROGGA ACCOUNT</div>
          <h1 id="login-title">{step === "phone" ? "Login" : "Enter OTP"}</h1>
          {step === "phone" ? (
            <form onSubmit={submitPhone} noValidate>
              <label htmlFor="login-phone">Mobile Number</label>
              <div className={`${styles.phoneField} ${error ? styles.fieldError : ""}`}>
                <span>{countryCode}</span>
                <input id="login-country" className={styles.countryInput} aria-label="Country code" value={countryCode} onChange={(e)=>setCountryCode(e.target.value.replace(/[^+\d]/g, "").slice(0,5) || "+880")} disabled={loading}/>
                <input ref={phoneRef} id="login-phone" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={(e)=>{setPhone(normalizeLocalPhone(e.target.value));setError("");}} placeholder="01XXXXXXXXX" aria-invalid={Boolean(error)} aria-describedby={phoneErrorId} disabled={loading}/>
              </div>
              {error ? <p id="login-phone-error" className={styles.error}>{error}</p> : null}
              <button className={styles.primary} type="submit" disabled={loading}>{loading ? <LoaderCircle className={styles.spin}/> : <Phone />} Request OTP</button>
            </form>
          ) : (
            <form onSubmit={submitOtp} noValidate>
              <button type="button" className={styles.backButton} onClick={() => setStep("phone")} disabled={loading}><ArrowLeft size={16}/> Change number</button>
              <div className={styles.otpGrid} aria-label="Six digit verification code">
                {otp.map((digit, index) => (
                  <input key={index} ref={(node)=>{refs.current[index]=node}} value={digit} onChange={(e)=>updateOtp(index,e.target.value)} onKeyDown={(e)=>keyOtp(index,e)} onPaste={pasteOtp} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} aria-label={`OTP digit ${index+1}`} aria-invalid={Boolean(error)} aria-describedby={otpErrorId} disabled={loading || attemptsLeft <= 0 || expiresIn <= 0}/>
                ))}
              </div>
              {error ? <p id="login-otp-error" className={styles.error}>{error}</p> : null}
              <div className={styles.timerRow}><span>Expires in {expiresIn}s · Attempts left {attemptsLeft}</span><button type="button" onClick={resendOtp} disabled={resendIn > 0 || loading}>{resendIn > 0 ? `Resend in ${resendIn}s` : <><RotateCcw size={14}/> Resend OTP</>}</button></div>
              <button className={styles.primary} type="submit" disabled={loading || attemptsLeft <= 0 || expiresIn <= 0}>{loading ? <LoaderCircle className={styles.spin}/> : <CheckCircle2/>} Verify & continue</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
