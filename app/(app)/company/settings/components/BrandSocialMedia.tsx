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
import { useBrandData } from "@/hooks/useBrandData";
import { Brand } from "@/schemas/brandSchema";

const brandSocialMediaSchema = z.object({
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
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

type SocialMediaFormValues = z.infer<typeof brandSocialMediaSchema>;

type BrandSocialMediaProps = {
  brand: Partial<Brand>;
};

const BrandSocialMedia = ({ brand }: BrandSocialMediaProps) => {
  const initialFormValues: SocialMediaFormValues = {
    instagram: extractHandle(
      brand.socialProfiles?.instagram ?? "",
      "instagram"
    ),
    tiktok: extractHandle(brand.socialProfiles?.tiktok ?? "", "tiktok"),
    youtube: extractHandle(brand.socialProfiles?.youtube ?? "", "youtube"),
    twitter: extractHandle(brand.socialProfiles?.twitter ?? "", "twitter"),
  };

  const { addToast } = useToast();

  const { invalidateBrand } = useBrandData();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the useForm hook with Zod schema validation and default values
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(brandSocialMediaSchema),
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
      youtube: data.youtube ? `https://www.youtube.com/@${data.youtube}` : null,
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
      await axios.post("/api/brand", socialMediaData);
      addToast("success", "Updated Successfully!");
    } catch (error) {
      console.error("Error updating social media profiles:", error);
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
            <InputGroup
              withLabel="Tiktok.com/@"
              {...register("tiktok")}
              error={errors.tiktok?.message}
            />
            <span className="text-subtitle">
              Enter your TikTok username (e.g., john_doe).
            </span>
            <InputGroup
              withLabel="Youtube.com/@"
              {...register("youtube")}
              error={errors.youtube?.message}
            />
            <span className="text-subtitle">
              Enter your YouTube channel name (e.g., john_doe).
            </span>
            <InputGroup
              withLabel="Twitter.com/"
              {...register("twitter")}
              error={errors.twitter?.message}
            />
            <span className="text-subtitle">
              Enter your Twitter handle (e.g., johndoe).
            </span>
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
    </form>
  );
};

export default BrandSocialMedia;
