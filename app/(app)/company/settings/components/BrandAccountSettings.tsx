"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastProvider";
import { Brand } from "@/schemas/brandSchema";
import { useBrandData } from "@/hooks/useBrandData";
import Select from "@/app/components/Select";
import { stateOptions } from "@/helpers/stateOptions";
import Textarea from "@/app/components/Textarea";
import UploadComponent from "@/app/components/UploadComponent";

interface BrandAccountSettingsProps {
  brand: Partial<Brand>;
}

const brandAccountSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  bio: z.string().min(1, "Bio is required"),
  website: z.string().url().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(
      /^\+1\d{10}$/,
      "Phone number must be in the format +1XXXXXXXXXX (US format)"
    )
    .min(1, "Phone number is required"),
  countryRegion: z.string().min(1, "Country/Region is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z
    .string()
    .regex(
      /^\d{5}(-\d{4})?$/,
      "ZIP code must be in the format XXXXX or XXXXX-XXXX"
    )
    .min(1, "ZIP code is required"),
});

type BrandAccountSettingsFormValues = z.infer<
  typeof brandAccountSettingsSchema
>;

const BrandAccountSettings = ({ brand }: BrandAccountSettingsProps) => {
  const { invalidateBrand } = useBrandData();
  const { addToast } = useToast();
  const [profileImage, setProfileImage] = useState(
    brand.profilePicture || "/images/Avatar.webp"
  );
  const [isLoading, setIsLoading] = useState(false);

  const initialFormValues: BrandAccountSettingsFormValues = {
    companyName: brand.companyName || "",
    industry: brand.industry || "",
    bio: brand.bio || "",
    website: brand.website || "",
    phoneNumber: brand.phoneNumber || "",
    countryRegion: brand.address?.countryRegion || "",
    streetAddress: brand.address?.streetAddress || "",
    city: brand.address?.city || "",
    state: brand.address?.state || "",
    zipCode: brand.address?.zipCode || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandAccountSettingsFormValues>({
    resolver: zodResolver(brandAccountSettingsSchema),
    defaultValues: initialFormValues,
  });

  // Handle form submission
  const onSubmit = async (data: BrandAccountSettingsFormValues) => {
    setIsLoading(true);
    const brandData: Partial<Brand> = {
      companyName: data.companyName,
      industry: data.industry,
      bio: data.bio,
      website: data.website,
      phoneNumber: data.phoneNumber,
      address: {
        countryRegion: data.countryRegion,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
      },
    };

    try {
      const response = await axios.post("/api/brand", brandData);
      addToast("success", "Updated Successfully!");
    } catch (error) {
      console.error("Error updating brand:", error);
    } finally {
      invalidateBrand();
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Brand Information</h6>
            <span className="text-subtitle">
              Update your brand information here
            </span>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className=" font-semibold">Profile Picture</h6>
            <span className=" text-subtitle">Update your profile picture.</span>
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
            <h6 className="font-semibold">Company Name</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("companyName")}
              error={errors.companyName?.message}
              placeholder="Enter your company name"
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Industry</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("industry")}
              error={errors.industry?.message}
              placeholder="Enter your industry"
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Bio</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Textarea
              {...register("bio")}
              rows={4}
              error={errors.bio?.message}
              placeholder="Enter your bio"
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Website</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("website")}
              error={errors.website?.message}
              placeholder="Enter your website URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Phone Number</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
              placeholder="Enter your phone number in the format +1XXXXXXXXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Address</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 space-y-3">
            <Select
              {...register("countryRegion")}
              error={errors.countryRegion?.message}
            >
              <option value="" disabled>
                Select the country/region you live in
              </option>
              <option value="USA">United States</option>
            </Select>
            <Input
              {...register("streetAddress")}
              error={errors.streetAddress?.message}
              placeholder="Enter your street name"
            />
            <Input
              {...register("city")}
              error={errors.city?.message}
              placeholder="Enter your city"
            />
            <Select {...register("state")} error={errors.state?.message}>
              <option value="" disabled>
                Select State
              </option>
              {stateOptions()}
            </Select>
            <Input
              {...register("zipCode")}
              error={errors.zipCode?.message}
              placeholder="Enter your ZIP code in the format XXXXX or XXXXX-XXXX"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            <Button className="py-2" type="submit">
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

export default BrandAccountSettings;
