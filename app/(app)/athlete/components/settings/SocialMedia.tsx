import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../../components/Button";
import InputGroup from "@/app/components/InputGroup";
import axios from "axios";

// Define the Zod schema for form validation
const schema = z.object({
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
});

// Infer the type of the form values from the schema
type SocialMediaFormValues = z.infer<typeof schema>;

const SocialMedia = () => {
  // Initialize the useForm hook with Zod schema validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<SocialMediaFormValues> = async (data) => {
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
      const response = await axios.post("/api/athlete", socialMediaData);
      console.log("Social media profiles updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating social media profiles:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-3">
        <div className="flex justify-between border-b">
          <div className="py-3">
            <h6 className="font-semibold">Social Profile</h6>
            <span className="text-sm text-subtitle">
              Upload your social media profiles.
            </span>
          </div>
          <div className="py-3 flex gap-2">
            <Button theme="light" className="text-sm py-2" type="reset">
              Cancel
            </Button>
            <Button className="text-sm py-2" type="submit">
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-8 py-3 border-b">
          <div className="md:col-span-2 col-span-8 mb-3">
            <h6 className="text-sm font-semibold">Social Profiles</h6>
            <span className="text-sm text-subtitle">
              You must have at least one.
            </span>
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
            <Button theme="light" className="text-sm py-2" type="reset">
              Cancel
            </Button>
            <Button className="text-sm py-2" type="submit">
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SocialMedia;
