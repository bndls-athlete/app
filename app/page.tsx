"use client";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { truncate } from "@/helpers/truncate";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-100 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center h-20">
          <Link
            href="/"
            className="btn btn-ghost normal-case text-xl text-primary"
          >
            BNDLS
          </Link>
          <div>
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
              <Link href="/sign-in" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      <div
        className="hero flex-grow"
        style={{
          backgroundImage: "url(/hero.webp)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="text-6xl font-bold mb-6">
              Unleash Your Potential with BNDLS
            </h1>
            <p className="text-xl mb-8">
              BNDLS is the ultimate platform for athletes, teams, and brands to
              connect, collaborate, and excel. Showcase your talent, discover
              new opportunities, and elevate your brand with BNDLS.
            </p>
            <Link href="/sign-up" className="btn btn-primary btn-lg">
              Join the Movement
            </Link>
          </div>
        </div>
      </div>
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <aside>
          <p>&copy; 2024 BNDLS. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
}
