"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
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
import { JobPostingWithCompanyInfo } from "@/schemas/jobPostingSchema";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const fetchJobPostings = async (page: number) => {
  const { data } = await axios.get(`/api/job?limit=9&page=${page}`);
  return data;
};

const Opportunities = () => {
  const [selectedJob, setSelectedJob] =
    useState<JobPostingWithCompanyInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    isLoading,
    isError,
    error,
    data: jobData,
    isFetching,
  } = useQuery({
    queryKey: ["jobPostings", currentPage],
    queryFn: () => fetchJobPostings(currentPage),
    staleTime: 240000,
    gcTime: 240000,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleJobSelect = (job: JobPostingWithCompanyInfo) => {
    setSelectedJob(job);
  };

  const handleJobUpdate = (updatedJob: JobPostingWithCompanyInfo) => {
    setSelectedJob(updatedJob);
  };

  return (
    <>
      <div className="text-dark">
        <Breadcrumb icon={faLightbulb} menu={"Opportunities"} />
        <div className="my-6">
          <h1 className="text-3xl font-semibold mb-2">{"Opportunities"}</h1>
          <span className="text-subtitle">
            Find brand opportunities right for you.
          </span>
        </div>
        <div className="bg-primary p-4 rounded-lg mb-6">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-primary mx-2 w-5 h-5"
              />
              <input
                type="text"
                className="flex-grow bg-transparent focus:outline-none"
                placeholder="Job Title, Keywords"
              />
            </div>
            <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-primary mx-2 w-5 h-5"
              />
              <input
                type="text"
                className="flex-grow bg-transparent focus:outline-none"
                placeholder="Location"
              />
            </div>
            <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="text-primary mx-2 w-5 h-5"
              />
              <input
                type="text"
                className="flex-grow bg-transparent focus:outline-none"
                placeholder="Job Type"
              />
            </div>
            <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
              <FontAwesomeIcon
                icon={faDollar}
                className="text-primary mx-2 w-5 h-5"
              />
              <input
                type="text"
                className="flex-grow bg-transparent focus:outline-none"
                placeholder="Price"
              />
            </div>
            <Button className="lg:w-auto w-full bg-white text-primary border border-primary font-semibold">
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error: {error.message}</div>
          ) : (
            jobData.jobPostings.map(
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
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={jobData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
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
