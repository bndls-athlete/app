"use client";

import React from "react";
import Card from "@/app/components/Card";
import Branding from "@/app//components/Branding";

function HelpCenter() {
  return (
    <div className="max-w-4xl mx-auto my-8">
      <Branding /> {/* Use the Branding component */}
      <h1 className="text-3xl font-semibold text-center mb-6">Help Center</h1>
      <p className="text-center">To be updated...</p>
      {/* <Card className="mb-4">
        <Card.Header className="text-xl font-semibold">Contact Us</Card.Header>
        <Card.Body>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> support@example.com
            </p>
            <p>
              <strong>Phone:</strong> +1 234 567 8900
            </p>
            <p>
              <strong>Address:</strong> 123 Example Street, City, Country
            </p>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header className="text-xl font-semibold">FAQ</Card.Header>
        <Card.Body>
          <div className="space-y-2">
            <p>
              <strong>Q:</strong> How can I reset my password?
            </p>
            <p>
              <strong>A:</strong> You can reset your password by clicking the
              "Forgot Password" link on the sign-in page.
            </p>
            <p>
              <strong>Q:</strong> How can I update my profile information?
            </p>
            <p>
              <strong>A:</strong> You can update your profile information by
              navigating to the "Profile" section in your account settings.
            </p>
          </div>
        </Card.Body>
      </Card> */}
    </div>
  );
}

export default HelpCenter;
