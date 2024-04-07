"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "@/app/components/Breadcrumb";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLocationDot,
  faBriefcase,
  faDollar,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/Button";
import JobCard from "./components/JobCard";
import Pagination from "@/app/components/Pagination";
import JobModal from "./components/JobModal";
import {
  JobPostingWithCompanyInfo,
  jobTypeEnum,
  jobTypeSchema,
} from "@/schemas/jobPostingSchema";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { validateNumber } from "@/helpers/zodSchemaHelpers";
import { stateOptions } from "@/helpers/stateOptions";
import Select from "@/app/components/Select";
import Input from "@/app/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchJobPostings = async (
  params: JobSearchFormValues & { page: number }
) => {
  const { jobType, ...rest } = params;
  const sanitizedParams = {
    ...rest,
    jobType: jobType === "" ? undefined : jobType,
  };

  const { data } = await axios.get<{
    success: boolean;
    message: string;
    jobPostings: JobPostingWithCompanyInfo[];
    currentPage: number;
    totalPages: number;
  }>("/api/jobs", { params: sanitizedParams });
  return data;
};

const jobSearchSchema = z.object({
  title: z.string().optional(),
  keywords: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  jobType: z.nativeEnum(jobTypeEnum).default(jobTypeEnum[""]),
  priceMin: validateNumber,
  priceMax: validateNumber,
});

type JobSearchFormValues = z.infer<typeof jobSearchSchema>;

const Opportunities = () => {
  const [selectedJob, setSelectedJob] =
    useState<JobPostingWithCompanyInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<JobSearchFormValues>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: {
      title: searchParams.get("title") || "",
      keywords: searchParams.get("keywords") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      jobType: (searchParams.get("jobType") as any) || "",
      priceMin: searchParams.has("priceMin")
        ? Number(searchParams.get("priceMin"))
        : undefined,
      priceMax: searchParams.has("priceMax")
        ? Number(searchParams.get("priceMax"))
        : undefined,
    },
  });

  const formData = watch();

  const {
    isSuccess,
    isLoading,
    isError,
    error,
    data: jobData,
  } = useQuery({
    queryKey: ["jobPostings", searchParams.toString()],
    queryFn: () => fetchJobPostings({ ...formData, page: currentPage }),
    // placeholderData: (previousData, previousQuery) => previousData,
    staleTime: 4 * 60 * 1000, // 4 mins
  });

  const onSubmit = async (data: JobSearchFormValues) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, value.toString());
      }
    });
    router.push(`${pathname}?${params.toString()}`);
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

  const handleJobSelect = (job: JobPostingWithCompanyInfo) => {
    setSelectedJob(job);
  };

  const handleJobUpdate = (updatedJob: JobPostingWithCompanyInfo) => {
    setSelectedJob(updatedJob);
  };

  const appliedFilters = Object.entries(
    Object.fromEntries(searchParams.entries())
  ).filter(
    ([key, value]) => value !== undefined && value !== "" && key !== "page"
  );

  return (
    <>
      <div className="text-dark flex flex-col h-full">
        <Breadcrumb icon={faLightbulb} menu={"Opportunities"} />
        <div className="my-6">
          <h1 className="text-3xl font-semibold mb-2">{"Opportunities"}</h1>
          <span className="text-subtitle">
            Find brand opportunities right for you.
          </span>
        </div>

        <div className="bg-primary p-4 rounded-lg mb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Input
                  type="text"
                  className="flex-grow bg-transparent focus:outline-none"
                  placeholder="Job Title"
                  {...register("title")}
                />
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Input
                  type="text"
                  className="flex-grow bg-transparent focus:outline-none"
                  placeholder="Keywords"
                  {...register("keywords")}
                />
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Input
                  type="text"
                  className="flex-grow bg-transparent focus:outline-none"
                  placeholder="City"
                  {...register("city")}
                />
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Select {...register("state")}>
                  <option value="">Select State</option>
                  {stateOptions()}
                </Select>
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Select {...register("jobType")}>
                  <option value="">Select Job Type</option>
                  {Object.values(jobTypeSchema.options).map((jobType) => (
                    <option key={jobType} value={jobType}>
                      {jobType}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faDollar}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Input
                  type="number"
                  className="flex-grow bg-transparent focus:outline-none"
                  placeholder="Min Price"
                  {...register("priceMin")}
                />
              </div>
              <div className="flex items-center bg-white p-2 rounded-lg">
                <FontAwesomeIcon
                  icon={faDollar}
                  className="text-primary mx-2 w-5 h-5"
                />
                <Input
                  type="number"
                  className="flex-grow bg-transparent focus:outline-none"
                  placeholder="Max Price"
                  {...register("priceMax")}
                />
              </div>
              <div className="flex justify-end md:col-span-2 lg:col-span-1">
                <Button
                  type="button"
                  className="mr-2 bg-white hover:bg-white text-primary border border-primary font-semibold"
                  onClick={resetForm}
                >
                  Clear Filters
                </Button>
                <Button
                  type="submit"
                  className="bg-white hover:bg-white text-primary border border-primary font-semibold"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>

        {appliedFilters.length > 0 && (
          <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">Current Filters</h3>
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map(([key, value]) => (
                <div
                  key={key}
                  className="bg-primary text-white px-3 py-1 rounded-full text-sm"
                >
                  {key}: {value}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : jobData?.jobPostings.length === 0 ? (
              <div className="text-center py-4 w-full lg:col-span-3">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-4xl text-primary mb-3"
                />
                <h3 className="text-xl font-semibold">No Results Found</h3>
                <p>Try adjusting your search filters.</p>
              </div>
            ) : (
              jobData?.jobPostings.map(
                (job: JobPostingWithCompanyInfo, index: number) => (
                  <JobCard
                    key={index}
                    job={job}
                    onSelectJob={() => handleJobSelect(job)}
                  />
                )
              )
            )}
          </div>
        </div>

        {
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={jobData?.totalPages || 1}
              onPageChange={handlePageChange}
            />
          </div>
        }
      </div>
      {selectedJob && (
        <JobModal
          jobData={selectedJob}
          onJobUpdate={handleJobUpdate}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
};

export default Opportunities;
