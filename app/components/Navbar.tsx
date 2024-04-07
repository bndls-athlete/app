"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { truncate } from "@/helpers/truncate";
import { useClerk } from "@clerk/nextjs";

function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="navbar bg-base-100 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link
            href="/"
            className="btn btn-ghost normal-case text-xl text-primary"
          >
            BNDLS
          </Link>
        </div>
        <div className="flex-none">
          {isSignedIn ? (
            <>
              <span className="text-sm text-gray-600 mr-4">
                Welcome,{" "}
                {truncate(
                  user.firstName ||
                    user.username ||
                    user.emailAddresses[0].emailAddress
                )}
              </span>
              <button
                className="btn btn-sm btn-outline btn-accent"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/sign-in" className="btn btn-sm btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
