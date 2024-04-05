"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "@/app/components/Breadcrumb";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import {
  faBookmark,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Table from "@/app/components/Table";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import useUserType from "@/hooks/useUserType";
import { stateOptions } from "@/helpers/stateOptions";
import {
  Athlete,
  Gender,
  SocialMediaPlatform,
  Sport,
  genderEnum,
  genderSchema,
  socialMediaPlatformEnum,
  sportSchema,
  sportsEnum,
} from "@/schemas/athleteSchema";
import { z } from "zod";
import { validateNumber } from "@/helpers/zodSchemaHelpers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/app/components/Pagination";
import AthleteTable from "@/app/components/AthleteTable";
import { useQuery } from "@tanstack/react-query";

const discoverySchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
  followersMin: validateNumber,
  followersMax: validateNumber,
  gender: z.nativeEnum(genderEnum).optional(),
  rating: validateNumber.default(1),
  sport: z.nativeEnum(sportsEnum).default(sportsEnum[""]),
  username: z.string().optional(),
});

type DiscoveryFormValues = z.infer<typeof discoverySchema>;

const fetchAthletes = async (
  params: DiscoveryFormValues & { menu: SocialMediaPlatform; page: number }
) => {
  const { data } = await axios.get<{
    success: boolean;
    message: string;
    athletes: Athlete[];
    usernameResult: Athlete | null;
    currentPage: number;
    totalPages: number;
  }>("/api/discovery", { params });
  return data;
};

