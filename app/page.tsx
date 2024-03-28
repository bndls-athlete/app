import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col min-h-screen"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        <main className="flex-grow bg-white text-black">
          <div className="hero pt-32">
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
        </main>

        <footer className="footer p-10 bg-gray-100 text-black">
          <div className="container mx-auto flex justify-center items-center">
            <p>&copy; 2024 BNDLS. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
