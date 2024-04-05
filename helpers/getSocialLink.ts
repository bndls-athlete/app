import { SocialMediaPlatform } from "@/schemas/athleteSchema";

export const getSocialLink = (
  platform: SocialMediaPlatform,
  handle: string
) => {
  const baseUrls = {
    instagram: "https://instagram.com/",
    tiktok: "https://www.tiktok.com/@",
    youtube: "https://www.youtube.com/@",
    twitter: "https://twitter.com/",
  };
  return baseUrls[platform] + handle;
};
