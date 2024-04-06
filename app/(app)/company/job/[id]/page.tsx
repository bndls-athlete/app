"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Breadcrumb from "@/app/components/Breadcrumb";
import { faList, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Table from "@/app/components/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@/app/components/Pagination";
import { useSearchParams } from "next/navigation";
import { JobPosting } from "@/schemas/jobPostingSchema";
import { ApplicationWithPopulatedFields } from "@/schemas/applicationSchema";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import formatIntlNumber from "@/helpers/formatIntlNumber";
import { useAthleteCard } from "@/context/AthleteCardProvider";
dayjs.extend(relativeTime);

const fetchJobPosting = async (jobPostingId: string) => {
  const { data } = await axios.get<{
    success: boolean;
    jobPosting: JobPosting;
  }>(`/api/job?jobPostingId=${jobPostingId}`);
  return data;
};

const fetchApplications = async (jobPostingId: string, page: number) => {
  const { data } = await axios.get<{
    success: boolean;
    applications: ApplicationWithPopulatedFields[];
    currentPage: number;
    totalPages: number;
  }>(`/api/applications?jobPostingId=${jobPostingId}&limit=10&page=${page}`);
  return data;
};

function JobWithApplications() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const jobPostingId = params.id;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { showAthleteCard } = useAthleteCard();
  const queryClient = useQueryClient();

  const {
    isLoading: isJobLoading,
    isError: isJobError,
    error: jobError,
    data: jobData,
  } = useQuery({
    queryKey: ["jobPosting", jobPostingId],
    queryFn: () => fetchJobPosting(jobPostingId),
    enabled: !!jobPostingId,
  });

  const {
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    error: applicationsError,
    data: applicationsData,
  } = useQuery({
    queryKey: ["applications", jobPostingId, currentPage],
    queryFn: () => fetchApplications(jobPostingId, currentPage),
    enabled: !!jobPostingId,
    staleTime: 4 * 60 * 1000, // 4 mins
  });

  const deleteJobMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `/api/job?jobPostingId=${jobPostingId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobPostings"] });
      router.back();
    },
    onError: (error) => {
      console.error("Error deleting job:", error);
      alert("An error occurred while deleting the job. Please try again.");
    },
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // if (isJobLoading || isApplicationsLoading) {
  //   return <div>Loading...</div>;
  // }

  if (isJobError || isApplicationsError) {
    return <div>Error: {jobError?.message || applicationsError?.message}</div>;
  }

  const jobPosting = jobData?.jobPosting;

  const handleDeleteJob = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteJob = () => {
    deleteJobMutation.mutate();
  };

  const postedDaysAgo = jobPosting ? dayjs(jobPosting.createdAt).fromNow() : "";

  return (
    <>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteJob}
        title="Confirm Job Deletion"
      >
        <p>Are you sure you want to delete this job posting?</p>
        <p>This action cannot be undone.</p>
      </Modal>
      <div className="text-dark flex flex-col h-full">
        <div className="mb-8 cursor-pointer" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-4 h-4" />
          <span>Back</span>
        </div>
        <Breadcrumb menu="Job Applications" icon={faList} />
        <div className="my-6 flex-grow">
          <Card className="bg-base-100">
            <Card.Header className="bg-secondary rounded p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                  {jobPosting?.title || "Loading..."}
                </h1>
                <Button
                  className="btn btn-error"
                  onClick={handleDeleteJob}
                  disabled={deleteJobMutation.isPending || isJobLoading}
                >
                  {deleteJobMutation.isPending ? "Deleting..." : "Delete Job"}
                </Button>
              </div>
            </Card.Header>
            {isJobLoading ? (
              <Card.Body className="p-4">
                <p className="text-gray-500">Loading job details...</p>
              </Card.Body>
            ) : (
              <Card.Body className="p-4">
                <div className="text-gray-700 space-y-2">
                  <p>
                    <strong>Posted:</strong> {postedDaysAgo}
                  </p>
                  <p>
                    <strong>Location:</strong> {jobPosting?.city},{" "}
                    {jobPosting?.state}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {jobPosting?.jobType}
                  </p>
                  <p>
                    <strong>Fee Compensation:</strong> $
                    {jobPosting?.feeCompensation}
                  </p>
                  <p>
                    <strong>Number of Athletes:</strong>{" "}
                    {jobPosting?.numberOfAthletes || "N/A"}
                  </p>
                  <p>
                    <strong>Opportunity Description:</strong>{" "}
                    {jobPosting?.opportunityDescription}
                  </p>
                </div>
              </Card.Body>
            )}
          </Card>

          {isApplicationsLoading ? (
            <div className="text-center my-4 p-4 bg-gray-100 rounded-lg">
              <p>Loading applications...</p>
            </div>
          ) : applicationsData?.applications.length === 0 ? (
            <div className="text-center my-4 p-4 bg-gray-100 rounded-lg">
              <p>No applications found for this job posting.</p>
            </div>
          ) : (
            <Table
              headers={[
                "Athlete Profile",
                "Sport",
                "Total Followers",
                "Athlete Rating",
                "Applied",
              ]}
              textShowing="applications"
              subtitle={`Showing ${
                applicationsData?.applications.length || 0
              } applications`}
            >
              {applicationsData?.applications.map((application) => {
                const totalFollowers = Object.values(
                  application.athlete.followers
                ).reduce((sum, count) => sum + count, 0);

                return (
                  <tr key={application._id.toString()}>
                    <td className="p-3 text-sm">
                      <div
                        className="flex p-2 gap-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        onClick={() => {
                          showAthleteCard(application.athlete.userId);
                        }}
                      >
                        <img
                          className="w-10 h-10 object-cover rounded-full my-auto"
                          src={
                            application.athlete.profilePicture ||
                            "/images/Avatar.webp"
                          }
                          alt="Athlete Profile"
                        />
                        <div className="flex flex-col my-auto">
                          <h6 className="font-semibold underline leading-2">
                            {application.athlete.fullName || "N/A"}
                          </h6>
                          <span className="leading-none">
                            {application.athlete.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {application.athlete.sports &&
                      application.athlete.sports.length > 0
                        ? application.athlete.sports.join(", ")
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {formatIntlNumber(totalFollowers) || "N/A"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-2xl text-[#FFE661]"
                        />
                        <h6 className="">
                          {application.athlete.athleteRating || "N/A"}
                        </h6>
                      </div>
                    </td>
                    <td className="p-3">
                      {dayjs(application.appliedAt).fromNow()}
                    </td>
                  </tr>
                );
              })}
            </Table>
          )}
        </div>
        <div className="flex justify-center mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={applicationsData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default JobWithApplications;
