"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import Input from "@/app/components/Input";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import Button from "@/app/components/Button";
import axios from "axios";
import { EntityType } from "@/types/entityTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { signUp, setActive } = useSignUp();

  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      userType: EntityType.Athlete,
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const handleSignUpSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    if (!signUp) {
      return;
    }
    setIsSubmitting(true);
    try {
      const names = data.fullName?.trim().split(/\s+/);
      const firstName = names?.shift();
      const lastName = names?.join(" ");

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName: firstName,
        lastName: lastName,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    if (!signUp) {
      return;
    }
    setIsSubmitting(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        const formData = {
          email: signUp.emailAddress,
          userType: form.getValues("userType"),
          updates: form.getValues("updates"),
        };
        await axios.post("/api/create-entity", formData);

        // Manually reload the session
        await signUp.reload();

        router.replace(`/${form.getValues("userType")}`);
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch (error) {
      alert(`Verification failed: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <div className="w-full max-w-md bg-white shadow-xl rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
            <p className="mb-4">
              Please enter the verification code sent to your email.
            </p>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="block  font-medium mb-1">
                  Verification Code
                </label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="border-2 border-gray-200 w-full p-2 rounded-md  focus:border-primary focus:ring-primary/[0.2] focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex justify-center items-center w-full bg-primary text-white p-2 rounded-md hover:bg-primary-dark"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Verify"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-full max-w-md p-6 mx-auto flex flex-col justify-center">
        <form
          noValidate
          onSubmit={handleSubmit(handleSignUpSubmit)}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold mb-6">Sign Up</h1>
          <div className="mb-6 flex flex-col space-y-4">
            <Input
              // withLabel="Full Name*"
              placeholder="Enter your name"
              {...register("fullName")}
              error={errors.fullName?.message}
              required
            />
            <Input
              // withLabel="Email Address*"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              required
            />
            {/* <Input
              // withLabel="Password*"
              placeholder="Create a password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              required
            /> */}

            <Input
              // withLabel="Password"
              placeholder="Enter your password"
              {...register("password")}
              type="password"
              error={errors.password?.message}
              passwordHide
            />

            <Input
              // withLabel="Confirm Password*"
              placeholder="Confirm your password"
              type="text"
              {...register("passwordConfirmation")}
              error={errors.passwordConfirmation?.message}
              required
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="default-checkbox"
                type="checkbox"
                className="w-4 h-4 checkbox"
                {...register("updates")}
              />
              <label
                htmlFor="default-checkbox"
                className="ml-2  font-medium text-gray-900"
              >
                I want to receive platform & product updates.
              </label>
            </div>
          </div>
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">I am registering as a:</span>
            </label>
            <div className="flex justify-start gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("userType")}
                  value="athlete"
                  className="radio radio-primary"
                  required
                />
                <span className="label-text">Athlete</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("userType")}
                  value="team"
                  className="radio radio-primary"
                  required
                />
                <span className="label-text">Team</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("userType")}
                  value="company"
                  className="radio radio-primary"
                  required
                />
                <span className="label-text">Company</span>
              </label>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full text-white p-2 rounded-md flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Get Started"
            )}
          </Button>
          <p className=" mb-6">
            Already have an account?
            <Link
              href={"/sign-in"}
              className="ml-2  text-primary font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
          <p>
            By signing up, you agree to our{" "}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms-of-service" className="underline">
              Terms
            </Link>{" "}
            of Service.
          </p>
        </form>
      </div>
      <div
        className="hidden md:block md:w-1/2"
        style={{
          backgroundImage: "url(/Section1.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