const Discovery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const menu: SocialMediaPlatform = (searchParams.get("menu") ||
    "instagram") as SocialMediaPlatform;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { type } = useUserType();

  const links = [
    {
      path: `/${type}/discovery/?menu=instagram`,
      label: "Instagram",
      condition: true,
    },
    {
      path: `/${type}/discovery/?menu=youtube`,
      label: "YouTube",
      condition: true,
    },
    {
      path: `/${type}/discovery/?menu=tiktok`,
      label: "TikTok",
      condition: true,
    },
    {
      path: `/${type}/discovery/?menu=twitter`,
      label: "Twitter",
      condition: true,
    },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  // Helper function to reconstruct URL from username/handle and platform
  const buildUrl = (handle: string, platform: SocialMediaPlatform): string => {
    const baseUrls: { [key in SocialMediaPlatform]: string } = {
      instagram: "https://instagram.com/",
      tiktok: "https://www.tiktok.com/@",
      youtube: "https://www.youtube.com/@",
      twitter: "https://twitter.com/",
    };
    return `${baseUrls[platform]}${handle}`;
  };

  const initialFormData: DiscoveryFormValues = {
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    followersMin: searchParams.has("followersMin")
      ? parseInt(searchParams.get("followersMin")!, 10)
      : undefined,
    followersMax: searchParams.has("followersMax")
      ? parseInt(searchParams.get("followersMax")!, 10)
      : undefined,
    gender: (searchParams.get("gender") as Gender) || "",
    rating: parseInt(searchParams.get("rating") || "1", 10),
    sport: (searchParams.get("sport") as Sport) || "",
    username: searchParams.get("username") || "",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DiscoveryFormValues>({
    resolver: zodResolver(discoverySchema),
    defaultValues: initialFormData,
  });

  const formData = watch();

  const username = watch("username");

  const {
    isLoading,
    isError,
    error,
    data: athleteData,
  } = useQuery({
    queryKey: ["athletes", searchParams.toString()],
    queryFn: () => {
      const usernameUrl = username ? buildUrl(username, menu) : undefined;
      return fetchAthletes({
        ...formData,
        menu,
        page: currentPage,
        username: usernameUrl,
      });
    },
    staleTime: 4 * 60 * 1000, // 4 mins
    placeholderData: (previousData, previousQuery) => previousData,
    enabled: Object.entries(Object.fromEntries(searchParams.entries())).some(
      ([key, value]) =>
        value !== undefined && value !== "" && key !== "page" && key !== "menu"
    ),
  });

  const onSubmit = async (data: DiscoveryFormValues) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (data.username) {
      params.set("username", data.username);
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && key !== "username") {
          params.set(key, value.toString());
        }
      });
    }
    router.push(`${pathname}?menu=${menu}&${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetForm = () => {
    reset();
    // router.push(pathname);
  };

  const appliedFilters = Object.entries(
    Object.fromEntries(searchParams.entries())
  ).filter(
    ([key, value]) =>
      value !== undefined && value !== "" && key !== "page" && key !== "menu"
  );

  return (
    <div className="text-dark">
      <Breadcrumb />
      <div className="my-6">
        <h1 className="text-3xl font-semibold mb-2">Discovery</h1>
        <p className="text-lg text-subtitle mb-4">Search for athletes</p>
        <div className="mt-4">
          <div className="hidden sm:block">
            <div className="join join-horizontal">
              {links.map((link) =>
                link.condition ? (
                  <Link
                    key={link.label}
                    href={link.path}
                    className={`btn ${
                      menu === link.label.toLowerCase()
                        ? "btn-active btn-primary"
                        : "btn-white"
                    } join-item`}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          </div>
          <div className="lg:hidden">
            <Select
              onChange={handleSelectChange}
              value={`/${type}/discovery/?menu=${menu}`}
            >
              {links.map(
                (link) =>
                  link.condition && (
                    <option key={link.label} value={link.path}>
                      {link.label}
                    </option>
                  )
              )}
            </Select>
          </div>
        </div>

        <div className="my-2">
          <Card>
            <Card.Header className="py-2">
              Athlete Filters
              <p className="text-xs text-subtitle font-medium">
                Try starting with number of followers and audience filters
                narrowing your search
              </p>
            </Card.Header>
            <Card.Body className="py-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-xs font-semibold">State</label>
                    <Select
                      {...register("state")}
                      error={errors.state?.message}
                    >
                      <option value="">Select State</option>
                      {stateOptions()}
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">City</label>
                    <Input
                      {...register("city")}
                      error={errors.city?.message}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold capitalize">
                      {menu} {menu === "youtube" ? "Subscribers" : "Followers"}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        error={errors.followersMin?.message}
                        {...register("followersMin")}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        error={errors.followersMax?.message}
                        {...register("followersMax")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Gender</label>
                    <Select
                      {...register("gender")}
                      error={errors.gender?.message}
                    >
                      <option value="">Any</option>
                      {Object.values(genderSchema.options).map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">
                      Athlete Rating
                    </label>
                    <Select
                      {...register("rating")}
                      error={errors.rating?.message}
                    >
                      <option value="1">≥ 1</option>
                      {[2, 3, 4].map((rating) => (
                        <option key={rating} value={rating}>
                          ≥ {rating}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Sport</label>
                    <Select
                      {...register("sport")}
                      error={errors.sport?.message}
                    >
                      <option value="">Any</option>
                      {Object.values(sportSchema.options).map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="divider my-4">OR</div>
                <div className="my-2">
                  <Card.Header className="py-2">
                    Search by Username
                    <p className="text-xs text-subtitle font-medium">
                      Use this to check specific accounts and find athletes
                    </p>
                  </Card.Header>
                  <Card.Body className="py-3">
                    <div className="flex gap-2 mb-2">
                      <label className="text-xs font-semibold whitespace-nowrap capitalize">
                        Enter {menu} Username
                      </label>
                      <Input
                        error={errors.username?.message}
                        placeholder={`@${menu}Username`}
                        {...register("username")}
                      />
                    </div>
                  </Card.Body>
                </div>

                <Card.Footer className="py-2">
                  <div className="flex justify-end">
                    <div className="mb-1 flex gap-2">
                      <Button
                        type="button"
                        theme="light"
                        className="text-xs font-medium whitespace-nowrap"
                        onClick={resetForm}
                      >
                        Clear all filters
                      </Button>
                      <Button
                        type="submit"
                        className="text-xs font-medium"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Searching..."
                          : username
                          ? "Search Username"
                          : "Find Athletes"}
                      </Button>
                    </div>
                  </div>
                </Card.Footer>
              </form>
            </Card.Body>
          </Card>
        </div>

        {appliedFilters.length > 0 && (
          <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">Current Filters</h3>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map(([key, value]) => (
                <div
                  key={key}
                  className="bg-primary text-white px-3 py-1 rounded-lg text-sm"
                >
                  {key === "username" ? `${menu} Username` : key}: {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {athleteData?.usernameResult && (
          <AthleteTable
            athletes={athleteData.usernameResult}
            platform={menu}
            tableTitle="Profile Match"
            tableSubtitle="Here's the profile matching the username you searched for."
          />
        )}

        {athleteData?.athletes && athleteData?.athletes.length > 0 && (
          <>
            <AthleteTable
              athletes={athleteData.athletes}
              platform={menu}
              tableTitle="Search Results"
              tableSubtitle="Explore the profiles of athletes that match your search criteria."
            />
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={athleteData?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
      {!isLoading && athleteData?.athletes.length === 0 && (
        <div className="text-center py-4">
          <FontAwesomeIcon
            icon={faSearch}
            className="text-4xl text-primary mb-3"
          />
          <h3 className="text-xl font-semibold">No Results Found</h3>
          <p>
            Try adjusting your search filters or using a different username.
          </p>
        </div>
      )}
    </div>
  );
};

export default Discovery;
