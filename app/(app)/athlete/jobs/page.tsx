"use client";

import { useEffect, useState } from "react";
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
import { JobData } from "@/schemas/jobSchema";

const jobList: JobData[] = [
  {
    title: "Brand Ambassador",
    postedDaysAgo: 3,
    location: "Miami, FL",
    feeCompensation: 2000,
    aboutCompany: "SportsGear is a leading sports apparel and equipment brand.",
    opportunityDescription:
      "We are seeking a professional athlete to represent our brand as an ambassador and promote our products through various channels.",
    deliverables: [
      {
        title: "Social Media Promotion",
        duration: "Throughout the contract period",
        description:
          "Regularly post about SportsGear products on social media platforms, highlighting their features and benefits.",
      },
      {
        title: "Event Appearances",
        duration: "At least 2 events per month",
        description:
          "Attend sports events and promotional activities as a representative of SportsGear, engaging with fans and customers.",
      },
      {
        title: "Product Feedback",
        duration: "Monthly",
        description:
          "Provide feedback on SportsGear products based on personal use and athlete insights to help improve product quality and design.",
      },
    ],
    nonExclusiveDealDetails:
      "Exclusive contract for sports apparel, non-exclusive for other product categories",
    totalCompensation: "$2000 + commission on sales generated",
    skillsRequired: ["Social Media Savvy", "Public Speaking", "Networking"],
    additionalPreferredSkills: ["Photography", "Content Creation"],
    numberOfAthletes: "1",
    jobType: "Contract",
  },
];

const Opportunities = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Assuming there are 10 pages in total

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  useEffect(() => {
    // Fetch jobs data and set the state
    setJobs(jobList);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Perform additional actions when the page changes, such as fetching new data
  };

  const handleJobSelect = (job: JobData) => {
    setSelectedJob(job);
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
          {jobs.map((job, index) => (
            <JobCard
              key={index}
              job={job}
              onSelectJob={() => handleJobSelect(job)}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {selectedJob && (
        <JobModal jobData={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
};

export default Opportunities;
