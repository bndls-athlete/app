"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import InputGroup from "@/app/components/InputGroup";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastProvider";
import { useAthleteData } from "@/hooks/useAthleteData";
import { Athlete } from "@/schemas/athleteSchema";
import { validateNumber } from "@/helpers/zodSchemaHelpers";

const athleteSocialMediaSchema = z
  .object({
    instagram: z.string().optional(),
    instagramFollowers: validateNumber,
    tiktok: z.string().optional(),
    tiktokFollowers: validateNumber,
    youtube: z.string().optional(),
    youtubeFollowers: validateNumber,
    twitter: z.string().optional(),
    twitterFollowers: validateNumber,
  })
  .superRefine((data, ctx) => {
    if (data.instagram && data.instagramFollowers === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Instagram followers are required",
        path: ["instagramFollowers"],
      });
    }
    if (data.tiktok && data.tiktokFollowers === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "TikTok followers are required",
        path: ["tiktokFollowers"],
      });
    }
    if (data.youtube && data.youtubeFollowers === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "YouTube subscribers are required",
        path: ["youtubeFollowers"],
      });
    }
    if (data.twitter && data.twitterFollowers === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Twitter followers are required",
        path: ["twitterFollowers"],
      });
    }
  });

// Helper function to extract username/handle from URL
const extractHandle = (url: string | undefined, platform: string): string => {
  if (!url) return "";
  const patterns: { [key: string]: RegExp } = {
    instagram: /(?:http[s]?:\/\/)?instagram\.com\/([^\/\?\s]+)/,
    tiktok: /(?:http[s]?:\/\/)?www\.tiktok\.com\/@([^\/\?\s]+)/,
    youtube: /(?:http[s]?:\/\/)?www\.youtube\.com\/@([^\/\?\s]+)/,
    twitter: /(?:http[s]?:\/\/)?twitter\.com\/([^\/\?\s]+)/,
  };
  const match = url.match(patterns[platform]);
  return match ? match[1] : "";
};

type SocialMediaFormValues = z.infer<typeof athleteSocialMediaSchema>;

type AthleteSocialMediaProps = {
  athlete: Partial<Athlete>;
};

const SocialMedia = ({ athlete }: AthleteSocialMediaProps) => {
  const initialFormValues: SocialMediaFormValues = {
    instagram: extractHandle(
      athlete.socialProfiles?.instagram ?? "",
      "instagram"
    ),
    instagramFollowers: athlete.followers?.instagram,
    tiktok: extractHandle(athlete.socialProfiles?.tiktok ?? "", "tiktok"),
    tiktokFollowers: athlete.followers?.tiktok,
    youtube: extractHandle(athlete.socialProfiles?.youtube ?? "", "youtube"),
    youtubeFollowers: athlete.followers?.youtube,
    twitter: extractHandle(athlete.socialProfiles?.twitter ?? "", "twitter"),
    twitterFollowers: athlete.followers?.twitter,
  };

  const { addToast } = useToast();
  const { invalidateAthlete } = useAthleteData();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(athleteSocialMediaSchema),
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<SocialMediaFormValues> = async (data) => {
    setIsLoading(true);

    const socialMediaProfiles = {
      instagram: data.instagram
        ? `https://instagram.com/${data.instagram}`
        : null,
      tiktok: data.tiktok ? `https://www.tiktok.com/@${data.tiktok}` : null,
      youtube: data.youtube ? `https://www.youtube.com/@${data.youtube}` : null,
      twitter: data.twitter ? `https://twitter.com/${data.twitter}` : null,
    };

    const filteredSocialMediaProfiles = Object.fromEntries(
      Object.entries(socialMediaProfiles).filter(([_, value]) => value !== null)
    );

    const followers = {
      instagram: data.instagramFollowers,
      tiktok: data.tiktokFollowers,
      youtube: data.youtubeFollowers,
      twitter: data.twitterFollowers,
    };

    const filteredFollowers = Object.fromEntries(
      Object.entries(followers).filter(
        ([key, value]) =>
          value !== undefined && filteredSocialMediaProfiles[key]
      )
    );

    const socialMediaData = {
      socialProfiles: filteredSocialMediaProfiles,
      followers: filteredFollowers,
    };

    try {
      await axios.post("/api/athlete", socialMediaData);
      addToast("success", "Updated Successfully!");
    } catch (error) {
      console.error("Error updating social media profiles:", error);
    } finally {
      invalidateAthlete();
      setIsLoading(false);
    }
  };

  console.log(errors);

  const instagramHandle = watch("instagram");
  const tiktokHandle = watch("tiktok");
  const youtubeHandle = watch("youtube");
  const twitterHandle = watch("twitter");

  const formatFollowerCount = (count: number | undefined) => {
    return count ? new Intl.NumberFormat("en-US").format(count) : "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Social Profile</h6>
            <span className="text-subtitle">
              Upload your social media profiles.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8">
            <h6 className="font-semibold">Social Profiles</h6>
            <span className="text-subtitle">You must have at least one.</span>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <InputGroup
              withLabel="Instagram.com/"
              {...register("instagram")}
              error={errors.instagram?.message}
            />
            <span className="text-subtitle">
              Enter your Instagram username (e.g., john_doe).
            </span>
            {instagramHandle && (
              <>
                <InputGroup
                  withLabel="Instagram Followers"
                  type="number"
                  {...register("instagramFollowers")}
                  error={errors.instagramFollowers?.message}
                />
                <span className="text-subtitle">
                  Your follower count:{" "}
                  {formatFollowerCount(watch("instagramFollowers"))}
                </span>
              </>
            )}
            <InputGroup
              withLabel="Tiktok.com/@"
              {...register("tiktok")}
              error={errors.tiktok?.message}
            />
            <span className="text-subtitle">
              Enter your TikTok username (e.g., john_doe).
            </span>
            {tiktokHandle && (
              <>
                <InputGroup
                  withLabel="TikTok Followers"
                  type="number"
                  {...register("tiktokFollowers")}
                  error={errors.tiktokFollowers?.message}
                />
                <span className="text-subtitle">
                  Your follower count:{" "}
                  {formatFollowerCount(watch("tiktokFollowers"))}
                </span>
              </>
            )}
            <InputGroup
              withLabel="Youtube.com/@"
              {...register("youtube")}
              error={errors.youtube?.message}
            />
            <span className="text-subtitle">
              Enter your YouTube channel Name (e.g., john_doe).
            </span>
            {youtubeHandle && (
              <>
                <InputGroup
                  withLabel="YouTube Subscribers"
                  type="number"
                  {...register("youtubeFollowers")}
                  error={errors.youtubeFollowers?.message}
                />
                <span className="text-subtitle">
                  Your subscriber count:{" "}
                  {formatFollowerCount(watch("youtubeFollowers"))}
                </span>
              </>
            )}
            <InputGroup
              withLabel="Twitter.com/"
              {...register("twitter")}
              error={errors.twitter?.message}
            />
            <span className="text-subtitle">
              Enter your Twitter handle (e.g., johndoe).
            </span>
            {twitterHandle && (
              <>
                <InputGroup
                  withLabel="Twitter Followers"
                  type="number"
                  {...register("twitterFollowers")}
                  error={errors.twitterFollowers?.message}
                />
                <span className="text-subtitle">
                  Your follower count:{" "}
                  {formatFollowerCount(watch("twitterFollowers"))}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            <Button className="py-2" type="submit" disabled={isLoading}>
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
      {errors.root && (
        <div className="text-red-500 text-sm py-2">{errors.root.message}</div>
      )}
    </form>
  );
};

export default SocialMedia;
