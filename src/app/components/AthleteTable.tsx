"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  Athlete,
  SocialMediaPlatform,
  socialMediaPlatformEnum,
} from "@/schemas/athleteSchema";
import formatIntlNumber from "@/helpers/formatIntlNumber";
import Table from "@/app/components/Table";
import { useAthleteCard } from "@/context/AthleteCardProvider";
import { useBrandData } from "@/hooks/useBrandData";

type AthleteTableProps = {
  athletes: Athlete | Athlete[];
  platform: SocialMediaPlatform;
  tableTitle: string;
  tableSubtitle: string;
};

const AthleteTable: React.FC<AthleteTableProps> = ({
  athletes,
  platform,
  tableTitle,
  tableSubtitle,
}) => {
  const getFollowersHeader = (platform: SocialMediaPlatform) => {
    switch (platform) {
      case socialMediaPlatformEnum.youtube:
        return "YouTube Subscribers";
      case socialMediaPlatformEnum.instagram:
        return "Instagram Followers";
      case socialMediaPlatformEnum.twitter:
        return "Twitter Followers";
      case socialMediaPlatformEnum.tiktok:
        return "TikTok Followers";
      default:
        return "Followers";
    }
  };

  const { showAthleteCard } = useAthleteCard();
  const { brand } = useBrandData();
  const athleteArray = Array.isArray(athletes) ? athletes : [athletes];

  return (
    <Table
      headers={[
        "Name Profile",
        getFollowersHeader(platform),
        "Athlete Rating",
        "Sport",
        "City, State",
      ]}
      textShowing={tableTitle}
      subtitle={tableSubtitle}
    >
      {athleteArray.map((athlete) => (
        <tr key={athlete.userId}>
          <td className="p-3 text-sm">
            <div
              className="flex p-2 gap-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => showAthleteCard(athlete.userId)}
            >
              <div className="flex flex-col my-auto">
                <h6 className="font-semibold underline leading-2">
                  {athlete.fullName || "Unknown"}
                </h6>
                <span className="leading-none">{athlete.email || "N/A"}</span>
              </div>
            </div>
          </td>
          <td className="p-3 text-sm">
            <h6 className="text-lg font-semibold">
              {formatIntlNumber(athlete.followers?.[platform]) || "N/A"}
            </h6>
            <span>
              {platform === socialMediaPlatformEnum.youtube
                ? "Subscribers"
                : "Followers"}
            </span>
          </td>
          <td className="p-3 text-sm">
            <div className="flex gap-2">
              <FontAwesomeIcon
                icon={faStar}
                className="text-2xl text-[#FFE661]"
              />
              <h6 className="text-xl font-semibold">
                {athlete.athleteRating?.toFixed(1) || "N/A"}
              </h6>
            </div>
          </td>
          <td className="p-3 text-sm">
            <h6 className="font-semibold">
              {athlete.sports && athlete.sports.length > 0
                ? athlete.sports.join(", ")
                : "N/A"}
            </h6>
          </td>
          <td className="p-3 text-sm">
            <span>
              {athlete.address?.city || "N/A"},{" "}
              {athlete.address?.state || "N/A"}
            </span>
          </td>
        </tr>
      ))}
    </Table>
  );
};

export default AthleteTable;
