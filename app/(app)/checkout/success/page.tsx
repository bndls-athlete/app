import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/Button";
import useUserType from "@/hooks/useUserType";

export default function SuccessPage() {
  const { type } = useUserType();
  return (
    <div className="flex flex-col items-center justify-center h-full bg-base-200 p-4">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="text-6xl text-green-500 mb-4 w-10 h-10"
      />
      <h1 className="text-4xl font-bold text-center mb-6">
        Checkout Successful!
      </h1>
      <p className="text-lg text-center mb-6">
        Thank you for your purchase. You can now access your subscription from
        your dashboard.
      </p>
      <Link href={`/${type}`}>
        <Button className="btn btn-primary">Go to Homepage</Button>
      </Link>
    </div>
  );
}
