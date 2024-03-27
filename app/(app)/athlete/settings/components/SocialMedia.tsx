import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import InputGroup from "@/app/components/InputGroup";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastProvider";
import { useAthleteCard } from "@/hooks/useAthleteCard";
import { useAthleteData } from "@/hooks/useAthleteData";

const atheteSocialMediaSchema = z.object({
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
});

// Helper function to extract username/handle from URL
const extractHandle = (url: string | undefined, platform: string): string => {
  if (!url) return "";
  const patterns: { [key: string]: RegExp } = {
    instagram: /(?:http[s]?:\/\/)?instagram\.com\/([^\/\?\s]+)/,
    tiktok: /(?:http[s]?:\/\/)?www\.tiktok\.com\/@([^\/\?\s]+)/,
    facebook: /(?:http[s]?:\/\/)?www\.facebook\.com\/([^\/\?\s]+)/,
    twitter: /(?:http[s]?:\/\/)?twitter\.com\/([^\/\?\s]+)/,
  };
  const match = url.match(patterns[platform]);
  return match ? match[1] : "";
};

type SocialMediaFormValues = z.infer<typeof atheteSocialMediaSchema>;

type Props = {
  athlete: {
    socialProfiles: {
      instagram?: string;
      tiktok?: string;
      facebook?: string;
      twitter?: string;
    };
  };
};

const SocialMedia = ({ athlete }: Props) => {
  // Define initial form values based on the athlete prop
  // Define initial form values based on the athlete prop
  const initialFormValues: SocialMediaFormValues = {
    instagram: extractHandle(
      athlete.socialProfiles?.instagram ?? "",
      "instagram"
    ),
    tiktok: extractHandle(athlete.socialProfiles?.tiktok ?? "", "tiktok"),
    facebook: extractHandle(athlete.socialProfiles?.facebook ?? "", "facebook"),
    twitter: extractHandle(athlete.socialProfiles?.twitter ?? "", "twitter"),
  };

  const { addToast } = useToast();

  const { invalidateAthleteCard } = useAthleteCard();
  const { invalidateAthlete } = useAthleteData();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the useForm hook with Zod schema validation and default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(atheteSocialMediaSchema),
    defaultValues: initialFormValues,
  });

  // Handle form submission
  const onSubmit: SubmitHandler<SocialMediaFormValues> = async (data) => {
    setIsLoading(true);
    const socialMediaProfiles = {
      instagram: data.instagram
        ? `https://instagram.com/${data.instagram}`
        : null,
      tiktok: data.tiktok ? `https://www.tiktok.com/@${data.tiktok}` : null,
      facebook: data.facebook
        ? `https://www.facebook.com/${data.facebook}`
        : null,
      twitter: data.twitter ? `https://twitter.com/${data.twitter}` : null,
    };

    // Filter out null values
    const filteredSocialMediaProfiles = Object.fromEntries(
      Object.entries(socialMediaProfiles).filter(([_, value]) => value !== null)
    );

    const socialMediaData = {
      socialProfiles: filteredSocialMediaProfiles,
    };

    try {
      await axios.post("/api/athlete", socialMediaData);
      // console.log("Social media profiles updated successfully:", response.data);
      addToast("success", "Updated Successfully!");
    } catch (error) {
      console.error("Error updating social media profiles:", error);
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
            <h6 className="font-semibold">Social Profile</h6>
            <span className=" text-subtitle">
              Upload your social media profiles.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8 mb-3">
            <h6 className=" font-semibold">Social Profiles</h6>
            <span className=" text-subtitle">You must have at least one.</span>
          </div>
          <div className="lg:col-span-3 md:col-span-6 col-span-8 flex flex-col gap-3">
            <InputGroup
              withLabel="Instagram.com/"
              {...register("instagram")}
              error={errors.instagram?.message}
            />
            <InputGroup
              withLabel="Tiktok.com/"
              {...register("tiktok")}
              error={errors.tiktok?.message}
            />
            <InputGroup
              withLabel="Facebook.com/"
              {...register("facebook")}
              error={errors.facebook?.message}
            />
            <InputGroup
              withLabel="Twitter.com/"
              {...register("twitter")}
              error={errors.twitter?.message}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="py-3 flex gap-2">
            <Button
              theme="light"
              className=" py-2"
              type="reset"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button className=" py-2" type="submit" disabled={isLoading}>
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

export default SocialMedia;
