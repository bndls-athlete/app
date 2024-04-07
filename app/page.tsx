import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-base-100 relative">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="lg:w-1/2">
            <img
              src="/hero.webp"
              className="w-full object-cover object-center rounded-lg shadow-2xl"
              alt="BNDLS Hero"
            />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-6xl font-bold text-primary mb-6">
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
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-base-200 to-transparent"></div>
      </div>
      <div className="bg-base-200 py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10 text-primary">
            Embrace the Power of BNDLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <FontAwesomeIcon icon={faUser} className="w-24 h-24" />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title text-2xl">Individual Athletes</h3>
                <p>
                  Showcase your skills, connect with brands, and seize exciting
                  opportunities to propel your career forward.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <FontAwesomeIcon icon={faUsers} className="w-24 h-24" />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title text-2xl">Athlete Teams</h3>
                <p>
                  Highlight your team's talent, connect with brands, and explore
                  new opportunities for growth and success.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <FontAwesomeIcon icon={faBullhorn} className="w-24 h-24" />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title text-2xl">Brands</h3>
                <p>
                  Discover talented athletes and teams, and partner with them to
                  promote your brand and reach a wider audience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">&copy; 2024 BNDLS. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
