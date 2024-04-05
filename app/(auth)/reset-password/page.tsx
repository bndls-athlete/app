"use client";

import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Branding from "@/app/components/Branding";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  code: z.string().min(1, "Password reset code is required"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgotPasswordPage: NextPage = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [resetCodeSent, setResetCodeSent] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!isLoaded) {
    return null;
  }

  const onSubmitEmail = async (data: EmailFormData) => {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setResetCodeSent(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };

  const onSubmitReset = async (data: ResetPasswordFormData) => {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      })
      .then((result) => {
        if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
          resetPasswordForm.reset();
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 w-full">
      <div className="mb-8">
        <Branding />
      </div>
      <h1 className="text-4xl font-bold mb-6">Forgot Password?</h1>
      {!successfulCreation ? (
        <form
          onSubmit={emailForm.handleSubmit(onSubmitEmail)}
          className="space-y-6 max-w-lg w-full"
        >
          <Input
            placeholder="Enter your email"
            type="email"
            {...emailForm.register("email")}
            error={emailForm.formState.errors.email?.message}
          />
          <Button type="submit" className="w-full text-white p-2 rounded-md">
            Send password reset code
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <form
          onSubmit={resetPasswordForm.handleSubmit(onSubmitReset)}
          className="space-y-6 max-w-lg w-full"
        >
          <div className="relative">
            <Input
              placeholder="Enter your new password"
              type={showPassword ? "text" : "password"}
              {...resetPasswordForm.register("password")}
              error={resetPasswordForm.formState.errors.password?.message}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="absolute inset-y-0 right-3 my-auto h-full flex items-center w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <Input
            placeholder="Enter the password reset code"
            type="text"
            {...resetPasswordForm.register("code")}
            error={resetPasswordForm.formState.errors.code?.message}
          />
          {resetCodeSent && (
            <div className="mb-4 text-sm text-green-600">
              We have sent a reset code to your email. Please enter it along
              with your new password.
            </div>
          )}

          <Button type="submit" className="w-full text-white p-2 rounded-md">
            Reset Password
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
