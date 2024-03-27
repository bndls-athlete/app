"use client";

import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <p className="">Brand Dashboard</p>
        <p>{user?.emailAddresses[0].emailAddress}</p>
        <button
          className="btn btn-active btn-primary mt-4"
          onClick={() => {
            signOut();
          }}
        >
          logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
