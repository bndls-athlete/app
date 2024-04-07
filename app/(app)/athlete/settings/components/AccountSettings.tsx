"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastProvider";
import { Athlete } from "@/schemas/athleteSchema";
import { useAthleteData } from "@/hooks/useAthleteData";
import { stateOptions } from "@/helpers/stateOptions";
import { format } from "date-fns";
import { monthOptions } from "@/helpers/monthOptions";
import UploadComponent from "@/app/components/UploadComponent";
import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";

interface AthleteAccountSettingsProps {
  athlete: Partial<Athlete>;
}

const athleteAccountSettingsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  country: z.string().min(1, "Country is required"),
  streetName: z.string().min(1, "Street name is required"),
  houseApartmentNumber: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  dateOfBirthMonth: z.string().optional(),
  dateOfBirthDay: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        /^(0[1-9]|[12][0-9]|3[01])$/.test(val),
      { message: "Invalid day" }
    ),
  dateOfBirthYear: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val === "" || /^(19|20)\d{2}$/.test(val),
      {
        message: "Invalid year",
      }
    ),
  // registrationType: z.enum([
  //   AthleteRegistrationType.Individual,
  //   AthleteRegistrationType.Team,
  // ]),
});

type AthleteAccountSettingsFormValues = z.infer<
  typeof athleteAccountSettingsSchema
>;

const AthleteAccountSettings = ({ athlete }: AthleteAccountSettingsProps) => {
  const { invalidateAthlete } = useAthleteData();
  const { addToast } = useToast();
  const [profileImage, setProfileImage] = useState(
    athlete.profilePicture || "/images/Avatar.webp"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formattedDateOfBirth = athlete.dateOfBirth
    ? new Date(athlete.dateOfBirth)
    : new Date();

  const initialFormValues: AthleteAccountSettingsFormValues = {
    // registrationType:
    //   athlete.registrationType || AthleteRegistrationType.Individual,
    fullName: athlete.fullName || "",
    gender: athlete.gender || "",
    country: athlete.address?.countryRegion || "",
    streetName: athlete.address?.streetName || "",
    houseApartmentNumber: athlete.address?.houseApartmentNumber || "",
    city: athlete.address?.city || "",
    state: athlete.address?.state || "",
    zipCode: athlete.address?.zipCode || "",
    dateOfBirthMonth: athlete.dateOfBirth
      ? format(formattedDateOfBirth, "MMMM")
      : "",
    dateOfBirthDay: athlete.dateOfBirth
      ? format(formattedDateOfBirth, "dd")
      : "",
    dateOfBirthYear: athlete.dateOfBirth
      ? format(formattedDateOfBirth, "yyyy")
      : "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AthleteAccountSettingsFormValues>({
    resolver: zodResolver(athleteAccountSettingsSchema),
    defaultValues: initialFormValues,
  });

  const onSubmit = async (data: AthleteAccountSettingsFormValues) => {
    setIsLoading(true);

    try {
      const athleteData: Partial<Athlete> = {
        ...data,
        address: {
          countryRegion: data.country,
          streetName: data.streetName,
          houseApartmentNumber: data.houseApartmentNumber || "",
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        dateOfBirth:
          data.dateOfBirthDay && data.dateOfBirthMonth && data.dateOfBirthYear
            ? new Date(
                `${data.dateOfBirthYear}-${data.dateOfBirthMonth}-${data.dateOfBirthDay}`
              )
            : undefined,
      };

      if (selectedFile) {
        const fileName = selectedFile.name;
        const fileType = selectedFile.type;
        const response = await axios.post("/api/upload-url", {
          fileName,
          fileType,
        });
        const { uploadUrl, fileKey } = response.data;

        // Try uploading to S3, and exit early if it fails
        try {
          await axios.put(uploadUrl, selectedFile, {
            headers: {
              "Content-Type": fileType,
            },
          });
          athleteData.profilePicture = fileKey;
        } catch (error) {
          console.error("Error uploading file to S3:", error);
          throw new Error("Failed to upload file to S3");
        }
      }

      // Send the updated athlete data to the backend
      await axios.post("/api/athlete", athleteData);
      addToast("success", "Updated Successfully!");
      invalidateAthlete();
    } catch (error) {
      console.error("Error updating athlete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isIndividual = athlete.registrationType;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Profile</h6>
            <span className="text-subtitle">
              {isIndividual
                ? "Update your profile picture and basic information here"
                : "Update your team profile picture and basic information here"}
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
              className="w-14 h-14 object-cover rounded-full mb-auto"
              src={profileImage}
              alt="Profile avatar"
            />
            <UploadComponent
              onUploadComplete={setProfileImage}
              file={selectedFile}
              setFile={setSelectedFile}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {isIndividual ? "Full Name" : "Team Name"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("fullName")}
              error={errors.fullName?.message}
              placeholder={`Enter your ${isIndividual ? "full" : "team"} name`}
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Registration Type</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select
              {...register("registrationType")}
              error={errors.registrationType?.message}
            >
              <option value={AthleteRegistrationType.Individual}>
                Individual
              </option>
              <option value={AthleteRegistrationType.Team}>Team</option>
            </Select>
          </div>
        </div> */}

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {isIndividual ? "Gender" : "Team Gender"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select {...register("gender")} error={errors.gender?.message}>
              <option value="" disabled>
                Select your gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Country/Region</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select {...register("country")} error={errors.country?.message}>
              <option value="" disabled>
                Select the country/region you live in
              </option>
              <option value="USA">United States</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Address</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 space-y-3">
            <Input
              {...register("streetName")}
              error={errors.streetName?.message}
              placeholder="Enter your street name"
            />
            <Input
              {...register("houseApartmentNumber")}
              placeholder="Enter your house/apartment number (optional)"
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
        {isIndividual && (
          <div className="grid grid-cols-8 py-3 border-b">
            <div className="md:col-span-2 col-span-8">
              <h6 className="font-semibold">Date of Birth</h6>
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
        )}

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

export default AthleteAccountSettings;
