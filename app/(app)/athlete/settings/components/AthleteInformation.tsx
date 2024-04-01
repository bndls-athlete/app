"use client";

import { useForm, SubmitHandler, DeepPartial } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Select from "@/app/components/Select";
import Textarea from "@/app/components/Textarea";
import InputGroup from "@/app/components/InputGroup";
import { format } from "date-fns";
import { useToast } from "@/context/ToastProvider";
import { z } from "zod";
import { monthOptions } from "@/helpers/monthOptions";
import axios from "axios";
import { Athlete } from "@/schemas/athleteSchema";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { EntityType } from "@/types/entityTypes";
import { useAthleteCard } from "@/hooks/useAthleteCard";
import { useAthleteData } from "@/hooks/useAthleteData";
import useUserType from "@/hooks/useUserType";
import { validateNumber } from "@/helpers/zodSchemaHelpers";

type AthleteInformationProps = {
  athlete: Partial<Athlete>;
};

const athleteInformationSchema = z.object({
  collegeOrUniversity: z.string().min(1, "Required"),
  graduationMonth: z.string().min(1, "Required"),
  graduationDay: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])$/, "Invalid day (format: DD)"),
  graduationYear: z
    .string()
    .regex(/^(19|20)\d{2}$/, "Invalid year (format: YYYY)"),
  sport: z.string().min(1, "Required"),
  professionalSkills: z.string().optional(),
  gpa: z
    .string()
    .regex(
      /^([0-3]\.\d{1,2}|4\.0)$/,
      "Invalid GPA (format: X.XX, range: 0.00-4.00)"
    ),
  professionalReferences: z.string().optional(),
  statsSourceURL: z.string().url().optional().or(z.literal("")),
  bio: z.string().min(1, "Required").max(400, "Maximum 400 characters"),
  youtubeUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9_-]{11}$/.test(val), {
      message: "Invalid YouTube shortcode",
    }),
  baseballStats: z
    .object({
      winsAboveReplacement: validateNumber,
      isolatedPower: validateNumber,
      weightedOnBaseAverage: validateNumber,
    })
    .optional(),
  basketballStats: z
    .object({
      points: validateNumber,
      assists: validateNumber,
      rebounds: validateNumber,
      blocks: validateNumber,
      steals: validateNumber,
    })
    .optional(),
  soccerStats: z
    .object({
      cleanSheets: validateNumber,
      goalsScored: validateNumber,
      assists: validateNumber,
    })
    .optional(),
});

type AthleteFormValues = zod.infer<typeof athleteInformationSchema>;

