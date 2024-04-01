import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import getStripe from "@/lib/getStripe";
import axios from "axios";
import { Athlete } from "@/schemas/athleteSchema";
import { getAthleteSubscriptionButtonData } from "@/helpers/stripeAthleteManager";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  faCheck,
  faCircleNotch,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/app/components/Modal";

interface UpgradeOptionsCardProps {
  priceId: string;
  withPopular?: boolean;
  price?: string;
  features?: string[];
  tier?: string;
  intensity?: string;
  category?: string;
  withTeam?: boolean;
  athlete: Athlete | undefined;
}

const UpgradeOptionsCard = ({
  priceId,
  withPopular = false,
  price = "",
  features = [],
  tier = "",
  intensity = "",
  category = "",
  withTeam = false,
  athlete,
}: UpgradeOptionsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [netPriceDifference, setNetPriceDifference] = useState(0);

  // Prepares the switch but does not execute it; just opens the modal
  const handleSwitch = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/stripe/athlete/net-difference", {
        newPriceId: priceId,
      });
      setNetPriceDifference(data.netPriceDifference);
      setIsModalOpen(true); // Open the modal to confirm the change
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Actually performs the subscription plan change
  const executeSwitch = async () => {
    setIsLoading(true);
    setIsModalOpen(false); // Close the modal first
    try {
      await axios.post("/api/stripe/athlete/switch-plan", {
        newPriceId: priceId,
      });
      alert("Payment attempted. Your plan is being updated.");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const proceedWithCheckout = async (priceId: string) => {
    setIsLoading(true);
    try {
      const stripe = await getStripe();
      if (!stripe) {
        console.error("Stripe.js hasn't loaded yet.");
        return;
      }

      const { data: sessionData } = await axios.post(
        "/api/stripe/athlete/checkout-session",
        {
          priceId,
        }
      );

      if (sessionData.session && sessionData.session.id) {
        await stripe.redirectToCheckout({
          sessionId: sessionData.session.id,
        });
      } else {
        console.error("Failed to create a checkout session.");
        alert(
          "Sorry, there was a problem initializing your payment. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { text: buttonText, action: buttonAction } =
    getAthleteSubscriptionButtonData({
      athlete: athlete,
      planPriceId: priceId,
      handleSwitch,
      handleManageBilling,
      proceedWithCheckout,
    });

  const isLocked = buttonText === "Locked";
  const isCurrentPlan = buttonText === "Current Plan";

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={executeSwitch}
        title="Confirm Subscription Change"
      >
        <p>
          The net price difference to pay is ${netPriceDifference.toFixed(2)}.
          Do you want to proceed with the change?
        </p>
      </Modal>
      <Card className={`pt-2 shadow px-0 pb-0 ${isLocked ? "opacity-50" : ""}`}>
        <Card.Body className="pt-3 px-6 border-b pb-3">
          <div className="mb-4 flex justify-between ">
            <span className="font-semibold text-sm my-auto py-1">{tier}</span>
            {withPopular && (
              <span className="border bg-primary/[0.05] text-primary border-primary text-sm px-3 rounded-full py-1 font-semibold">
                Popular
              </span>
            )}
          </div>
          <div className="flex gap-2 mb-2 mt-6">
            <h3 className="text-4xl font-semibold">{price}</h3>
            <span className="mt-auto text-subtitle">{intensity}</span>
          </div>
          <div className="my-3">
            <span className="text-subtitle text-sm">{category}</span>
          </div>
          <div className="my-3">
            {withTeam && (
              <span className="text-subtitle text-sm">Pricing is per team</span>
            )}
          </div>
          <div className="my-2">
            <Button
              className={`py-2 text-sm font-semibold w-full ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isCurrentPlan
                  ? "bg-white text-primary border border-primary"
                  : ""
              }`}
              onClick={isLocked ? undefined : buttonAction}
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isLocked ? (
                <>
                  <FontAwesomeIcon icon={faLock} className="mr-2" /> Locked
                </>
              ) : isCurrentPlan ? (
                <>
                  <FontAwesomeIcon icon={faCheck} className="mr-2" /> Current
                  Plan
                </>
              ) : (
                buttonText
              )}
            </Button>
          </div>
        </Card.Body>
        <div className="px-6 py-6">
          <div className="my-2">
            <h6 className="font-semibold text-sm">FEATURES</h6>
          </div>
          <ul className="text-sm">
            {features.map((row, index) => (
              <li key={index} className="flex gap-2 mb-2">
                <FontAwesomeIcon
                  icon={faCheckCircle as IconProp}
                  className="text-primary text-lg w-5 h-5"
                />
                <span className="my-auto">{row}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </>
  );
};

export default UpgradeOptionsCard;
