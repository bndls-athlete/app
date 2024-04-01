import Card from "../../../../components/Card";
import axios from "axios";
import { getMyPlanInfo } from "@/helpers/stripeAthleteManager";
import { useRouter } from "next/navigation";
import { useAthleteData } from "@/hooks/useAthleteData"; // Assuming you have a custom hook to fetch athlete data
import useUserType from "@/hooks/useUserType";

const MyPlan = () => {
  const { type } = useUserType();
  const { athlete } = useAthleteData();
  const router = useRouter();

  const handleManageBilling = async () => {
    try {
      const response = await axios.get("/api/stripe/athlete/manage-billing");
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("Customer portal URL not received");
        alert(
          "There was an issue accessing the billing management portal. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred while trying to manage billing:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleGetStarted = () => {
    router.push(`/${type}/plan/?menu=upgrade-options`);
  };

  const { planInfo, buttonText, action } = getMyPlanInfo({
    athlete,
    handleManageBilling,
    handleRenew: handleManageBilling, // Use the same function for renewing and managing billing
    handleReactivate: handleManageBilling, // Adjust this if you have a specific reactivation process
    handleGetStarted,
  });

  return (
    <>
      <div className="my-3">
        <Card className="px-0 pt-0 pb-0">
          <Card.Body className="my-0 border-b py-6 px-6">
            <div className="flex justify-between gap-3">
              <div>
                <div className="flex gap-2 mb-2">
                  <h6 className="font-semibold my-auto">Current Plan</h6>
                </div>
                <span className="text-sm">{planInfo}</span>
              </div>
              <h1 className="my-auto text-4xl font-semibold">
                {buttonText === "Get Started" ? "Free" : "Paid"}
              </h1>{" "}
              {/* Adjust this to display the correct price */}
            </div>
          </Card.Body>
          <Card.Footer className="px-6 py-3">
            <div className="flex justify-end">
              {buttonText && (
                <div className="flex gap-2 text-primary cursor-pointer hover:underline font-[600] my-auto">
                  <p onClick={action || (() => {})}>{buttonText}</p>
                  <div className="mt-2">
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.833252 9.16634L9.16659 0.833008M9.16659 0.833008H0.833252M9.16659 0.833008V9.16634"
                        stroke="#C6B624"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

export default MyPlan;
