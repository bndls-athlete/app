"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUser } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const Security = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    const confirmed = window.confirm(
      "Are you sure you want to update your password?"
    );
    if (!confirmed) return;

    try {
      await user?.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      alert("Password updated successfully!");
      reset();
    } catch (error) {
      alert(errors);
    }
  };

  return (
    <>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Password</h6>
            <span className="text-subtitle">
              Update your password if you suspect your account has been
              compromised.
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-8 py-3 border-b">
            <div className="md:col-span-2 col-span-8 mb-3">
              <h6 className="font-semibold">Current Password</h6>
            </div>
            <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
              <Input
                {...register("currentPassword")}
                type="password"
                error={errors.currentPassword?.message}
                passwordHide
              />
            </div>
          </div>
          <div className="grid grid-cols-8 py-3">
            <div className="md:col-span-2 col-span-8 mb-3">
              <h6 className="font-semibold">New Password</h6>
            </div>
            <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
              <Input
                {...register("newPassword")}
                type="password"
                error={errors.newPassword?.message}
                passwordHide
              />
              <span className="text-subtitle">
                Your new password must be more than 8 characters.
              </span>
            </div>
          </div>
          <div className="grid grid-cols-8 py-3 border-b">
            <div className="md:col-span-2 col-span-8 mb-3">
              <h6 className="font-semibold">Confirm New Password</h6>
            </div>
            <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
              <Input
                {...register("confirmPassword")}
                type="password"
                error={errors.confirmPassword?.message}
                passwordHide
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="py-3 flex gap-2">
              <div>
                <Button className="py-2" type="submit">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Security;
