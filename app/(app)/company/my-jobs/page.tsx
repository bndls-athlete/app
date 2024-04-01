"use client";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "@/app/components/Breadcrumb";
import { faBriefcase, faList } from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/Button";
import Pagination from "@/app/components/Pagination";
import { JobPostingWithCompanyInfo } from "@/schemas/jobPostingSchema";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Table from "@/app/components/Table";
import Link from "next/link";
import useUserType from "@/hooks/useUserType";

const fetchMyJobPostings = async (page: number) => {
  const { data } = await axios.get(`/api/my-jobs?limit=9&page=${page}`);
  return data;
};

const MyJobs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { type } = useUserType();

  const {
    isLoading,
    isError,
    error,
    data: jobData,
    isFetching,
  } = useQuery({
    queryKey: ["myJobPostings", currentPage],
    queryFn: () => fetchMyJobPostings(currentPage),
    staleTime: 240000,
    gcTime: 240000,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="text-dark">
        <Breadcrumb icon={faList} menu={"My Jobs"} />
        <div className="my-6">
          <h1 className="text-3xl font-semibold mb-2">{"My Jobs"}</h1>
          <span className="text-subtitle">
            View and manage your job postings.
          </span>
        </div>
        <Table
          headers={[
            "Job Title",
            "Location",
            "Job Type",
            "Fee Compensation",
            "Days Ago",
            "Actions",
          ]}
          textShowing="Jobs"
          subtitle={`Showing ${jobData?.jobPostings.length || 0} jobs`}
        >
          {jobData?.jobPostings.map((job: JobPostingWithCompanyInfo) => (
            <tr key={job._id.toString()}>
              <td className="p-3">{job.title}</td>
              <td className="p-3">
                {job.city}, {job.state}
              </td>
              <td className="p-3">{job.jobType}</td>
              <td className="p-3">${job.feeCompensation}</td>
              <td className="p-3">
                {Math.floor(
                  (new Date().getTime() - new Date(job.createdAt).getTime()) /
                    (1000 * 3600 * 24)
                )}{" "}
                days ago
              </td>
              <td className="p-3">
                <Link href={`/${type}/job/${job._id}`}>
                  <Button>View Applications</Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={jobData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default MyJobs;
