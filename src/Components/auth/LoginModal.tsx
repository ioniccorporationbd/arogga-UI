"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./LoginModal.module.css";

type LoginStep = "credentials" | "otp" | "success";
type LoginMethod = "phone" | "email";
type SocialProvider = "google" | "linkedin" | "facebook";

export type AuthenticatedUser = {
  name: string;
  identifier: string;
  provider: "password" | "otp" | SocialProvider;
};

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onAuthenticated?: (user: AuthenticatedUser) => void;
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const DEMO_OTP = "123456";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function isValidBangladeshPhone(value: string) {
  const phone = normalizePhone(value);
  return /^(?:88)?01[3-9]\d{8}$/.test(phone);
}

function getDisplayIdentifier(method: LoginMethod, value: string) {
  if (method === "email") return value.trim();
  const phone = normalizePhone(value).replace(/^88/, "");
  return `+88 ${phone}`;
}

export default function LoginModal({
  open,
  onClose,
  onAuthenticated,
}: LoginModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [step, setStep] = useState<LoginStep>("credentials");
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const joinedOtp = useMemo(() => otp.join(""), [otp]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => firstInputRef.current?.focus(), 80);

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || step !== "otp" || resendIn <= 0) return;
    const timer = window.setInterval(() => {
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open, step, resendIn]);

  useEffect(() => {
    if (!open) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setStep("credentials");
      setOtp(Array(OTP_LENGTH).fill(""));
      setError("");
      setLoading(false);
      setResendIn(RESEND_SECONDS);
    }
  }, [open]);

  if (!open) return null;

  function validateCredentials() {
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError(method === "phone" ? "Please enter your mobile number." : "Please enter your email address.");
      return false;
    }

    if (method === "phone" && !isValidBangladeshPhone(cleanIdentifier)) {
      setError("Enter a valid Bangladeshi mobile number, for example 01883650010.");
      return false;
    }

    if (method === "email" && !isValidEmail(cleanIdentifier)) {
      setError("Enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleCredentialSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateCredentials()) return;

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setLoading(false);
    setStep("otp");
    setResendIn(RESEND_SECONDS);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }

  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;

    const next = Array(OTP_LENGTH).fill("");
    digits.split("").forEach((digit, index) => {
      next[index] = digit;
    });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, OTP_LENGTH) - 1]?.focus();
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (joinedOtp.length !== OTP_LENGTH) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    if (joinedOtp !== DEMO_OTP) {
      setError("The verification code is incorrect. Use 123456 in demo mode.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setLoading(false);
    setStep("success");

    const user: AuthenticatedUser = {
      name: method === "email" ? identifier.split("@")[0] || "Arogga User" : "Arogga User",
      identifier: getDisplayIdentifier(method, identifier),
      provider: "otp",
    };

    window.localStorage.setItem("arogga-user", JSON.stringify(user));
    onAuthenticated?.(user);
    window.setTimeout(onClose, 900);
  }

  function handleResend() {
    if (resendIn > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setResendIn(RESEND_SECONDS);
    otpRefs.current[0]?.focus();
  }

  async function handleSocialLogin(provider: SocialProvider) {
    setLoading(true);
    setError("");
    await new Promise((resolve) => window.setTimeout(resolve, 650));

    const providerName = provider[0].toUpperCase() + provider.slice(1);
    const user: AuthenticatedUser = {
      name: `${providerName} User`,
      identifier: `${provider}@example.com`,
      provider,
    };

    window.localStorage.setItem("arogga-user", JSON.stringify(user));
    onAuthenticated?.(user);
    setLoading(false);
    setStep("success");
    window.setTimeout(onClose, 900);
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close login modal">
          <X size={22} />
        </button>

        <section className={styles.illustrationPanel} aria-hidden="true">
          <div className={styles.illustrationGlow} />
          <div className={styles.phoneMockup}>
            <div className={styles.phoneTop} />
            <div className={styles.phoneScreen}>
              <div className={styles.mockProduct} />
              <div className={styles.mockLines}>
                <i />
                <i />
                <i />
              </div>
              <span>ADD TO CART</span>
            </div>
          </div>
          <div className={styles.person}>
            <div className={styles.personHead} />
            <div className={styles.personBody} />
            <div className={styles.personArm} />
          </div>
          <div className={styles.panelCopy}>
            <span className={styles.panelBadge}><ShieldCheck size={15} /> Secure account access</span>
            <h2>Quick, safe and easy ordering</h2>
            <p>Sign in to order medicines, book lab tests, consult doctors and track every delivery.</p>
            <div className={styles.featureRow}>
              <span><CheckCircle2 size={16} /> Secure verification</span>
              <span><CheckCircle2 size={16} /> Faster checkout</span>
            </div>
          </div>
        </section>

        <section className={styles.formPanel}>
          {step === "success" ? (
            <div className={styles.successState}>
              <span><CheckCircle2 size={36} /></span>
              <h2>Login successful</h2>
              <p>Your account has been verified. The login window will close automatically.</p>
            </div>
          ) : step === "otp" ? (
            <>
              <button type="button" className={styles.backButton} onClick={() => { setStep("credentials"); setError(""); }}>
                <ArrowLeft size={17} /> Back
              </button>

              <div className={styles.heading}>
                <span className={styles.headingIcon}><KeyRound size={22} /></span>
                <div>
                  <h1 id="login-modal-title">Verify your account</h1>
                  <p>Enter the 6-digit code sent to <strong>{getDisplayIdentifier(method, identifier)}</strong>.</p>
                </div>
              </div>

              <form onSubmit={handleOtpSubmit} noValidate>
                <label className={styles.label}>Verification code</label>
                <div className={styles.otpGroup}>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(element) => { otpRefs.current[index] = element; }}
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={value}
                      onChange={(event) => updateOtp(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      onPaste={handleOtpPaste}
                      aria-label={`OTP digit ${index + 1}`}
                      className={error ? styles.inputError : ""}
                    />
                  ))}
                </div>

                <div className={styles.demoOtp}>Demo verification code: <strong>{DEMO_OTP}</strong></div>

                {error ? <p className={styles.errorMessage}>{error}</p> : null}

                <div className={styles.resendRow}>
                  <span>Didn&apos;t receive the code?</span>
                  <button type="button" onClick={handleResend} disabled={resendIn > 0}>
                    {resendIn > 0 ? `Resend in 00:${String(resendIn).padStart(2, "0")}` : "Resend code"}
                  </button>
                </div>

                <button type="submit" className={styles.primaryButton} disabled={loading}>
                  {loading ? <LoaderCircle className={styles.spinner} size={20} /> : <ShieldCheck size={19} />}
                  Verify & Login
                </button>
              </form>
            </>
          ) : (
            <>
              <div className={styles.heading}>
                <span className={styles.headingIcon}><LockKeyhole size={22} /></span>
                <div>
                  <h1 id="login-modal-title">Welcome back</h1>
                  <p>Login to place orders, access reports, offers and health services.</p>
                </div>
              </div>

              <div className={styles.methodTabs} role="tablist" aria-label="Login method">
                <button type="button" className={method === "phone" ? styles.activeTab : ""} onClick={() => { setMethod("phone"); setIdentifier(""); setError(""); }}>
                  <Phone size={17} /> Mobile number
                </button>
                <button type="button" className={method === "email" ? styles.activeTab : ""} onClick={() => { setMethod("email"); setIdentifier(""); setError(""); }}>
                  <Mail size={17} /> Email address
                </button>
              </div>

              <form onSubmit={handleCredentialSubmit} noValidate>
                <label className={styles.label} htmlFor="login-identifier">
                  {method === "phone" ? "Mobile number" : "Email address"}
                </label>

                <div className={`${styles.inputWrap} ${error && !identifier ? styles.inputWrapError : ""}`}>
                  {method === "phone" ? (
                    <span className={styles.countryCode}>+88</span>
                  ) : (
                    <span className={styles.fieldIcon}><Mail size={18} /></span>
                  )}
                  <input
                    ref={firstInputRef}
                    id="login-identifier"
                    type={method === "phone" ? "tel" : "email"}
                    value={identifier}
                    onChange={(event) => { setIdentifier(event.target.value); setError(""); }}
                    placeholder={method === "phone" ? "01883650010" : "you@example.com"}
                    autoComplete={method === "phone" ? "tel" : "email"}
                  />
                </div>

                <div className={styles.passwordHeader}>
                  <label className={styles.label} htmlFor="login-password">Password</label>
                  <button type="button" onClick={() => setPassword("123456")}>Use demo password</button>
                </div>

                <div className={`${styles.inputWrap} ${error && password.length > 0 && password.length < 6 ? styles.inputWrapError : ""}`}>
                  <span className={styles.fieldIcon}><LockKeyhole size={18} /></span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setError(""); }}
                    placeholder="Enter at least 6 characters"
                    autoComplete="current-password"
                  />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className={styles.optionsRow}>
                  <label>
                    <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                    <span>Remember me</span>
                  </label>
                  <button type="button">Forgot password?</button>
                </div>

                {error ? <p className={styles.errorMessage}>{error}</p> : null}

                <button type="submit" className={styles.primaryButton} disabled={loading}>
                  {loading ? <LoaderCircle className={styles.spinner} size={20} /> : <ShieldCheck size={19} />}
                  Continue securely
                </button>
              </form>

              <div className={styles.divider}><span>or continue with</span></div>

              <div className={styles.socialGrid}>
                <button type="button" onClick={() => handleSocialLogin("google")} disabled={loading}>
                  <span className={styles.googleMark}>G</span> Google
                </button>
                <button type="button" onClick={() => handleSocialLogin("linkedin")} disabled={loading}>
                  <span aria-hidden="true">in</span> LinkedIn
                </button>
                <button type="button" onClick={() => handleSocialLogin("facebook")} disabled={loading}>
                  <span aria-hidden="true">f</span> Facebook
                </button>
              </div>

              <p className={styles.legal}>
                By continuing, you agree to our <Link href="/terms">Terms & Conditions</Link>, <Link href="/privacy">Privacy Policy</Link> and <Link href="/refund-return-policy">Refund & Return Policy</Link>.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
