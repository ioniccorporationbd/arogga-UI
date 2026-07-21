/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Phone, ShieldCheck, Sparkles, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import styles from "./MobileLoginModal.module.css";

const EMPTY_OTP = ["", "", "", "", "", ""];
const DEMO_OTP = "123456";

export default function MobileLoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setOtp(EMPTY_OTP);
      setError("");
      setLoading(false);
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

  if (!open) return null;

  const normalizedPhone = phone.replace(/\D/g, "");
  const valid = /^01[3-9]\d{8}$/.test(normalizedPhone);

  async function submitPhone(event: FormEvent) {
    event.preventDefault();
    if (!valid) {
      setError("Enter a valid Bangladeshi mobile number.");
      return;
    }

    setError("");
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    setLoading(false);
    setStep("otp");
    window.setTimeout(() => refs.current[0]?.focus(), 60);
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    if (otp.join("") !== DEMO_OTP) {
      setError("Invalid OTP. Demo OTP is 123456.");
      return;
    }

    setError("");
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    login(normalizedPhone);
    setLoading(false);
    onClose();
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");
    if (digit) refs.current[index + 1]?.focus();
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="mobile-login-title">
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
          <p>
            {step === "phone"
              ? "Use your mobile number to access orders, wishlist and account with a cleaner flow."
              : `We sent a 6-digit code to ${normalizedPhone}.`}
          </p>
        </div>

        <div className={styles.formSide}>
          <div className={styles.kicker}>AROGGA ACCOUNT</div>
          <h1 id="mobile-login-title">{step === "phone" ? "Login" : "Enter OTP"}</h1>

          {step === "phone" ? (
            <form onSubmit={submitPhone}>
              <label htmlFor="mobile-login-phone">Mobile Number</label>
              <div className={`${styles.phoneField} ${error ? styles.fieldError : ""}`}>
                <span>+88</span>
                <input
                  id="mobile-login-phone"
                  autoFocus
                  inputMode="numeric"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value.replace(/\D/g, "").slice(0, 11));
                    setError("");
                  }}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              {error ? <p className={styles.error}>{error}</p> : null}
              <button className={styles.primary} disabled={loading}>
                {loading ? <LoaderCircle className={styles.spinner} size={18} /> : <ShieldCheck size={18} />}
                Send OTP
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
              <div className={styles.otp}>
                {otp.map((value, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      refs.current[index] = element;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !value) refs.current[index - 1]?.focus();
                    }}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>
              <div className={styles.demoHint}>Demo OTP: {DEMO_OTP}</div>
              {error ? <p className={styles.error}>{error}</p> : null}
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
