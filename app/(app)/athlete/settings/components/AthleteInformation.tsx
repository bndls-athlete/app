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
import {
  Athlete,
  allowedStatsSourceURLs,
  sportSchema,
  validateStatsSourceURL,
} from "@/schemas/athleteSchema";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAthleteData } from "@/hooks/useAthleteData";
import { validateNumber } from "@/helpers/zodSchemaHelpers";
import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";
import { sportsEnum } from "@/schemas/athleteSchema";

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
  sport: sportSchema,
  professionalSkills: z.array(z.string()).optional(),
  gpa: z
    .string()
    .regex(
      /^([0-3]\.\d{1,2}|4\.0)$/,
      "Invalid GPA (format: X.XX, range: 0.00-4.00)"
    ),
  professionalReferences: z.array(z.string()).optional(),
  statsSourceURL: validateStatsSourceURL,
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
  const { invalidateAthlete } = useAthleteData();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const [newSkill, setNewSkill] = useState("");
  const [newReference, setNewReference] = useState("");

  athlete.registrationType;

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
    sport: athlete.sport || "basketball",
    professionalSkills: athlete.professionalSkills || [],
    gpa: athlete.currentAcademicGPA?.toFixed(2) || "",
    professionalReferences: athlete.professionalReferences || [],
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
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteInformationSchema),
    defaultValues: initialFormValues,
  });

  const selectedSport = watch("sport");

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      setValue("professionalSkills", [
        ...getValues("professionalSkills")!,
        newSkill,
      ]);
      setNewSkill("");
      await trigger("professionalSkills");
    }
  };

  const handleRemoveSkill = async (index: number) => {
    const updatedSkills = getValues("professionalSkills")!.filter(
      (_, i) => i !== index
    );
    setValue("professionalSkills", updatedSkills);
    await trigger("professionalSkills");
  };

  const handleAddReference = async () => {
    if (newReference.trim()) {
      setValue("professionalReferences", [
        ...getValues("professionalReferences")!,
        newReference,
      ]);
      setNewReference("");
      await trigger("professionalReferences");
    }
  };

  const handleRemoveReference = async (index: number) => {
    const updatedReferences = getValues("professionalReferences")!.filter(
      (_, i) => i !== index
    );
    setValue("professionalReferences", updatedReferences);
    await trigger("professionalReferences");
  };

  const onSubmit: SubmitHandler<AthleteFormValues> = async (data) => {
    setIsLoading(true);
    const athleteData: DeepPartial<Athlete> = {
      collegeUniversity: data.collegeOrUniversity,
      graduationDate: new Date(
        `${data.graduationYear}-${data.graduationMonth}-${data.graduationDay}`
      ),
      sport: data.sport,
      professionalSkills: data.professionalSkills,
      currentAcademicGPA: data.gpa ? parseFloat(data.gpa) : undefined,
      professionalReferences: data.professionalReferences,
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
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Team Profile"
                : "Athlete Profile"}
            </h6>
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Update your team profile with detailed information about your team's achievements, academic performance, and key statistics."
                : "Update your profile with detailed information about your athletic career, academic achievements, and key statistics."}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">College or University</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <Input
              {...register("collegeOrUniversity")}
              error={errors.collegeOrUniversity?.message}
              placeholder="Enter your college or university"
            />
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Mention the college or university your team represents."
                : "Mention the college or university where you are currently studying or have graduated from."}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Cumulative Graduation Date"
                : "Graduation Date"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-4">
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
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Provide the cumulative graduation date of your team members."
                : "Provide the expected or actual date of your graduation."}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Sport</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <Select {...register("sport")} error={errors.sport?.message}>
              <option value="" disabled>
                Select your sport
              </option>
              {Object.values(sportSchema.options).map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Choose the sport your team actively participates in."
                : "Choose the sport you are actively participating in or have expertise in."}
            </span>
          </div>
        </div>
        {selectedSport === sportsEnum.baseball && (
          <div>
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Wins Above Replacement</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average WAR value for your team."
                    : "Enter your individual WAR value."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Isolated Power</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average ISO value for your team."
                    : "Enter your individual ISO value."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Weighted On-Base Average</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average wOBA value for your team."
                    : "Enter your individual wOBA value."}
                </span>
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
        {selectedSport === sportsEnum.basketball && (
          <div>
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Points</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average points per game for your team."
                    : "Enter your individual points per game."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Assists</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average assists per game for your team."
                    : "Enter your individual assists per game."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Rebounds</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average rebounds per game for your team."
                    : "Enter your individual rebounds per game."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Blocks</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average blocks per game for your team."
                    : "Enter your individual blocks per game."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Steals</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the average steals per game for your team."
                    : "Enter your individual steals per game."}
                </span>
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
        {selectedSport === sportsEnum.soccer && (
          <div>
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Clean Sheets</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the total clean sheets for your team."
                    : "Enter your individual clean sheets."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Goals Scored</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the total goals scored by your team."
                    : "Enter your individual goals scored."}
                </span>
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
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Assists</h6>
                <span className="text-subtitle">
                  {athlete.registrationType === AthleteRegistrationType.Team
                    ? "Enter the total assists by your team."
                    : "Enter your individual assists."}
                </span>
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
        <div className="grid grid-cols-8 py-3 border-b border-t">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Professional Skills</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <div className="flex items-center space-x-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
              />
              <Button type="button" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {getValues("professionalSkills")?.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 px-2 py-1 rounded"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-600"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Team GPA Average"
                : "Academic GPA"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <Input
              {...register("gpa")}
              error={errors.gpa?.message}
              placeholder="Enter your GPA"
            />
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Provide the average GPA of all team members."
                : "Enter your current academic GPA based on your latest transcripts."}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Professional References</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <div className="flex items-start space-x-2">
              <Textarea
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                rows={4}
                placeholder="Add a reference"
              />
              <Button type="button" onClick={handleAddReference}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {getValues("professionalReferences")?.map((reference, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 px-2 py-1 rounded"
                >
                  <span>{reference}</span>
                  <button
                    type="button"
                    className="ml-2 text-gray-600"
                    onClick={() => handleRemoveReference(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "List the names and contact information of at least two professional references who can vouch for your team's skills and achievements."
                : "List the names and contact information of at least two professional references who can vouch for your skills and achievements."}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Stats Source URL</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <Input
              {...register("statsSourceURL")}
              error={errors.statsSourceURL?.message}
              placeholder="Enter your athletic stats source URL"
            />
            <div className="text-subtitle">
              <p>
                {athlete.registrationType === AthleteRegistrationType.Team
                  ? "Provide a URL to a reputable source where your team's athletic statistics are documented."
                  : "Provide a URL to a reputable source where your athletic statistics are documented."}
              </p>
              <p>Allowed sources:</p>
              <div className="flex flex-wrap gap-2">
                {allowedStatsSourceURLs.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-outline"
                  >
                    {new URL(url).hostname}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Team Bio"
                : "Bio"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8">
            <Textarea
              {...register("bio")}
              rows={4}
              error={errors.bio?.message}
              placeholder={
                athlete.registrationType === AthleteRegistrationType.Team
                  ? "Enter your team bio"
                  : "Enter your bio"
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Team Reel"
                : "Your Reel"}
            </h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <InputGroup
              withLabel="Youtube.com/shorts/"
              {...register("youtubeUrl")}
              error={errors.youtubeUrl?.message}
            />
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Upload a 30-60 second Youtube video of your team's pitch. Make sure it's unlisted. You're giving a short glimpse to brands about your team and why you both will be great partners."
                : "Upload a 30-60 second Youtube video of your pitch. Make sure it's unlisted. You're giving a short glimpse to brands about you and why you both will be great partners."}
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
