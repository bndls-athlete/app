"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPlayer from "react-player";
import {
  faArrowLeft,
  faCheckCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import Button from "./Button";
import { useAthleteCard } from "@/context/AthleteCardProvider";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAthleteData } from "@/hooks/useAthleteData";
import { sportsEnum } from "@/schemas/athleteSchema";
import {
  faBasketballBall,
  faSoccerBall,
  faBaseballBall,
  faFootball,
} from "@fortawesome/free-solid-svg-icons";
import sum from "lodash/sum";
import { formatIntlNumber } from "@/helpers/formatIntlNumber";
import useUserType from "@/hooks/useUserType";
import { useToggleBookmark } from "@/hooks/useToggleBookmark";
import { EntityType } from "@/types/entityTypes";
import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";

export const AthleteCard = () => {
  const { isAthleteCardVisible, toggleAthleteCardVisible } = useAthleteCard();
  const { athlete, isLoading, error } = useAthleteData();
  const { type } = useUserType();

  const { isBookmarked, toggleBookmark, isBookmarkLoading } = useToggleBookmark(
    type === EntityType.Company ? athlete?._id : undefined
  );

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case sportsEnum.baseball:
        return (
          <FontAwesomeIcon icon={faBaseballBall} className="w-5 h-5 mr-2" />
        );
      case sportsEnum.basketball:
        return (
          <FontAwesomeIcon icon={faBasketballBall} className="w-5 h-5 mr-2" />
        );
      case sportsEnum.soccer:
        return <FontAwesomeIcon icon={faSoccerBall} className="w-5 h-5 mr-2" />;
      case sportsEnum.football:
        return <FontAwesomeIcon icon={faFootball} className="w-5 h-5 mr-2" />;
      default:
        return null;
    }
  };

  const totalFollowers = sum([
    athlete?.followers?.instagram || 0,
    athlete?.followers?.tiktok || 0,
    athlete?.followers?.youtube || 0,
    athlete?.followers?.twitter || 0,
  ]);

  return (
    <div
      className={`transition-all duration-150 ease-in py-3 fixed top-0 shadow border-l-2 h-full lg:mt-0 mt-16 w-[360px] bg-white overflow-y-auto hide-scroll ${
        isAthleteCardVisible ? "right-0" : "right-[-360px]"
      }`}
    >
      <div className="px-4 py-2">
        <Button className="w-auto px-6 py-2" onClick={toggleAthleteCardVisible}>
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
        </Button>
      </div>
      <div className="px-6 py-4">
        <h5 className="font-bold text-xl mb-2">
          {athlete?.registrationType === AthleteRegistrationType.Team
            ? "Team Card"
            : "Athlete Card"}
        </h5>
        <p className="text-sm mb-4">
          Update your{" "}
          {athlete?.registrationType === AthleteRegistrationType.Team
            ? "team"
            : "profile"}{" "}
          in{" "}
          <Link href="/athlete/settings" className="underline">
            settings
          </Link>{" "}
          to enhance your{" "}
          {athlete?.registrationType === AthleteRegistrationType.Team
            ? "team"
            : "athlete"}{" "}
          card and unlock better job opportunities.
        </p>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" size={16} />
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <img
                className="w-20 h-20 object-cover shadow border-4 border-white rounded-full mr-4"
                src={athlete?.profilePicture || "/images/Avatar.webp"}
                alt={`${
                  athlete?.registrationType === AthleteRegistrationType.Team
                    ? "Team"
                    : "Athlete"
                } Profile`}
              />
              <div>
                <h6 className="font-bold text-2xl">{athlete?.fullName}</h6>
                <div className="mt-2 space-y-2">
                  {athlete?.athleteTier && (
                    <div
                      className={`flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition-all ${
                        athlete.athleteTier === "1"
                          ? "bg-yellow-400 text-white"
                          : athlete.athleteTier === "2"
                          ? "bg-gray-400 text-white"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      <span>Tier {athlete.athleteTier} Athlete</span>
                      <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                    </div>
                  )}
                  <div
                    className={`flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm transition-all ${
                      athlete?.registrationType === AthleteRegistrationType.Team
                        ? "bg-purple-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    <span>
                      {athlete?.registrationType ===
                      AthleteRegistrationType.Team
                        ? "Team"
                        : "Individual"}{" "}
                      Account
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {type === EntityType.Company && athlete && (
              <div className="flex items-center justify-start mb-4">
                <button
                  className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    isBookmarked
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => toggleBookmark(athlete._id)}
                >
                  <FontAwesomeIcon
                    icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
                    className="mr-2"
                  />
                  {isBookmarkLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : isBookmarked ? (
                    "Saved"
                  ) : athlete?.registrationType ===
                    AthleteRegistrationType.Team ? (
                    "Save Team"
                  ) : (
                    "Save Athlete"
                  )}
                </button>
              </div>
            )}

            {athlete?.bio && (
              <div className="mb-6">
                <h6 className="font-bold text-xl mb-2">
                  {athlete?.registrationType === AthleteRegistrationType.Team
                    ? "Team Bio"
                    : "Bio"}
                </h6>
                <p className="text-subtitle">{athlete.bio}</p>
              </div>
            )}

            {athlete?.address && (
              <div className="flex items-center mb-6">
                <img
                  src="/svg/ion_location.svg"
                  alt=""
                  className="w-5 h-5 mr-2"
                />
                <span className="text-subtitle font-semibold">
                  {athlete.address.city}, {athlete.address.state},{" "}
                  {athlete.address.countryRegion}
                </span>
              </div>
            )}

            <div className="flex justify-start space-x-6 mb-8">
              {athlete?.email && (
                <Link href={`mailto:${athlete.email}`} target="_blank">
                  <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full p-3 text-white">
                    <img src="/svg/email.svg" alt="" className="w-5 h-5" />
                  </div>
                </Link>
              )}

              {athlete?.socialProfiles?.instagram && (
                <Link href={athlete.socialProfiles.instagram} target="_blank">
                  <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full p-3 text-white">
                    <img src="/svg/instagram.svg" alt="" className="w-5 h-5" />
                  </div>
                </Link>
              )}

              {athlete?.socialProfiles?.tiktok && (
                <Link href={athlete.socialProfiles.tiktok} target="_blank">
                  <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full p-3 text-white">
                    <img src="/svg/tiktok.svg" alt="" className="w-5 h-5" />
                  </div>
                </Link>
              )}

              {athlete?.socialProfiles?.youtube && (
                <Link href={athlete.socialProfiles.youtube} target="_blank">
                  <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full p-3 text-white">
                    <img src="/svg/youtube.svg" alt="" className="w-5 h-5" />
                  </div>
                </Link>
              )}

              {athlete?.socialProfiles?.twitter && (
                <Link href={athlete.socialProfiles.twitter} target="_blank">
                  <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full p-3 text-white">
                    <img src="/svg/twitter.svg" alt="" className="w-5 h-5" />
                  </div>
                </Link>
              )}
            </div>

            <div className="bg-primary text-white rounded-lg p-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {totalFollowers > 0 && (
                  <div className="flex flex-col">
                    <span className="flex items-center text-base font-semibold">
                      Total Followers
                    </span>
                    <h3 className="text-lg font-bold">
                      {formatIntlNumber(totalFollowers)}
                    </h3>
                  </div>
                )}
                {athlete?.athleteRating && athlete.athleteRating > 0 && (
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">
                      {athlete?.registrationType ===
                      AthleteRegistrationType.Team
                        ? "Team Rating"
                        : "Athlete Rating"}
                    </span>
                    <h3 className="text-lg font-bold flex items-center">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-200 mr-1"
                      />
                      {athlete.athleteRating}
                    </h3>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h6 className="font-bold text-xl mb-4">
                {athlete?.registrationType === AthleteRegistrationType.Team
                  ? "Team Information"
                  : "Athlete Information"}
              </h6>

              {athlete?.sport && (
                <div className="mb-6">
                  <h6 className="font-semibold text-lg mb-2">Sport</h6>
                  <div className="flex items-center">
                    {getSportIcon(athlete.sport)}
                    <span className="text-subtitle font-semibold text-lg">
                      {athlete.sport}
                    </span>
                  </div>
                </div>
              )}

              {athlete?.sport && (
                <div className="mb-6">
                  <h6 className="font-semibold text-lg mb-2">
                    {athlete?.registrationType === AthleteRegistrationType.Team
                      ? "Team Stats"
                      : "Sport Stats"}
                  </h6>
                  {athlete?.registrationType ===
                    AthleteRegistrationType.Team && (
                    <>
                      <p className="mb-1">
                        <strong>Wins-Loss Record:</strong>{" "}
                        {athlete?.winsLossRecord
                          ? `${athlete.winsLossRecord.wins} - ${athlete.winsLossRecord.losses}`
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Tournaments Played In:</strong>{" "}
                        {athlete?.tournamentsPlayedIn || "N/A"}
                      </p>
                    </>
                  )}

                  {athlete?.registrationType ===
                    AthleteRegistrationType.Individual && (
                    <>
                      {athlete?.sport === sportsEnum.baseball && (
                        <>
                          <p className="mb-1">
                            <strong>ERA:</strong>{" "}
                            {athlete?.baseballStats?.era || "N/A"}
                          </p>
                          <p className="mb-1">
                            <strong>Wins:</strong>{" "}
                            {athlete?.baseballStats?.wins || "N/A"}
                          </p>
                          <p className="mb-1">
                            <strong>Batting Average:</strong>{" "}
                            {athlete?.baseballStats?.battingAverage || "N/A"}
                          </p>
                          <p>
                            <strong>Hits:</strong>{" "}
                            {athlete?.baseballStats?.hits || "N/A"}
                          </p>
                        </>
                      )}

                      {athlete?.sport === sportsEnum.basketball && (
                        <>
                          <p className="mb-1">
                            <strong>Star Rating:</strong>{" "}
                            {athlete?.basketballStats?.starRating || "N/A"}
                          </p>
                          <p>
                            <strong>Position:</strong>{" "}
                            {athlete?.basketballStats?.position || "N/A"}
                          </p>
                        </>
                      )}

                      {athlete?.sport === sportsEnum.football && (
                        <>
                          <p className="mb-1">
                            <strong>Star Rating:</strong>{" "}
                            {athlete?.footballStats?.starRating || "N/A"}
                          </p>
                          <p>
                            <strong>Position:</strong>{" "}
                            {athlete?.footballStats?.position || "N/A"}
                          </p>
                        </>
                      )}

                      {athlete?.sport === sportsEnum.soccer && (
                        <>
                          <p className="mb-1">
                            <strong>Clean Sheets:</strong>
                            {""}
                            {athlete?.soccerStats?.cleanSheets || "N/A"}
                          </p>
                          <p className="mb-1">
                            <strong>Goals Scored:</strong>{" "}
                            {athlete?.soccerStats?.goalsScored || "N/A"}
                          </p>
                          <p>
                            <strong>Assists:</strong>{" "}
                            {athlete?.soccerStats?.assists || "N/A"}
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {athlete?.reel && (
                <div className="mb-6">
                  <h6 className="font-semibold text-lg mb-2">
                    {athlete?.registrationType === AthleteRegistrationType.Team
                      ? "Team Reel"
                      : "Athlete Reel"}
                  </h6>
                  <ReactPlayer width="100%" height="200px" url={athlete.reel} />
                </div>
              )}
              <div className="mb-6">
                <h6 className="font-semibold text-lg mb-2">
                  {athlete?.registrationType === AthleteRegistrationType.Team
                    ? "Team Info"
                    : "Personal Info"}
                </h6>
                <>
                  <p className="mb-1">
                    <strong>
                      {athlete?.registrationType ===
                      AthleteRegistrationType.Team
                        ? "Team Gender"
                        : "Gender"}
                      :
                    </strong>{" "}
                    {athlete?.gender || "N/A"}
                  </p>
                  {athlete?.registrationType !==
                    AthleteRegistrationType.Team && (
                    <>
                      <p className="mb-1">
                        <strong>DOB:</strong>{" "}
                        {athlete?.dateOfBirth
                          ? new Date(athlete.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </>
                  )}
                </>
              </div>

              <div className="mb-6">
                <h6 className="font-semibold text-lg mb-2">Education</h6>
                <p className="mb-1">
                  <strong>University/High School:</strong>{" "}
                  {athlete?.schoolOrUniversity || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>
                    {athlete?.registrationType === AthleteRegistrationType.Team
                      ? "Cumulative Graduation Date"
                      : "Graduation Date"}
                    :
                  </strong>{" "}
                  {athlete?.graduationDate
                    ? new Date(athlete.graduationDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>
                    {athlete?.registrationType === AthleteRegistrationType.Team
                      ? "Average Team GPA"
                      : "Current GPA"}
                    :
                  </strong>{" "}
                  {athlete?.currentAcademicGPA || "N/A"}
                </p>
              </div>

              <div className="mb-6">
                <h6 className="font-semibold text-lg mb-2">
                  Professional Skills
                </h6>
                {athlete?.professionalSkills &&
                athlete.professionalSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {athlete.professionalSkills.map((skill, index) => (
                      <span key={index} className="badge badge-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              <div className="mb-6">
                <h6 className="font-semibold text-lg mb-2">
                  Professional References
                </h6>
                {athlete?.professionalReferences &&
                athlete.professionalReferences.length > 0 ? (
                  <div className="space-y-2">
                    {athlete.professionalReferences.map((reference, index) => (
                      <div key={index} className="card bg-secondary p-4">
                        <p>{reference}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>N/A</p>
                )}
              </div>

              {athlete?.statsSourceURL && (
                <div className="mb-6">
                  <h6 className="font-semibold text-lg mb-2">
                    Stats Source URL
                  </h6>
                  <Link href={athlete.statsSourceURL} target="_blank">
                    {athlete.statsSourceURL}
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
