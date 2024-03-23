"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/components/Button";
import UploadComponent from "@/app/components/UploadComponent";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import { usePathname } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import { useState } from "react";
import { monthOptions } from "@/helpers/monthOptions";
import { Athlete } from "@/schemas/athleteSchema";
import axios from "axios";
import { stateOptions } from "@/helpers/stateOptions";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastProvider";

// Define the Zod schema for form validation
const accountSettingsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  // email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  country: z.string().min(1, "Country is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  dateOfBirthMonth: z.string().min(1, "Required"),
  dateOfBirthDay: z.string().regex(/^(0[1-9]|[12][0-9]|3[01])$/, "Invalid day"),
  dateOfBirthYear: z.string().regex(/^(19|20)\d{2}$/, "Invalid year"),
});

type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;

type Props = {
  athlete: Athlete;
};

const AccountSettings = ({ athlete }: Props) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const refetchAthlete = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete"] });
  };
  const type = getTypeFromPathname(pathname);

  const { addToast } = useToast();

  const [profileImage, setProfileImage] = useState("/images/Avatar.webp");
  const [isLoading, setIsLoading] = useState(false);

  const formattedDateOfBirth = athlete.dateOfBirth
    ? new Date(athlete.dateOfBirth)
    : new Date();
  const initialFormValues: AccountSettingsFormValues = {
    fullName: athlete.fullName || "",
    gender: athlete.gender || "",
    country: athlete.address?.countryRegion || "",
    address1: athlete.address?.streetName || "",
    address2: athlete.address?.houseApartmentNumber || "",
    city: athlete.address?.city || "",
    state: athlete.address?.state || "",
    zipCode: athlete.address?.zipCode || "",
    dateOfBirthMonth: format(formattedDateOfBirth, "MMMM"),
    dateOfBirthDay: format(formattedDateOfBirth, "dd"),
    dateOfBirthYear: format(formattedDateOfBirth, "yyyy"),
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: initialFormValues,
  });

  // Handle form submission
  const onSubmit = async (data: AccountSettingsFormValues) => {
    setIsLoading(true);
    const athleteData: Athlete = {
      fullName: data.fullName,
      // email: data.email,
      gender: data.gender,
      receiveUpdates: true,
      address: {
        countryRegion: data.country,
        streetName: data.address1,
        houseApartmentNumber: data.address2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
      dateOfBirth: new Date(
        `${data.dateOfBirthYear}-${data.dateOfBirthMonth}-${data.dateOfBirthDay}`
      ),
    };

    try {
      const response = await axios.post("/api/athlete", athleteData);
      addToast("success", "Updated Successfully!");
    } catch (error) {
      console.error("Error updating athlete:", error);
    } finally {
      setIsLoading(false);
      refetchAthlete();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Profile</h6>
            <span className="text-sm text-subtitle">
              Update your profile picture and basic information here
            </span>
          </div>
          {/* <div className="py-3 flex gap-2">
            <Button theme="light" className="text-sm py-2" disabled={isLoading}>
              Cancel
            </Button>
            <Button className="text-sm py-2" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div> */}
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Profile Picture</h6>
            <span className="text-sm text-subtitle">
              Update your profile picture.
            </span>
          </div>
          <div className="lg:col-span-6 md:col-span-6 col-span-8 flex gap-4">
            <img
              className="w-14 h-14 rounded-full mb-auto"
              src={profileImage}
              alt="Profile avatar"
            />
            <UploadComponent onUploadComplete={setProfileImage} />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Your Full Name</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input {...register("fullName")} error={errors.fullName?.message} />
          </div>
        </div>

        {/* <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">
              Your {type === "brand" ? "Work Email" : "Email"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input {...register("email")} error={errors.email?.message} />
            <span className="text-subtitle text-sm">
              This is the email address you use to sign in. It’s also where we
              send your booking confirmations.
            </span>
          </div>
        </div> */}

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">
              {type === "team" ? "Men's Team or Women's Team?" : "Gender"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select {...register("gender")} error={errors.gender?.message}>
              <option value="" disabled>
                Please select your {type === "team" ? "Team" : "Gender"}
              </option>
              <option value="men's">Men's</option>
              <option value="women's">Women's</option>
              <option value="coed">Coed</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Address</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 space-y-3">
            <Select {...register("country")} error={errors.country?.message}>
              <option value="" disabled>
                Select the country/region you live in
              </option>
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
            </Select>
            <Input
              {...register("address1")}
              error={errors.address1?.message}
              placeholder="Your street name"
              className="mt-3"
            />
            <Input
              {...register("address2")}
              placeholder="House/apartment number"
              className="mt-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Location</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <div className="grid grid-cols-9 gap-2">
              <div className="col-span-3">
                <Input
                  {...register("city")}
                  error={errors.city?.message}
                  placeholder="City"
                />
              </div>
              <div className="col-span-3">
                <Select {...register("state")} error={errors.state?.message}>
                  <option value="" disabled>
                    Select State
                  </option>
                  {stateOptions()}
                </Select>
              </div>
              <div className="col-span-3">
                <Input
                  {...register("zipCode")}
                  error={errors.zipCode?.message}
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Date of Birth</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 grid grid-cols-3 gap-4">
            <Select
              {...register("dateOfBirthMonth")}
              error={errors.dateOfBirthMonth?.message}
            >
              <option value="" disabled>
                Month
              </option>
              {monthOptions()}
            </Select>
            <Input
              {...register("dateOfBirthDay")}
              error={errors.dateOfBirthDay?.message}
              placeholder="DD"
            />
            <Input
              {...register("dateOfBirthYear")}
              error={errors.dateOfBirthYear?.message}
              placeholder="YYYY"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            <Button theme="light" className="text-sm py-2">
              Cancel
            </Button>
            <Button className="text-sm py-2" type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AccountSettings;
