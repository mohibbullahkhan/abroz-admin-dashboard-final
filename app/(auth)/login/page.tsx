"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
import { alerts } from "@/lib/sweetalert";
import {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/store";

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthView =
  | "login"
  | "forgot-email"
  | "forgot-verify"
  | "forgot-reset"
  | "forgot-success";

// ─── OTP Input Component ───────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    const next = [...value];
    pasted.forEach((d, i) => {
      if (i < 6) next[i] = d;
    });
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {value.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none bg-gray-50 text-gray-900
            ${
              digit
                ? "border-primary bg-primary/5 text-primary shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                : "border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
            }`}
        />
      ))}
    </div>
  );
}

// ─── Left Brand Panel (shared) ─────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 bg-gray-50 border-r border-border overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center justify-center space-y-12">
        <div className="flex flex-col items-center">
          <Image
            src="/Logo.png"
            alt="Abroz Parts+ Logo"
            width={240}
            height={70}
            className="w-auto h-16 object-contain"
          />
        </div>
        <div className="space-y-6 flex flex-col items-center">
          <h2 className="text-5xl font-bold leading-tight text-gray-900">
            Manage your <br />
            <span className="text-primary">heavy equipment</span> <br />
            spares with ease.
          </h2>
          <p className="text-lg text-text-muted max-w-md mx-auto">
            The ultimate admin portal for the Philippines' leading machinery
            parts provider.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<AuthView>("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // RTK Query hooks
  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();
  const [forgotPasswordApi, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [verifyOtpApi, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [resetPasswordApi, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  // Forgot password state
  const [fpEmail, setFpEmail] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpEmailSent, setFpEmailSent] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Reset password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetError, setResetError] = useState("");

  // Resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await loginApi({ email, password }).unwrap();
      console.log("Login response:", response);
      if (response.success && response.data?.token) {
        // Set an httpOnly session cookie on the frontend's own domain so
        // the proxy.ts middleware can detect the logged-in state.
        // (The backend's own httpOnly cookie lives on the backend's domain
        // and is used separately for authorizing API requests.)
        const sessionRes = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.data.token }),
        });

        if (!sessionRes.ok) {
          throw new Error("Failed to establish session");
        }

        alerts.toastSuccess("Logged in successfully!");
        router.push("/");
        router.refresh();
      } else {
        const msg = response.message || "Login failed";
        setLoginError(msg);
        alerts.toastError(msg);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMsg = "An error occurred during login";
      if (err.status === "FETCH_ERROR") {
        errorMsg =
          "Network error. Please check your connection or CORS settings.";
      } else if (err.data?.message || err.error) {
        errorMsg = err.data?.message || err.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setLoginError(errorMsg);
      alerts.toastError(errorMsg);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError("");
    try {
      await forgotPasswordApi({ email: fpEmail }).unwrap();
      setFpEmailSent(true);
      setResendCooldown(60);
      alerts.toastSuccess("Verification code sent to your email!");
      setTimeout(() => setView("forgot-verify"), 1200);
    } catch (err: any) {
      const msg = err.data?.message || "Failed to send OTP. Please try again.";
      setFpError(msg);
      alerts.toastError(msg);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setFpError("");
    try {
      await forgotPasswordApi({ email: fpEmail }).unwrap();
      setResendCooldown(60);
      alerts.toastSuccess("Verification code resent!");
    } catch (err: any) {
      const msg = err.data?.message || "Failed to resend OTP.";
      setOtpError(msg);
      alerts.toastError(msg);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits.");
      alerts.toastError("Please enter all 6 digits.");
      return;
    }
    setOtpError("");

    try {
      await verifyOtpApi({ email: fpEmail, otp: code }).unwrap();
      alerts.toastSuccess("Email verified successfully!");
      setView("forgot-reset");
    } catch (err: any) {
      const msg = err.data?.message || "Invalid OTP code.";
      setOtpError(msg);
      alerts.error("Verification Failed", msg);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      alerts.toastError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      alerts.toastError("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordApi({ email: fpEmail, newPassword }).unwrap();
      alerts.success(
        "Password Reset Successful",
        "You can now sign in with your new password.",
      );
      setView("forgot-success");
    } catch (err: any) {
      const msg = err.data?.message || "Failed to reset password.";
      setResetError(msg);
      alerts.error("Reset Failed", msg);
    }
  };

  const resetFpFlow = () => {
    setView("login");
    setFpEmail("");
    setFpError("");
    setFpEmailSent(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
  };

  // ── Render helpers ───────────────────────────────────────────────────────────

  const renderLogin = () => (
    <div className="w-full max-w-md space-y-8">
      <div className="lg:hidden flex flex-col items-center mb-8 text-center">
        <Image
          src="/Logo.png"
          alt="Abroz Parts+ Logo"
          width={200}
          height={60}
          className="w-auto h-12 object-contain mb-4"
        />
      </div>
      <div className="text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-text-muted">
          Please enter your credentials to access the{" "}
          <span className="text-gray-700 font-medium">admin portal</span>.
        </p>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardBody className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                className="bg-gray-50 border-gray-200 text-gray-900"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={18} />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  className="bg-gray-50 border-gray-200 text-gray-900"
                />
              </div>
            </div>

            {loginError && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {loginError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 border border-gray-300 rounded bg-gray-50 peer-checked:bg-primary peer-checked:border-primary transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                    <svg
                      className="w-3.5 h-3.5 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-text-muted group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => setView("forgot-email")}
                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-base font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              loading={isLoginLoading}
            >
              Sign In to Dashboard
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="text-center text-xs text-text-muted">
        &copy; 2026 AB &amp; KBROZ MACHINERY INC. All rights reserved. <br />
        Powered by Abroz Parts+ Enterprise.
      </p>
    </div>
  );

  // ── Step 1: Enter Email ──────────────────────────────────────────────────────
  const renderForgotEmail = () => (
    <div className="w-full max-w-md space-y-8">
      <button
        onClick={resetFpFlow}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to login
      </button>

      <div>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Mail size={26} className="text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          No worries! Enter your registered email address and we'll send you a
          6-digit verification code.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {["Send Email", "Verify Code", "Reset Password"].map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i === 0 ? "bg-primary text-black" : "bg-gray-100 text-gray-400"}`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] font-medium ${i === 0 ? "text-primary" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-0.5 rounded mb-4 ${i === 0 ? "bg-gray-200" : "bg-gray-100"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardBody className="p-8">
          <form onSubmit={handleSendEmail} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
              required
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
              icon={<Mail size={18} />}
              className="bg-gray-50 border-gray-200 text-gray-900"
            />

            {fpError && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {fpError}
              </div>
            )}

            {fpEmailSent && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                <CheckCircle size={18} className="shrink-0" />
                <span>Verification code sent! Redirecting…</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-base font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              loading={isForgotLoading}
              disabled={fpEmailSent}
            >
              Send Verification Code
            </Button>
          </form>
        </CardBody>
      </Card>

      <p className="text-center text-xs text-text-muted">
        &copy; 2026 AB &amp; KBROZ MACHINERY INC. All rights reserved. <br />
        Powered by Abroz Parts+ Enterprise.
      </p>
    </div>
  );

  // ── Step 2: OTP Verification ─────────────────────────────────────────────────
  const renderForgotVerify = () => (
    <div className="w-full max-w-md space-y-8">
      <button
        onClick={() => setView("forgot-email")}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Change email
      </button>

      <div>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <ShieldCheck size={26} className="text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verify Your Code
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-800">
            {fpEmail || "your email"}
          </span>
          .<br />
          Check your inbox (and spam folder).
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {["Send Email", "Verify Code", "Reset Password"].map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i < 1 ? "bg-primary text-black" : i === 1 ? "bg-primary text-black" : "bg-gray-100 text-gray-400"}`}
              >
                {i < 1 ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${i <= 1 ? "text-primary" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-0.5 rounded mb-4 ${i === 0 ? "bg-primary" : "bg-gray-100"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardBody className="p-8">
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-muted block text-center">
                Enter 6-Digit Code
              </label>
              <OtpInput value={otp} onChange={setOtp} />
              {otpError && (
                <p className="text-center text-xs text-red-500">{otpError}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-base font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              loading={isVerifyLoading}
            >
              Verify Code
            </Button>

            <div className="text-center text-sm text-text-muted">
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-gray-400">
                  Resend in{" "}
                  <span className="font-bold text-primary">
                    {resendCooldown}s
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>

      <p className="text-center text-xs text-text-muted">
        &copy; 2026 AB &amp; KBROZ MACHINERY INC. All rights reserved. <br />
        Powered by Abroz Parts+ Enterprise.
      </p>
    </div>
  );

  // ── Step 3: Reset Password ───────────────────────────────────────────────────
  const renderForgotReset = () => {
    const passwordStrength = (pw: string) => {
      if (!pw) return { label: "", color: "", width: "0%" };
      let score = 0;
      if (pw.length >= 8) score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      const levels = [
        { label: "Weak", color: "bg-red-400", width: "25%" },
        { label: "Fair", color: "bg-orange-400", width: "50%" },
        { label: "Good", color: "bg-yellow-400", width: "75%" },
        { label: "Strong", color: "bg-green-500", width: "100%" },
      ];
      return levels[score - 1] || levels[0];
    };
    const strength = passwordStrength(newPassword);

    return (
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <KeyRound size={26} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Create a strong new password for your account. Make sure it's at
            least 8 characters.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {["Send Email", "Verify Code", "Reset Password"].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${i < 2 ? "bg-primary text-black" : "bg-primary text-black"}`}
                >
                  {i < 2 ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    3
                  )}
                </div>
                <span className="text-[10px] font-medium text-primary">
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-0.5 rounded mb-4 bg-primary" />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardBody className="p-8">
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="text-text-muted hover:text-gray-900 transition-colors"
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    className="bg-gray-50 border-gray-200 text-gray-900"
                  />
                </div>

                {/* Password strength bar */}
                {newPassword && (
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-right text-text-muted">
                      Strength:{" "}
                      <span className="font-semibold text-gray-700">
                        {strength.label}
                      </span>
                    </p>
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock size={18} />}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-text-muted hover:text-gray-900 transition-colors"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    className="bg-gray-50 border-gray-200 text-gray-900"
                  />
                </div>

                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500">
                    Passwords do not match.
                  </p>
                )}
                {confirmPassword &&
                  newPassword === confirmPassword &&
                  confirmPassword.length >= 8 && (
                    <div className="flex items-center gap-2 text-green-600 text-xs">
                      <CheckCircle size={14} /> Passwords match!
                    </div>
                  )}
              </div>

              {resetError && (
                <p className="text-sm text-red-500 text-center">{resetError}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 text-base font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                loading={isResetLoading}
              >
                Reset Password
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-xs text-text-muted">
          &copy; 2026 AB &amp; KBROZ MACHINERY INC. All rights reserved. <br />
          Powered by Abroz Parts+ Enterprise.
        </p>
      </div>
    );
  };

  // ── Step 4: Success ──────────────────────────────────────────────────────────
  const renderForgotSuccess = () => (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-lg shadow-green-100">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Password Reset!
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Your password has been successfully reset.
            <br />
            You can now sign in with your new password.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        className="w-full py-4 text-base font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        onClick={resetFpFlow}
      >
        Back to Sign In
      </Button>

      <p className="text-center text-xs text-text-muted">
        &copy; 2026 AB &amp; KBROZ MACHINERY INC. All rights reserved. <br />
        Powered by Abroz Parts+ Enterprise.
      </p>
    </div>
  );

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <BrandPanel />

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        {/* Animated slide transitions */}
        <div
          key={view}
          className="w-full flex justify-center"
          style={{ animation: "fadeSlideIn 0.35s ease both" }}
        >
          {view === "login" && renderLogin()}
          {view === "forgot-email" && renderForgotEmail()}
          {view === "forgot-verify" && renderForgotVerify()}
          {view === "forgot-reset" && renderForgotReset()}
          {view === "forgot-success" && renderForgotSuccess()}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
