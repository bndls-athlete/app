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
import { usePathname } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import JobModal from "./components/JobModal";

export enum JobType {
  FullTime = "Full-time",
  PartTime = "Part-time",
  Contract = "Contract",
  Internship = "Internship",
  Temporary = "Temporary",
}

export type Deliverable = {
  title: string;
  duration: string;
  description: string;
};

export type JobData = {
  title: string;
  postedDaysAgo: number;
  location: string;
  feeCompensation: number;
  aboutCompany: string;
  opportunityDescription: string;
  deliverables: Deliverable[];
  nonExclusiveDealDetails: string;
  totalCompensation: string;
  skillsRequired: string[];
  additionalPreferredSkills: string[];
  numberOfAthletes: string;
  jobType: JobType;
};

const jobList: JobData[] = [
  {
    title: "Mental Performance Advocate",
    postedDaysAgo: 5,
    location: "New York, US",
    feeCompensation: 500,
    aboutCompany: "A brief description about the company.",
    opportunityDescription: "A brief description of the opportunity.",
    deliverables: [
      {
        title: "First Deliverable",
        duration: "6 months after athlete accepts the agreement",
        description: "Description of the first deliverable.",
      },
      {
        title: "Second Deliverable",
        duration: "6 months after athlete accepts the agreement",
        description: "Description of the second deliverable.",
      },
    ],
    nonExclusiveDealDetails: "Seeking 5 individuals",
    totalCompensation: "$500 + Free product(s)",
    skillsRequired: [
      "Guest Appearances",
      "Brand's Annual Event",
      "Facebook Post",
    ],
    additionalPreferredSkills: [
      "Purpose Driven",
      "Seeking Knowledge",
      "Looking for an Edge",
    ],
    numberOfAthletes: "Multiple Athletes",
    jobType: JobType.FullTime,
  },
];

// const Opportunities = () => {
//   const pathname = usePathname();
//   const type = getTypeFromPathname(pathname);

//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = 10; // Assuming there are 10 pages in total

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     // Perform additional actions when the page changes, such as fetching new data
//   };

//   return (
//     <>
//       <div className="text-dark">
//         <Breadcrumb icon={faLightbulb} menu={"Opportunities"} />
//         <div className="my-6">
//           <h1 className="text-3xl font-semibold mb-2">{"Opportunities"}</h1>
//           <span className="text-subtitle">
//             Find brand opportunities right for you.
//           </span>
//         </div>
//         <div className="bg-primary p-4 rounded-lg mb-6">
//           <div className="flex flex-wrap gap-2">
//             <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
//               <FontAwesomeIcon
//                 icon={faSearch}
//                 className="text-primary mx-2 w-5 h-5"
//               />
//               <input
//                 type="text"
//                 className="flex-grow bg-transparent focus:outline-none"
//                 placeholder="Job Title, Keywords"
//               />
//             </div>
//             <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
//               <FontAwesomeIcon
//                 icon={faLocationDot}
//                 className="text-primary mx-2 w-5 h-5"
//               />
//               <input
//                 type="text"
//                 className="flex-grow bg-transparent focus:outline-none"
//                 placeholder="Location"
//               />
//             </div>
//             <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
//               <FontAwesomeIcon
//                 icon={faBriefcase}
//                 className="text-primary mx-2 w-5 h-5"
//               />
//               <input
//                 type="text"
//                 className="flex-grow bg-transparent focus:outline-none"
//                 placeholder="Job Type"
//               />
//             </div>
//             <div className="flex items-center bg-white p-2 rounded-lg flex-grow min-w-[240px]">
//               <FontAwesomeIcon
//                 icon={faDollar}
//                 className="text-primary mx-2 w-5 h-5"
//               />
//               <input
//                 type="text"
//                 className="flex-grow bg-transparent focus:outline-none"
//                 placeholder="Price"
//               />
//             </div>
//             <Button className="lg:w-auto w-full bg-white text-primary border border-primary font-semibold">
//               Search
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {Array.from({ length: 18 }).map((_, index) => (
//             <JobCard key={index} />
//           ))}
//         </div>
//         <div className="flex justify-center mt-8">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

const Opportunities = () => {
  const pathname = usePathname();
  const type = getTypeFromPathname(pathname);

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
