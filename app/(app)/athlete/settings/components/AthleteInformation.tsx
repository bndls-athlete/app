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
  schoolOrUniversity: z.string().min(1, "Required"),
  graduationMonth: z.string().min(1, "Required"),
  graduationDay: z
    .string()
    .min(1, "Required")
    .regex(/^(0[1-9]|[12][0-9]|3[01])$/, "Invalid day (format: DD)"),
  graduationYear: z
    .string()
    .min(1, "Required")
    .regex(/^(19|20)\d{2}$/, "Invalid year (format: YYYY)"),
  sports: z.array(sportSchema),
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
      era: validateNumber,
      wins: validateNumber,
      battingAverage: validateNumber,
      hits: validateNumber,
    })
    .optional(),
  basketballStats: z
    .object({
      starRating: validateNumber,
      position: z.string(),
    })
    .optional(),
  footballStats: z
    .object({
      starRating: validateNumber,
      position: z.string(),
    })
    .optional(),
  soccerStats: z
    .object({
      cleanSheets: validateNumber,
      goalsScored: validateNumber,
      assists: validateNumber,
    })
    .optional(),
  winsLossRecord: z
    .object({
      wins: validateNumber,
      losses: validateNumber,
    })
    .optional(),
  tournamentsPlayedIn: z.string().optional(),
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
    schoolOrUniversity: athlete.schoolOrUniversity || "",
    graduationMonth: athlete.graduationDate
      ? format(new Date(athlete.graduationDate), "MMMM")
      : "",
    graduationDay: athlete.graduationDate
      ? format(new Date(athlete.graduationDate), "dd")
      : "",
    graduationYear: athlete.graduationDate
      ? format(new Date(athlete.graduationDate), "yyyy")
      : "",
    sports: athlete.sports || [],
    professionalSkills: athlete.professionalSkills || [],
    gpa: athlete.currentAcademicGPA?.toFixed(2) || "",
    professionalReferences: athlete.professionalReferences || [],
    statsSourceURL: athlete.statsSourceURL || "",
    bio: athlete.bio || "",
    youtubeUrl: athlete.reel?.split("/shorts/")[1] || "",
    baseballStats: {
      era: athlete.baseballStats?.era,
      wins: athlete.baseballStats?.wins,
      battingAverage: athlete.baseballStats?.battingAverage,
      hits: athlete.baseballStats?.hits,
    },
    basketballStats: {
      starRating: athlete.basketballStats?.starRating,
      position: athlete.basketballStats?.position || "",
    },
    footballStats: {
      starRating: athlete.footballStats?.starRating,
      position: athlete.footballStats?.position || "",
    },
    winsLossRecord: {
      wins: athlete.winsLossRecord?.wins,
      losses: athlete.winsLossRecord?.losses,
    },
    tournamentsPlayedIn: athlete.tournamentsPlayedIn || "",
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

  const selectedSports = watch("sports");

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
      schoolOrUniversity: data.schoolOrUniversity,
      graduationDate:
        data.graduationMonth && data.graduationDay && data.graduationYear
          ? new Date(
              `${data.graduationYear}-${data.graduationMonth}-${data.graduationDay}`
            )
          : undefined,
      sports: data.sports || [],
      professionalSkills: data.professionalSkills,
      currentAcademicGPA: data.gpa ? parseFloat(data.gpa) : undefined,
      professionalReferences: data.professionalReferences,
      statsSourceURL: data.statsSourceURL,
      bio: data.bio,
      reel: data.youtubeUrl
        ? `https://www.youtube.com/shorts/${data.youtubeUrl}`
        : undefined,
      baseballStats: {
        era: data.baseballStats?.era,
        wins: data.baseballStats?.wins,
        battingAverage: data.baseballStats?.battingAverage,
        hits: data.baseballStats?.hits,
      },
      basketballStats: {
        starRating: data.basketballStats?.starRating,
        position: data.basketballStats?.position,
      },
      footballStats: {
        starRating: data.footballStats?.starRating,
        position: data.footballStats?.position,
      },
      // ...
      winsLossRecord: {
        wins: data.winsLossRecord?.wins,
        losses: data.winsLossRecord?.losses,
      },
      tournamentsPlayedIn: data.tournamentsPlayedIn,
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
            <h6 className="font-semibold">School or University</h6>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <Input
              {...register("schoolOrUniversity")}
              error={errors.schoolOrUniversity?.message}
              placeholder="Enter your school or university"
            />
            <span className="text-subtitle">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Mention the school or university your team represents."
                : "Mention the school or university where you are currently studying or have graduated from."}
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
            <h6 className="font-semibold">Sports</h6>
            <p className="col-span-2 text-subtitle mr-3">
              {athlete.registrationType === AthleteRegistrationType.Team
                ? "Choose the sports your team actively participates in."
                : "Choose the sports you are actively participating in or have expertise in."}
            </p>
          </div>

          <div className="lg:col-span-3 md:col-span-6 col-span-8 grid grid-cols-2 gap-3">
            {Object.values(sportsEnum).map(
              (sport) =>
                sport && (
                  <label key={sport} className="flex items-center">
                    <input
                      type="checkbox"
                      value={sport}
                      {...register("sports")}
                      className="mr-2 checkbox"
                    />
                    {sport}
                  </label>
                )
            )}
          </div>
        </div>

        {athlete.registrationType === AthleteRegistrationType.Team && (
          <>
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Wins-Loss Record</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8 flex space-x-4">
                <div className="flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("winsLossRecord.wins")}
                    error={errors.winsLossRecord?.wins?.message}
                    placeholder="Wins"
                  />
                  <span className="text-subtitle">
                    Enter your team&aspo;s wins.
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("winsLossRecord.losses")}
                    error={errors.winsLossRecord?.losses?.message}
                    placeholder="Losses"
                  />
                  <span className="text-subtitle">
                    Enter your team&aspos;s losses.
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-8 py-3">
              <div className="md:col-span-2 col-span-8">
                <h6 className="font-semibold">Tournaments Played In</h6>
              </div>
              <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                <Textarea
                  {...register("tournamentsPlayedIn")}
                  rows={4}
                  error={errors.tournamentsPlayedIn?.message}
                  placeholder="Enter tournaments (one per line)"
                />
                <span className="text-subtitle">
                  Enter the major tournaments your team has participated in.
                </span>
              </div>
            </div>
          </>
        )}

        {selectedSports.includes(sportsEnum.basketball) &&
          athlete.registrationType === AthleteRegistrationType.Individual && (
            <div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Basketball Star Rating</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("basketballStats.starRating")}
                    error={errors.basketballStats?.starRating?.message}
                    placeholder="Enter your basketball star rating"
                  />
                  <span className="text-subtitle">
                    Enter your star rating for basketball.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Basketball Position</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    {...register("basketballStats.position")}
                    error={errors.basketballStats?.position?.message}
                    placeholder="Enter your basketball position"
                  />
                  <span className="text-subtitle">
                    Enter your position for basketball.
                  </span>
                </div>
              </div>
            </div>
          )}
        {selectedSports.includes(sportsEnum.soccer) &&
          athlete.registrationType === AthleteRegistrationType.Individual && (
            <div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Soccer Clean Sheets</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("soccerStats.cleanSheets")}
                    error={errors.soccerStats?.cleanSheets?.message}
                    placeholder="Enter your soccer clean sheets"
                  />
                  <span className="text-subtitle">
                    Enter your individual clean sheets for soccer.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Soccer Goals Scored</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("soccerStats.goalsScored")}
                    error={errors.soccerStats?.goalsScored?.message}
                    placeholder="Enter your soccer goals scored"
                  />
                  <span className="text-subtitle">
                    Enter your individual goals scored for soccer.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Soccer Assists</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("soccerStats.assists")}
                    error={errors.soccerStats?.assists?.message}
                    placeholder="Enter your soccer assists"
                  />
                  <span className="text-subtitle">
                    Enter your individual assists for soccer.
                  </span>
                </div>
              </div>
            </div>
          )}
        {selectedSports.includes(sportsEnum.baseball) &&
          athlete.registrationType === AthleteRegistrationType.Individual && (
            <div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Baseball ERA (Pitchers)</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("baseballStats.era")}
                    error={errors.baseballStats?.era?.message}
                    placeholder="Enter your baseball ERA"
                  />
                  <span className="text-subtitle">
                    Enter your individual ERA for baseball.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Baseball Wins (Pitchers)</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("baseballStats.wins")}
                    error={errors.baseballStats?.wins?.message}
                    placeholder="Enter your baseball wins"
                  />
                  <span className="text-subtitle">
                    Enter your individual wins for baseball.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">
                    Baseball Batting Average (Non-Pitchers)
                  </h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("baseballStats.battingAverage")}
                    error={errors.baseballStats?.battingAverage?.message}
                    placeholder="Enter your baseball batting average"
                  />
                  <span className="text-subtitle">
                    Enter your individual batting average for baseball.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">
                    Baseball Hits (Non-Pitchers)
                  </h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("baseballStats.hits")}
                    error={errors.baseballStats?.hits?.message}
                    placeholder="Enter your baseball hits"
                  />
                  <span className="text-subtitle">
                    Enter your individual hits for baseball.
                  </span>
                </div>
              </div>
            </div>
          )}

        {selectedSports.includes(sportsEnum.football) &&
          athlete.registrationType === AthleteRegistrationType.Individual && (
            <div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Football Star Rating</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    type="number"
                    {...register("footballStats.starRating")}
                    error={errors.footballStats?.starRating?.message}
                    placeholder="Enter your football star rating"
                  />
                  <span className="text-subtitle">
                    Enter your star rating for football.
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-8 py-3">
                <div className="md:col-span-2 col-span-8">
                  <h6 className="font-semibold">Football Position</h6>
                </div>
                <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
                  <Input
                    {...register("footballStats.position")}
                    error={errors.footballStats?.position?.message}
                    placeholder="Enter your football position"
                  />
                  <span className="text-subtitle">
                    Enter your position for football.
                  </span>
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
