import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "@/app/components/Button";

export default function CancelledPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-base-200 p-4">
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="text-6xl text-red-500 mb-4 w-10 h-10"
      />
      <h1 className="text-4xl font-bold text-center mb-6">
        Checkout Cancelled
      </h1>
      <p className="text-lg text-center mb-6">
        It looks like you've cancelled the checkout process. If you have any
        questions or encountered any issues, please contact support.
      </p>
      <Link href="/">
        <Button className="btn btn-primary">Return to Homepage</Button>
      </Link>
    </div>
  );
}
