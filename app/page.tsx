import Image from "next/image";
import Link from "next/link";
import { User, Users, Briefcase } from "lucide-react";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen mt-16 bg-white text-black">
        <div className="hero bg-white pt-32">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">
                Connect with Athletes and Brands
              </h1>
              <p className="py-6">
                Join BNDLS to find opportunities, collaborate with teams, and
                showcase your talent to brands.
              </p>
              <Link href="/sign-up" className="btn btn-primary">
                Get Started
              </Link>
            </div>
            <div className="hidden lg:block lg:w-1/2">
              <img src="/Landing.webp" alt="Athletes and Brands" />
            </div>
          </div>
        </div>

        <section className="container mx-auto py-32 text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-white shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="card-body">
                <div className="card-title flex flex-col items-center">
                  <User size={50} className="mb-4" />
                  <h3 className="text-2xl font-bold">For Athletes</h3>
                </div>
                <p>
                  Build your profile, share your achievements, and get
                  discovered by brands looking for talent like yours.
                </p>
              </div>
            </div>

            <div className="card bg-white shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="card-body">
                <div className="card-title flex flex-col items-center">
                  <Users size={50} className="mb-4" />
                  <h3 className="text-2xl font-bold">For Teams</h3>
                </div>
                <p>
                  Connect with athletes, organize your team, and find
                  sponsorship opportunities to support your goals.
                </p>
              </div>
            </div>

            <div className="card bg-white shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="card-body">
                <div className="card-title flex flex-col items-center">
                  <Briefcase size={50} className="mb-4" />
                  <h3 className="text-2xl font-bold">For Brands</h3>
                </div>
                <p>
                  Create offerings, find the right athletes and teams to
                  represent your brand, and track the impact of your
                  collaborations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer p-10 bg-gray-100 text-black">
          <div className="container mx-auto flex justify-center items-center">
            <p>&copy; 2024 BNDLS. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
