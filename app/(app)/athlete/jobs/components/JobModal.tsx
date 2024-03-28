"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { JobData } from "@/schemas/jobSchema";
import Card from "@/app/components/Card";

interface JobModalProps {
  jobData: JobData | null;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ jobData, onClose }) => {
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
                  src="/images/thumbnail_job.png"
                  alt=""
                  className="w-24 h-24 rounded-full mr-4 mb-4 lg:mb-0"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold">{jobData.title}</h3>
                  <p className=" text-gray-500 mt-1">
                    Posted {jobData.postedDaysAgo} days ago | {jobData.jobType}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-primary text-2xl font-semibold">
                    ${jobData.feeCompensation}
                  </span>
                  <span className=" text-gray-500">Fee Compensation</span>
                </div>
              </div>

              <div className="flex items-center">
                <FontAwesomeIcon
                  className="text-primary mr-2 w-5 h-5"
                  icon={faLocationDot}
                />
                <span className="">{jobData.location}</span>
              </div>

              <hr className="my-6" />

              <div className="space-y-4">
                <Card className="px-0 py-0 mb-4">
                  <Card.Header className="border-b px-4 py-2 text-sm">
                    About the Company
                  </Card.Header>
                  <Card.Body className="px-4 py-2 text-sm text-subtitle pt-0">
                    {jobData.aboutCompany}
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
                    {jobData.additionalPreferredSkills.map((skill, index) => (
                      <span key={index} className="badge badge-secondary p-4">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn btn-primary">
                  Apply to Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobModal;
