"use client";

import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from "react-player";
import {
  faArrowLeft,
  faBookmark,
  faCircleInfo,
  faCloudDownload,
  faHeart,
  faInfoCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useAthleteCardVisibility } from "@/context/AthleteCardVisibilityProvider";

const AthelteCard = () => {
  const { isAthleteCardVisible, toggleAthleteCardVisible } =
    useAthleteCardVisibility();
  return (
    <>
      {
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
            <span className=" text-subtitle my-auto">
              Data From September 15, 2023
            </span>
            <FontAwesomeIcon
              icon={faCloudDownload}
              className="text-primary bg-sidebar p-1 rounded"
            />
          </div>
          <div className="flex px-4 my-3 gap-2">
            <img
              className="w-12 h-12 shadow border-white rounded-full my-auto"
              src="/images/Avatar.webp"
              alt="Rounded avatar"
            />
            <div className="flex flex-col my-auto">
              <h6 className="font-semibold leading-2 ">Olivia Rhye</h6>
              <span className="leading-none ">@olivia</span>
            </div>
            <FontAwesomeIcon
              icon={faBookmark}
              className="my-auto ml-auto text-primary bg-sidebar p-1 px-2 rounded"
            />
          </div>
          <div className="flex px-4 gap-2 mb-2">
            <img src="/svg/verifiedtick.svg" alt="" />
            <span className=" text-subtitle font-semibold">Tier 1 Athlete</span>
          </div>
          <div className="flex px-4 gap-2 mb-2">
            <img src="/svg/ion_location.svg" alt="" />
            <span className=" text-subtitle font-semibold">
              California, United States
            </span>
          </div>
          <div className="flex px-4 gap-2 my-4">
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img className="w-4 h-4" src="/svg/email.svg" alt="" />
            </div>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img className="w-4 h-4" src="/svg/instagram.svg" alt="" />
            </div>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img className="w-4 h-4" src="/svg/tiktok.svg" alt="" />
            </div>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img className="w-4 h-4" src="/svg/youtube.svg" alt="" />
            </div>
            <div className="bg-primary transition duration-150 hover:scale-110 cursor-pointer rounded-full px-2 py-2 text-white">
              <img className="w-4 h-4" src="/svg/twitter.svg" alt="" />
            </div>
          </div>
          <div className="bg-primary px-4 py-3 text-white ">
            <div className="grid grid-cols-3">
              <div className="flex flex-col gap-2">
                <span>
                  Followers <FontAwesomeIcon icon={faCircleInfo} />
                </span>
                <h3 className="text-3xl">1.6M</h3>
              </div>
              <div className="flex flex-col gap-2">
                <span>ER%</span>
                <h3 className="text-3xl">1.6M</h3>
              </div>
              <div className="flex flex-col gap-2">
                <span>Athlete Rating</span>
                <h3 className="text-3xl">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-200" />{" "}
                  4.9
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-sidebar px-4 py-3">
            <h6 className="font-semibold">Athlete Information</h6>
            <p className="text-subtitle  mb-3">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum,
              magnam?
            </p>
            <div className="w-full">
              {/* <ReactPlayer
                width={"330px"}
                height="200px"
                url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
              /> */}
            </div>
          </div>
          <div className="px-4 my-4">
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
          </div>
          <div className="px-4 mt-4 mb-8">
            <h6 className="font-semibold ">Bio</h6>
            <p className="text-subtitle ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              ab est quos minus provident, ullam dolorum accusantium doloribus
              rerum sunt repudiandae doloremque, illum dolor. Vitae, quisquam
              repudiandae quae, neque eveniet quam saepe temporibus commodi esse
              quasi, rem corporis deleniti asperiores repellendus voluptatibus
              itaque adipisci dolorem voluptatum cum tempore inventore! Officia.
            </p>
          </div>
        </div>
      }
    </>
  );
};

export default AthelteCard;
