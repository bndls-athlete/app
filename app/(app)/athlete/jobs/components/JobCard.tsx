import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../../components/Button";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { JobPostingWithCompanyInfo } from "@/schemas/jobPostingSchema";

interface JobCardProps {
  job: JobPostingWithCompanyInfo;
  onSelectJob: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSelectJob }) => {
  // Truncate the job description to a specified length
  const truncateDescription = (description: string, maxLength: number) => {
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  return (
    <div className="bg-sidebar rounded-lg p-4 w-full min-w-md">
      <div className="bg-gray-400 w-full max-w-[80px] h-20 rounded mb-4"></div>
      <h6 className="font-semibold  mb-3">{job.title}</h6>
      <div className="flex gap-3 flex-wrap">
        <span className="bg-gray-300 px-3 rounded  py-1">{job.jobType}</span>
        {/* <span className="bg-gray-300 px-3 rounded  py-1">
          {job.postedDaysAgo} days ago
        </span> */}
        {/* Add more job details as needed */}
      </div>
      <p className=" py-2 text-gray-500">
        {truncateDescription(job.opportunityDescription!, 100)}
      </p>
      <div className="flex justify-between my-2">
        <span className="text-gray-500  my-auto">
          <FontAwesomeIcon
            icon={faLocationDot}
            className="text-primary  w-5 h-5"
          />{" "}
          {job.city}, {job.state}
        </span>
        <span className="font-semibold my-auto">${job.feeCompensation}</span>
      </div>
      <div className="flex gap-3">
        <Button className="" onClick={onSelectJob}>
          View Job
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
