"use client";

// import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from "react-player";
import { formatNumber } from "@/helpers/formatNumber";
import {
  faArrowLeft,
  // faBookmark,
  faCircleInfo,
  // faCloudDownload,
  // faHeart,
  // faInfoCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useAthleteCardVisibility } from "@/context/AthleteCardVisibilityProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { AthleteCard } from "@/schemas/athleteCardSchema";
import Link from "next/link";

const AthelteCard = () => {
  const { isAthleteCardVisible, toggleAthleteCardVisible } =
    useAthleteCardVisibility();

  const { data: athleteCard, isLoading } = useQuery<AthleteCard>({
    queryKey: ["athlete-card"],
    queryFn: async () => {
      const response = await axios.get("/api/athlete-card");
      return response.data.athleteCard;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" size={16} />
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-150 ease-in py-3 fixed top-0 shadow border-l-2 h-full lg:mt-0 mt-16 w-[360px] bg-white overflow-y-auto hide-scroll ${
        isAthleteCardVisible ? "right-0" : "right-[-360px]"
      }`}
    >
      <div className="inline-flex px-4 mb-4 py-2">
        <Button
          className="w-auto px-6  py-2"
          onClick={toggleAthleteCardVisible}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
        </Button>
      </div>
      <div className="flex px-4 justify-between">
        {/* <span className=" text-subtitle my-auto">
              Data From September 15, 2023
            </span> */}
        {/* <FontAwesomeIcon
              icon={faCloudDownload}
              className="text-primary bg-sidebar p-1 rounded"
            /> */}
      </div>
      {athleteCard?.fullName && (
        <div className="flex px-4 my-3 gap-2">
          <img
            className="w-12 h-12 shadow border-white rounded-full my-auto"
            src="/images/Avatar.webp"
            alt="Rounded avatar"
          />
          <div className="flex flex-col my-auto">
            <h6 className="font-semibold leading-2 ">{athleteCard.fullName}</h6>
          </div>
        </div>
      )}
      {athleteCard?.tier && (
        <div className="flex px-4 gap-2 mb-2">
          <img src="/svg/verifiedtick.svg" alt="" className="w-5 h-5" />
          <span className="text-subtitle font-semibold">
            {athleteCard.tier} Athlete
          </span>
        </div>
      )}

      {athleteCard?.location && (
        <div className="flex px-4 gap-2 mb-2">
          <img src="/svg/ion_location.svg" alt="" className="w-5 h-5" />
          <span className="text-subtitle font-semibold">
            {athleteCard.location}
          </span>
        </div>
      )}

      <div className="flex px-4 gap-2 my-4">
        {athleteCard?.email && (
          <Link href={`mailto:${athleteCard.email}`}>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img src="/svg/email.svg" alt="" className="w-5 h-5" />
            </div>
          </Link>
        )}

        {athleteCard?.socialProfiles?.instagram && (
          <Link href={athleteCard.socialProfiles.instagram}>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img src="/svg/instagram.svg" alt="" className="w-5 h-5" />
            </div>
          </Link>
        )}

        {athleteCard?.socialProfiles?.tiktok && (
          <Link href={athleteCard.socialProfiles.tiktok}>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img src="/svg/tiktok.svg" alt="" className="w-5 h-5" />
            </div>
          </Link>
        )}

        {athleteCard?.socialProfiles?.twitter && (
          <Link href={athleteCard.socialProfiles.twitter}>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img src="/svg/twitter.svg" alt="" className="w-5 h-5" />
            </div>
          </Link>
        )}
      </div>

      {(athleteCard?.followers ||
        athleteCard?.engagementRate ||
        athleteCard?.athleteRating) && (
        <div className="bg-primary px-4 py-3 text-white">
          <div className="grid grid-cols-3">
            {athleteCard?.followers && (
              <div className="flex flex-col gap-2">
                <span>
                  Followers <FontAwesomeIcon icon={faCircleInfo} />
                </span>
                <h3 className="text-3xl">
                  {formatNumber(athleteCard.followers)}
                </h3>
              </div>
            )}

            {athleteCard?.engagementRate && (
              <div className="flex flex-col gap-2">
                <span>ER%</span>
                <h3 className="text-3xl">
                  {formatNumber(athleteCard.engagementRate)}
                </h3>
              </div>
            )}

            {athleteCard?.athleteRating && (
              <div className="flex flex-col gap-2">
                <span>Athlete Rating</span>
                <h3 className="text-3xl">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-200" />{" "}
                  {athleteCard.athleteRating}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-sidebar px-4 py-4">
        <h6 className="font-semibold mb-2">Athlete Information</h6>
        {athleteCard?.reel && (
          <div className="w-full">
            <ReactPlayer
              width={"330px"}
              height="200px"
              url={athleteCard.reel}
            />
          </div>
        )}
      </div>

      {/* <div className="px-4 my-4">
            <div className="bg-primary/[0.4] rounded py-6 flex justify-center flex-col text-center mb-2">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-primary text-2xl"
              />
              <h3 className="font-semibold text-2xl">69.5K</h3>
              <span className=" text-subtitle">
                Career Stats <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <div className="bg-primary/[0.4] rounded py-6 flex justify-center flex-col text-center mb-2">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-primary text-2xl"
              />
              <h3 className="font-semibold text-2xl">69.5K</h3>
              <span className=" text-subtitle">
                Academic Performance <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <div className="bg-primary/[0.4] rounded py-6 flex justify-center flex-col text-center mb-2">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-primary text-2xl"
              />
              <h3 className="font-semibold text-2xl">69.5K</h3>
              <span className=" text-subtitle">
                Preseason Awards <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
            <div className="bg-primary/[0.4] rounded py-6 flex justify-center flex-col text-center mb-2">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-primary text-2xl"
              />
              <h3 className="font-semibold text-2xl">69.5K</h3>
              <span className=" text-subtitle">
                Personal Preferences <FontAwesomeIcon icon={faInfoCircle} />
              </span>
            </div>
          </div> */}

      {athleteCard?.bio && (
        <div className="px-4 mt-4 mb-8">
          <h6 className="font-semibold ">Bio</h6>
          <p className="text-subtitle ">{athleteCard.bio}</p>
        </div>
      )}
    </div>
  );
};

export default AthelteCard;
