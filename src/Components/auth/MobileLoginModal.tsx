/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FormEvent, ClipboardEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Phone, RotateCcw, ShieldCheck, Sparkles, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { notify } from "@/lib/toast";
import styles from "./MobileLoginModal.module.css";

const EMPTY_OTP = ["", "", "", "", "", ""];
const DEMO_OTP = "123456";
const OTP_SECONDS = 120;

function normalizeLocalPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("880")) return digits.slice(2, 13);
  return digits.slice(0, 11);
}

export default function MobileLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setOtp(EMPTY_OTP);
      setError("");
      setLoading(false);
      setTimer(0);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const id = window.setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(id);
  }, [step, timer]);

  if (!open) return null;

  const normalizedPhone = normalizeLocalPhone(phone);
  const valid = /^01[3-9]\d{8}$/.test(normalizedPhone);

  async function requestOtp() {
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode, phone: normalizedPhone }),
    });
    const data = await response.json();
    if (!response.ok || !data?.ok) throw new Error(data?.error || "Could not send OTP");
    return data;
  }

  async function submitPhone(event: FormEvent) {
    event.preventDefault();
    if (!valid) {
      setError("Enter a valid Bangladeshi mobile number.");
      notify.error("Enter a valid Bangladeshi mobile number");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await requestOtp();
      setStep("otp");
      setTimer(data?.expiresInSeconds || OTP_SECONDS);
      notify.success("OTP sent successfully");
      window.setTimeout(() => refs.current[0]?.focus(), 60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send OTP";
      setError(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    const otpValue = otp.join("");
    if (!/^\d{6}$/.test(otpValue)) {
      setError("Enter the 6-digit OTP.");
      notify.warning("Enter the 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode, phone: normalizedPhone, otp: otpValue }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.error || `Invalid OTP. Demo OTP is ${DEMO_OTP}.`);
      login(data.user?.phone || normalizedPhone, data.user);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "OTP verification failed";
      setError(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (timer > 0 || loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await requestOtp();
      setTimer(data?.expiresInSeconds || OTP_SECONDS);
      setOtp(EMPTY_OTP);
      notify.success("OTP resent successfully");
      window.setTimeout(() => refs.current[0]?.focus(), 60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not resend OTP";
      setError(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit) refs.current[index + 1]?.focus();
  }

  function pasteOtp(event: ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (digits.length < 2) return;
    event.preventDefault();
    const next = EMPTY_OTP.map((_, index) => digits[index] || "");
    setOtp(next);
    refs.current[Math.min(digits.length, 6) - 1]?.focus();
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="mobile-login-title" aria-describedby="mobile-login-description">
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close login modal">
          <X />
        </button>

        <div className={styles.visual}>
          <div className={styles.orbit} />
          <div className={styles.visualIcon}>{step === "phone" ? <Phone /> : <ShieldCheck />}</div>
          <span className={styles.secureBadge}>
            <Sparkles size={14} /> Smooth secure access
          </span>
          <h2>{step === "phone" ? "Quick & secure login" : "Verify your mobile"}</h2>
          <p id="mobile-login-description">
            {step === "phone"
              ? "Use your mobile number to access orders, wishlist and account with a cleaner flow."
              : `We sent a 6-digit code to ${countryCode} ${normalizedPhone}.`}
          </p>
        </div>

        <div className={styles.formSide}>
          <div className={styles.kicker}>AROGGA ACCOUNT</div>
          <h1 id="mobile-login-title">{step === "phone" ? "Login" : "Enter OTP"}</h1>

          {step === "phone" ? (
            <form onSubmit={submitPhone}>
              <label htmlFor="mobile-login-phone">Mobile Number</label>
              <div className={`${styles.phoneField} ${error ? styles.fieldError : ""}`}>
                <span>{countryCode}</span>
                <input
                  id="mobile-login-country"
                  className={styles.countryInput}
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value.replace(/[^+\d]/g, "").slice(0, 5) || "+880")}
                />
                <input
                  id="mobile-login-phone"
                  autoFocus
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(event) => {
                    setPhone(normalizeLocalPhone(event.target.value));
                    setError("");
                  }}
                  placeholder="01XXXXXXXXX"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "mobile-login-error" : undefined}
                />
              </div>
              {error ? <p id="mobile-login-error" className={styles.error}>{error}</p> : null}
              <button className={styles.primary} disabled={loading}>
                {loading ? <LoaderCircle className={styles.spinner} size={18} /> : <ShieldCheck size={18} />}
                Request OTP
              </button>
            </form>
          ) : (
            <form onSubmit={submitOtp}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => {
                  setStep("phone");
                  setError("");
                }}
              >
                <ArrowLeft size={16} /> Change number
              </button>
              <div className={styles.otp} aria-label="6-digit OTP code">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      refs.current[index] = element;
                    }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={value}
                    onPaste={pasteOtp}
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !value) refs.current[index - 1]?.focus();
                      if (event.key === "ArrowLeft") refs.current[index - 1]?.focus();
                      if (event.key === "ArrowRight") refs.current[index + 1]?.focus();
                    }}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>
              <div className={styles.demoHint}>Development demo OTP: {DEMO_OTP}</div>
              <div className={styles.timerRow} aria-live="polite">
                <span>{timer > 0 ? `Resend available in ${timer}s` : "Didn't receive the OTP?"}</span>
                <button type="button" onClick={resendOtp} disabled={timer > 0 || loading}>
                  <RotateCcw size={14} /> Resend OTP
                </button>
              </div>
              {error ? <p id="mobile-login-error" className={styles.error}>{error}</p> : null}
              <button className={styles.primary} disabled={loading}>
                {loading ? <LoaderCircle className={styles.spinner} size={18} /> : <CheckCircle2 size={18} />}
                Verify & Login
              </button>
            </form>
          )}

          <p className={styles.terms}>By continuing, you agree to our Terms, Privacy Policy and Refund Policy.</p>
        </div>
      </section>
    </div>
  );
}
