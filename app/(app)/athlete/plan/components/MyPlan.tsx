import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "../../../../components/Card";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import axios from "axios";

const MyPlan = () => {
  const pathname = usePathname();
  const type = getTypeFromPathname(pathname);

  const handleManageBilling = async () => {
    try {
      // Call your server endpoint that creates the Customer Portal session
      const response = await axios.get("/api/stripe/manage-billing");
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

  return (
    <>
      <div className="my-3">
        <Card className="px-0 pt-0 pb-0">
          <Card.Body className="my-0 border-b py-6 px-6">
            <div className="flex justify-between gap-3">
              <div>
                <div className="flex gap-2 mb-2">
                  <h6 className="font-semibold my-auto">Current Plan</h6>
                  {/* <div className="border-2 rounded-lg py-1 text-sm px-1 text-subtitle font-semibold">
                    Monthly
                  </div> */}
                </div>
                <span className="text-sm">
                  {/* You're on a 3 day Free Trial. Add your billing details now to
                  start your subscription. */}
                  You currently do not have an active subscription. Please add
                  your billing details to initiate your subscription.
                </span>
              </div>
              <h1 className="my-auto text-4xl font-semibold">Free</h1>
            </div>
          </Card.Body>
          <Card.Footer className="px-6 py-3">
            <div className="flex justify-end">
              <div className="flex gap-2 text-primary cursor-pointer hover:underline font-[600] my-auto">
                <p onClick={handleManageBilling}>
                  {/* <Link href={`/${type}/plan/?menu=upgrade-options`}> */}
                  Manage Plan
                </p>
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
            </div>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

export default MyPlan;