const AthleteInformation = ({ athlete }: AthleteInformationProps) => {
  const { invalidateAthleteCard } = useAthleteCard();
  const { invalidateAthlete } = useAthleteData();
  const [isLoading, setIsLoading] = useState(false);
  const { type } = useUserType();
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
    gpa: athlete.currentAcademicGPA?.toFixed(2) || "",
    professionalReferences: athlete.professionalReferences?.join(", ") || "",
    statsSourceURL: athlete.statsSourceURL || "",
    bio: athlete.bio || "",
    youtubeUrl: athlete.reel?.split("/shorts/")[1] || "",
    baseballStats: {
      winsAboveReplacement: athlete.baseballStats?.winsAboveReplacement,
      isolatedPower: athlete.baseballStats?.isolatedPower,
      weightedOnBaseAverage: athlete.baseballStats?.weightedOnBaseAverage,
    },
    basketballStats: {
      points: athlete.basketballStats?.points,
      assists: athlete.basketballStats?.assists,
      rebounds: athlete.basketballStats?.rebounds,
      blocks: athlete.basketballStats?.blocks,
      steals: athlete.basketballStats?.steals,
    },
    soccerStats: {
      cleanSheets: athlete.soccerStats?.cleanSheets,
      goalsScored: athlete.soccerStats?.goalsScored,
      assists: athlete.soccerStats?.assists,
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteInformationSchema),
    defaultValues: initialFormValues,
  });

  const selectedSport = watch("sport");

  const onSubmit: SubmitHandler<AthleteFormValues> = async (data) => {
    setIsLoading(true);
    const athleteData: DeepPartial<Athlete> = {
      collegeUniversity: data.collegeOrUniversity,
      graduationDate: new Date(
        `${data.graduationYear}-${data.graduationMonth}-${data.graduationDay}`
      ),
      sport: data.sport,
      professionalSkills: [data.professionalSkills || ""],
      currentAcademicGPA: data.gpa ? parseFloat(data.gpa) : undefined,
      professionalReferences: data.professionalReferences
        ? [data.professionalReferences]
        : [],
      statsSourceURL: data.statsSourceURL,
      bio: data.bio,
      reel: data.youtubeUrl
        ? `https://www.youtube.com/shorts/${data.youtubeUrl}`
        : undefined,
      baseballStats: {
        winsAboveReplacement: data.baseballStats?.winsAboveReplacement,
        isolatedPower: data.baseballStats?.isolatedPower,
        weightedOnBaseAverage: data.baseballStats?.weightedOnBaseAverage,
      },
      basketballStats: {
        points: data.basketballStats?.points,
        assists: data.basketballStats?.assists,
        rebounds: data.basketballStats?.rebounds,
        blocks: data.basketballStats?.blocks,
        steals: data.basketballStats?.steals,
      },
      soccerStats: {
        cleanSheets: data.soccerStats?.cleanSheets,
        goalsScored: data.soccerStats?.goalsScored,
        assists: data.soccerStats?.assists,
      },
    };
    try {
      await axios.post("/api/athlete", athleteData);
      addToast("success", "Updated Successfully!");
    } catch (error) {
      console.error("Error updating athlete:", error);
    } finally {
      invalidateAthlete();
      invalidateAthleteCard();
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Athlete Profile</h6>
            <span className="text-subtitle">
              Update your profile with detailed information about your athletic
              career, academic achievements, and key statistics.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">College or University</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("collegeOrUniversity")}
              error={errors.collegeOrUniversity?.message}
              placeholder="Enter your college or university"
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Graduation Date</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 grid grid-cols-3 gap-4">
            <Select
              {...register("graduationMonth")}
              error={errors.graduationMonth?.message}
              placeholder="Month"
            >
              {monthOptions()}
            </Select>
            <Input
              {...register("graduationDay")}
              error={errors.graduationDay?.message}
              placeholder="Day"
            />
            <Input
              {...register("graduationYear")}
              error={errors.graduationYear?.message}
              placeholder="Year"
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Sport</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Select {...register("sport")} error={errors.sport?.message}>
              <option value="" disabled>
                Select your sport
              </option>
              <option value="baseball">Baseball</option>
              <option value="basketball">Basketball</option>
              <option value="soccer">Soccer</option>
            </Select>
          </div>
        </div>
        {/* Conditional stat lines fields */}
        {selectedSport === "baseball" && (
          <div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Wins Above Replacement</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("baseballStats.winsAboveReplacement")}
                  error={errors.baseballStats?.winsAboveReplacement?.message}
                  placeholder="Enter WAR value"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Isolated Power</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("baseballStats.isolatedPower")}
                  error={errors.baseballStats?.isolatedPower?.message}
                  placeholder="Enter ISO value"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Weighted On-Base Average</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("baseballStats.weightedOnBaseAverage")}
                  error={errors.baseballStats?.weightedOnBaseAverage?.message}
                  placeholder="Enter wOBA value"
                />
              </div>
            </div>
          </div>
        )}
        {selectedSport === "basketball" && (
          <div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Points</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("basketballStats.points")}
                  error={errors.basketballStats?.points?.message}
                  placeholder="Enter points per game"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Assists</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("basketballStats.assists")}
                  error={errors.basketballStats?.assists?.message}
                  placeholder="Enter assists per game"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Rebounds</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("basketballStats.rebounds")}
                  error={errors.basketballStats?.rebounds?.message}
                  placeholder="Enter rebounds per game"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Blocks</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("basketballStats.blocks")}
                  error={errors.basketballStats?.blocks?.message}
                  placeholder="Enter blocks per game"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Steals</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("basketballStats.steals")}
                  error={errors.basketballStats?.steals?.message}
                  placeholder="Enter steals per game"
                />
              </div>
            </div>
          </div>
        )}
        {selectedSport === "soccer" && (
          <div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Clean Sheets</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("soccerStats.cleanSheets")}
                  error={errors.soccerStats?.cleanSheets?.message}
                  placeholder="Enter clean sheets"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Goals Scored</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("soccerStats.goalsScored")}
                  error={errors.soccerStats?.goalsScored?.message}
                  placeholder="Enter goals scored"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 py-3 border-b">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Assists</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8">
                <Input
                  type="number"
                  {...register("soccerStats.assists")}
                  error={errors.soccerStats?.assists?.message}
                  placeholder="Enter assists"
                />
              </div>
            </div>
          </div>
        )}
        {/* Conditional stat lines fields */}
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Professional Skills</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("professionalSkills")}
              error={errors.professionalSkills?.message}
              placeholder="Enter your professional skills"
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {type === EntityType.Team ? "Team GPA Average" : "Academic GPA"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("gpa")}
              error={errors.gpa?.message}
              placeholder="Enter your GPA"
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Professional References</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("professionalReferences")}
              error={errors.professionalReferences?.message}
              placeholder="Enter your professional references"
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Stats Source URL</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Input
              {...register("statsSourceURL")}
              error={errors.statsSourceURL?.message}
              placeholder="Enter your athletic stats source URL"
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
            <h6 className=" font-semibold">Your Reel</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <InputGroup
              withLabel="Youtube.com/shorts/"
              {...register("youtubeUrl")}
              error={errors.youtubeUrl?.message}
            />
            <span className="text-subtitle">
              Upload a 30-60 second Youtube video of your pitch. Make sure it's
              unlisted. You're giving a short glimpse to brands about you and
              why you both will be great partners.
            </span>
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

export default AthleteInformation;
