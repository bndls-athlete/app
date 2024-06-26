"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClose,
  faExclamationCircle,
  faLocationDot,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { JobPostingWithCompanyInfo } from "@/schemas/jobPostingSchema";
import Card from "@/app/components/Card";
import { formatTier } from "@/helpers/stripeAthleteManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/Button";
import { useAthleteData } from "@/hooks/useAthleteData";
import Link from "next/link";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getTierManager } from "@/helpers/tierManagerUtils";
dayjs.extend(relativeTime);

interface JobModalProps {
  jobData: JobPostingWithCompanyInfo | null;
  onClose: () => void;
  onJobUpdate: (updatedJob: JobPostingWithCompanyInfo) => void;
}

const JobModal: React.FC<JobModalProps> = ({
  jobData,
  onClose,
  onJobUpdate,
}) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const postedTime = jobData ? dayjs().to(dayjs(jobData.createdAt)) : "";

  const { athlete } = useAthleteData();
  const [showAlreadySubmitted, setShowAlreadySubmitted] = useState(false);

  const applyToJobMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/application", {
        jobPostingId: jobData?._id,
      });
      return data;
    },
    onSettled: () => {
      queryClient.setQueryData(
        ["jobPostings", searchParams.toString()],
        (oldData: any) => {
          if (oldData && jobData) {
            const updatedJobPostings = oldData.jobPostings.map(
              (job: JobPostingWithCompanyInfo) =>
                job._id === jobData._id ? { ...job, isApplied: true } : job
            );
            onJobUpdate({ ...jobData, isApplied: true });
            return { ...oldData, jobPostings: updatedJobPostings };
          }
          return oldData;
        }
      );
    },
  });

  const handleApplyToJob = () => {
    applyToJobMutation.mutate();
  };

  const handleAlreadySubmitted = () => {
    setShowAlreadySubmitted(true);
    setTimeout(() => {
      setShowAlreadySubmitted(false);
    }, 1000);
  };

  const manager = getTierManager(athlete?.registrationType);
  const hasAccess = jobData?.athleteTierTarget.some((tier) =>
    manager.checkAthleteAccess(athlete!, tier)
  );

  const getUpgradeTier = () => {
    // Find the lowest tier required for the job posting that the athlete doesn't have access to
    const requiredTier = jobData?.athleteTierTarget
      .filter((tier) => !manager.checkAthleteAccess(athlete!, tier))
      .sort((a, b) => parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]))[0];

    // If a required tier is found, format it for display
    return requiredTier ? formatTier(requiredTier) : null;
  };

  const upgradeTier = getUpgradeTier();

  return (
    <>
      {jobData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-6 md:p-12 overflow-y-auto">
          <div className="bg-white transition duration-300 ease-in-out my-auto lg:rounded-lg px-8 py-12 md:w-[75%] w-full relative shadow-lg">
            <div
              className="absolute right-4 top-4 cursor-pointer"
              onClick={onClose}
            >
              <FontAwesomeIcon
                icon={faClose}
                className="w-5 h-5 text-gray-600"
              />
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex flex-col lg:flex-row justify-between items-start">
                <img
                  src={jobData.brand.profilePicture || "/images/Avatar.webp"}
                  alt=""
                  className="w-24 h-24 rounded-full mr-4 mb-4 lg:mb-0"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold">{jobData.title}</h3>
                  <p className="text-xl text-gray-500 mt-1">
                    {jobData.brand?.companyName}
                  </p>
                  <p className="text-gray-500 mt-1">
                    Posted {postedTime} | {jobData.jobType}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-primary text-2xl font-semibold">
                    ${jobData.feeCompensation}
                  </span>
                  <span className="text-gray-500">Fee Compensation</span>
                </div>
              </div>

              <div className="flex items-center">
                <FontAwesomeIcon
                  className="text-primary mr-2 w-5 h-5"
                  icon={faLocationDot}
                />
                <span>
                  {jobData.city}, {jobData.state}
                </span>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <Card className="px-0 py-0 mb-4">
                  <Card.Header className="border-b px-4 py-2 text-sm">
                    About {jobData.brand?.companyName}
                  </Card.Header>
                  <Card.Body className="px-4 py-2 text-sm text-subtitle pt-0">
                    {jobData.brand?.bio}
                  </Card.Body>
                </Card>

                <Card className="px-0 py-0 mb-4">
                  <Card.Header className="border-b px-4 py-2 text-sm">
                    Opportunity Description
                  </Card.Header>
                  <Card.Body className="px-4 py-2 text-sm text-subtitle pt-0">
                    {jobData.opportunityDescription}
                  </Card.Body>
                </Card>

                <Card className="px-0 py-0 mb-4">
                  <Card.Header className="border-b px-4 py-2 text-sm">
                    Deliverables
                  </Card.Header>
                  <Card.Body className="px-4 py-2 text-sm text-subtitle pt-0">
                    {jobData.deliverables && jobData.deliverables.length > 0 ? (
                      <div className="space-y-2">
                        {jobData.deliverables.map((deliverable, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2">
                            <div className="col-span-1 font-semibold">
                              {deliverable.title}:
                            </div>
                            <div className="col-span-2">
                              {deliverable.description} ({deliverable.duration})
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center">N/A</div>
                    )}
                  </Card.Body>
                </Card>

                <div>
                  <div className="font-semibold">Skills Required:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobData.skillsRequired.map((skill, index) => (
                      <span key={index} className="badge badge-primary p-4">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">
                    Additional Preferred Skills:
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobData.additionalPreferredSkills &&
                    jobData.additionalPreferredSkills.length > 0 ? (
                      jobData.additionalPreferredSkills.map((skill, index) => (
                        <span key={index} className="badge badge-secondary p-4">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="badge badge-secondary p-4">N/A</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Number of Athletes:</div>
                  <div>{jobData.numberOfAthletes || "N/A"}</div>
                </div>

                <div>
                  <div className="font-semibold">Athlete Tier Target:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobData.athleteTierTarget?.map((tier, index) => (
                      <span key={index} className="badge badge-secondary p-4">
                        {formatTier(tier)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                {!jobData.isApplied ? (
                  hasAccess ? (
                    <Button
                      className="btn btn-primary"
                      onClick={handleApplyToJob}
                      disabled={applyToJobMutation.isPending}
                    >
                      {applyToJobMutation.isPending
                        ? "Applying..."
                        : "Apply to Opportunity"}
                    </Button>
                  ) : (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faLock} className="mr-2" />
                      <Link
                        href="/athlete/plan?menu=upgrade-options"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Upgrade to {upgradeTier} to access this opportunity
                      </Link>
                    </div>
                  )
                ) : (
                  <Button
                    className="btn text-white bg-green-600 hover:bg-green-600 opacity-75 border-none flex items-center justify-center"
                    onClick={handleAlreadySubmitted}
                  >
                    {showAlreadySubmitted ? (
                      <>
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-2"
                        />
                        Already Submitted
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="mr-2"
                        />
                        Application Submitted
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobModal;
