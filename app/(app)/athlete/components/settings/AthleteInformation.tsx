"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Select from "@/app/components/Select";
import Textarea from "@/app/components/Textarea";
import InputGroup from "@/app/components/InputGroup";
import { usePathname } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import { format } from "date-fns";
import { useToast } from "@/context/ToastProvider";
import { z } from "zod";
import { monthOptions } from "@/helpers/monthOptions";
import axios from "axios";
import { Athlete } from "@/schemas/athleteSchema";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const athleteSchema = z.object({
  collegeOrUniversity: z.string().min(1, "Required"),
  graduationMonth: z.string().min(1, "Required"),
  graduationDay: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])$/, "Invalid day (format: DD)"),
  graduationYear: z
    .string()
    .regex(/^(19|20)\d{2}$/, "Invalid year (format: YYYY)"),
  sport: z.string().min(1, "Required"),
  professionalSkills: z.string().min(1, "Required"),
  gpa: z
    .string()
    .regex(
      /^([0-3]\.\d{1,2}|4\.0)$/,
      "Invalid GPA (format: X.XX, range: 0.00-4.00)"
    ),
  professionalReferences: z.string().min(1, "Required"),
  highlights: z.string().min(1, "Required"),
  bio: z.string().min(1, "Required"),
  youtubeUrl: z.string().regex(/^[^/]+$/, "Invalid YouTube URL"),
});

type AthleteFormValues = zod.infer<typeof athleteSchema>;

type Props = {
  athlete: Athlete;
};

const AthleteInformation = ({ athlete }: Props) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const refetchAthlete = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete"] });
  };
  const [isLoading, setIsLoading] = useState(false);
  const type = getTypeFromPathname(pathname);
  const { addToast } = useToast();

  const initialFormValues: AthleteFormValues = {
    collegeOrUniversity: athlete.collegeUniversity || "",
    graduationMonth: athlete.graduationDate
      ? format(new Date(athlete.graduationDate), "MMMM")
      : "",
    graduationDay: athlete.graduationDate
      ? format(new Date(athlete.graduationDate), "dd")
      : "",
    graduationYear: athlete.graduationDate
      ? format(new Date(athlete.graduationDate), "yyyy")
      : "",
    sport: athlete.sport || "",
    professionalSkills: athlete.professionalSkills?.join(", ") || "",
    gpa: athlete.currentAcademicGPA?.toString() || "",
    professionalReferences: athlete.professionalReferences?.join(", ") || "",
    highlights: athlete.athleticCareerHighlights || "",
    bio: athlete.bio || "",
    youtubeUrl: athlete.reel?.split("/shorts/")[1] || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<AthleteFormValues> = async (data) => {
    setIsLoading(true);
    const athleteData: Athlete = {
      collegeUniversity: data.collegeOrUniversity,
      graduationDate: new Date(
        `${data.graduationYear}-${data.graduationMonth}-${data.graduationDay}`
      ),
      sport: data.sport,
      professionalSkills: [data.professionalSkills],
      currentAcademicGPA: parseFloat(data.gpa),
      professionalReferences: [data.professionalReferences],
      athleticCareerHighlights: data.highlights,
      bio: data.bio,
      reel: `https://www.youtube.com/shorts/${data.youtubeUrl}`,
    };

    try {
      const response = await axios.post("/api/athlete", athleteData);
      // console.log("Athlete updated successfully:", response.data);
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
            <h6 className="font-semibold">Athlete Profile</h6>
            <span className="text-sm text-subtitle">
              Update your company photo and details here.
            </span>
          </div>
          {/* <div className="py-3 flex gap-2">
            <Button
              theme="light"
              className="text-sm py-2"
              type="reset"
              disabled={isLoading}
            >
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
            <h6 className="text-sm font-semibold">College or University</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("collegeOrUniversity")}
              error={errors.collegeOrUniversity?.message}
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Graduation Date</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 grid grid-cols-3 gap-4">
            <Select
              className="col-span-1"
              {...register("graduationMonth")}
              error={errors.graduationMonth?.message}
            >
              {monthOptions()}
            </Select>

            <Input
              className="col-span-1"
              placeholder="DD"
              {...register("graduationDay")}
              error={errors.graduationDay?.message}
            />

            <Input
              className="col-span-1"
              placeholder="YYYY"
              {...register("graduationYear")}
              error={errors.graduationYear?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Sport</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select {...register("sport")} error={errors.sport?.message}>
              <option value="" disabled>
                Choose a sport
              </option>
              <option value="basketball">Basketball</option>
              <option value="football">Football</option>
              <option value="soccer">Soccer</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Professional Skills</h6>
            <span className="text-sm text-subtitle">
              Select all that are applicable to you
            </span>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select
              {...register("professionalSkills")}
              error={errors.professionalSkills?.message}
            >
              <option value="" disabled>
                Choose a skill
              </option>
              <option value="leadership">Leadership</option>
              <option value="teamwork">Teamwork</option>
              <option value="communication">Communication</option>
              <option value="discipline">Discipline</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">
              {type === "team"
                ? "Current Team GPA Average"
                : "Current Academic GPA"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input {...register("gpa")} error={errors.gpa?.message} />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">
              Professional References (2 required)
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("professionalReferences")}
              error={errors.professionalReferences?.message}
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">
              {type === "team"
                ? "Team Highlights"
                : "Athletic Career Highlights"}
            </h6>
            <span className="text-sm text-subtitle">
              Write a short introduction.
            </span>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Textarea
              {...register("highlights")}
              error={errors.highlights?.message}
            ></Textarea>
            <span className="text-sm text-subtitle">400 characters left.</span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Your Bio</h6>
            <span className="text-sm text-subtitle">
              Write a short introduction.
            </span>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Textarea
              {...register("bio")}
              error={errors.bio?.message}
            ></Textarea>
            <span className="text-sm text-subtitle">400 characters left.</span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="text-sm font-semibold">Your Reel</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <InputGroup
              withLabel="Youtube.com/shorts/"
              {...register("youtubeUrl")}
              error={errors.youtubeUrl?.message}
            />
            <span className="text-sm text-subtitle">
              Upload a 30-60 second Youtube video of your pitch. Make sure it's
              unlisted. You're giving a short glimpse to brands about you and
              why you both will be great partners.
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            <Button
              theme="light"
              className="text-sm py-2"
              type="reset"
              disabled={isLoading}
            >
              Cancel
            </Button>{" "}
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
          </div>
        </div>
      </div>
    </form>
  );
};

export default AthleteInformation;
