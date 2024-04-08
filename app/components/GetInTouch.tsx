import React from "react";
import Button from "./Button";

function GetInTouch() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  return (
    <div className="bg-white my-6 mt-16">
      <div className="flex justify-center py-12">
        <div className="text-center">
          <h3 className="font-semibold text-2xl mb-2">Still have questions?</h3>
          <p className="text-subtitle mb-4">
            Can’t find the answer you’re looking for? Please drop a message to
            our friendly team.
          </p>
          <a href={`mailto:${supportEmail}`} className="inline-block">
            <Button className="text-sm py-2">Get in Touch</Button>
          </a>
          <p className="text-subtitle mt-4">
            Or drop a message to our support team at{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="text-primary underline"
            >
              {supportEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GetInTouch;
