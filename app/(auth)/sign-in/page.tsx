"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { useSignIn } from "@clerk/nextjs";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignInForm() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
      } else {
        console.error("Sign-in incomplete:", completeSignIn.status);
        alert("Sign-in incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert(`Sign-in error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full max-w-md p-6 mx-auto flex flex-col justify-center">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="mb-2">
            <h1 className="text-4xl font-bold mb-6">Log In</h1>{" "}
            <span>Welcome Back! Please enter your details</span>
          </div>
          <div className="mb-2 flex flex-col space-y-4">
            <Input
              // withLabel="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <div className="relative">
              <Input
                // withLabel="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={errors.password?.message}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute inset-y-0 right-3 my-auto h-full flex items-center w-5 h-5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href="/reset-password"
              className="text-primary font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full text-white p-2 rounded-md flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
        <div className="mt-3 text-center">
          <span className="">
            Don't have an account?
            <Link
              href="/sign-up"
              className="ml-2 text-primary font-medium hover:underline"
            >
              Sign Up Now
            </Link>
          </span>
        </div>
        {/* <div className="mt-3 text-center">
          <span className="">
            By signing up, I agree Privacy Policy and Terms of Service
          </span>
        </div> */}
      </div>
      <div
        className="hidden md:block md:w-1/2"
        style={{
          backgroundImage: "url(/Section.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
