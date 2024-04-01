"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "@/app/components/Breadcrumb";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import {
  faBookmark,
  faInfoCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Table from "@/app/components/Table";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import useUserType from "@/hooks/useUserType";
import { useRouter } from "next/navigation";

const Discovery = () => {
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "instagram";
  const { type } = useUserType();
  const router = useRouter();

  const links = [
    {
      path: `/${type}/discovery/?menu=instagram`,
      label: "Instagram",
      condition: true,
    },
    {
      path: `/${type}/discovery/?menu=youtube`,
      label: "YouTube",
      condition: true,
    },
    {
      path: `/${type}/discovery/?menu=tiktok`,
      label: "TikTok",
      condition: true,
    },
    {
      path: `/${type}/discovery/?menu=twitter`,
      label: "Twitter",
      condition: true,
    },
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  return (
    <div className="text-dark">
      <Breadcrumb />
      <div className="my-6">
        <h1 className="text-3xl font-semibold mb-2">Discovery</h1>
        <div className="mt-4">
          <div className="hidden lg:block">
            <div className="flex space-x-2">
              {links.map((link) =>
                link.condition ? (
                  <Link
                    key={link.label}
                    href={link.path}
                    className={`btn ${
                      menu === link.label.toLowerCase()
                        ? "btn-active btn-primary"
                        : "btn-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          </div>
          <div className="lg:hidden">
            <Select
              onChange={handleSelectChange}
              value={`/${type}/discovery/?menu=${menu}`}
            >
              {links.map(
                (link) =>
                  link.condition && (
                    <option key={link.label} value={link.path}>
                      {link.label}
                    </option>
                  )
              )}
            </Select>
          </div>
        </div>

        <div className="my-4">
          <Card>
            <Card.Header>
              Athlete Filters
              <p className="text-sm text-subtitle font-medium">
                Try starting with number of followers and audience filters
                narrowing your search
              </p>
            </Card.Header>
            <Card.Body>
              <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 mb-4">
                <div className="mb-1">
                  <label className="text-sm font-semibold">
                    Athlete Location
                  </label>
                  <Select
                    onChange={(e) => console.log(e.target.value)}
                    value="tes"
                  >
                    <option value="tes" disabled>
                      Where Are You Influencers?
                    </option>
                    <option value="oke">I Dont Know</option>
                  </Select>
                </div>
                <div className="mb-1">
                  <label className="text-sm font-semibold">
                    {searchParams.get("menu") == "youtube"
                      ? "Subscriber"
                      : "Followers"}
                  </label>
                  <div className="flex gap-3">
                    <Select
                      onChange={(e) => console.log(e.target.value)}
                      value="tes"
                    >
                      <option value="tes" disabled>
                        From?
                      </option>
                      <option value="oke">I Dont Know</option>
                    </Select>
                    <Select
                      onChange={(e) => console.log(e.target.value)}
                      value="tes"
                    >
                      <option value="tes" disabled>
                        To?
                      </option>
                      <option value="oke">I Dont Know</option>
                    </Select>
                  </div>
                </div>
                <div className="mb-1">
                  <label className="text-sm font-semibold">Gender</label>
                  <Select
                    onChange={(e) => console.log(e.target.value)}
                    value="tes"
                  >
                    <option value="tes" disabled>
                      Any
                    </option>
                    <option value="oke">I Dont Know</option>
                  </Select>
                </div>
                <div className="mb-1">
                  <label className="text-sm font-semibold">
                    Athlete Rating
                  </label>
                  <Select
                    onChange={(e) => console.log(e.target.value)}
                    value="tes"
                  >
                    <option value="tes" disabled>
                      Any
                    </option>
                    <option value="oke">I Dont Know</option>
                  </Select>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 mb-4">
                <div className="mb-1">
                  <label className="text-sm font-semibold">Sport</label>
                  <Select
                    onChange={(e) => console.log(e.target.value)}
                    value="tes"
                  >
                    <option value="tes" disabled>
                      Any
                    </option>
                    <option value="oke">I Dont Know</option>
                  </Select>
                </div>
                {/* <div className="mb-1">
                  <label className="text-sm font-semibold">
                    Engagement Rate
                    <FontAwesomeIcon icon={faInfoCircle} className="ml-1" />
                  </label>
                  <Select
                    onChange={(e) => console.log(e.target.value)}
                    value="tes"
                  >
                    <option value="tes" disabled>
                      Any
                    </option>
                    <option value="oke">I Dont Know</option>
                  </Select>
                </div> */}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="my-4">
          <Card>
            <Card.Header>
              Search by Username
              <p className="text-sm text-subtitle font-medium">
                Successful users often use this to check specific accounts and
                find similar athletes
              </p>
            </Card.Header>
            <Card.Body>
              <div className="flex gap-3 mb-4">
                <label className="text-sm font-semibold whitespace-nowrap">
                  Enter Username
                </label>
                <Input placeholder="@Username" />
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="flex justify-end">
                <div className="mb-2 flex gap-2">
                  <Button
                    theme="light"
                    className={"text-sm font-medium whitespace-nowrap"}
                  >
                    Clear all filters
                  </Button>
                  <Button className={"text-sm font-medium"}>
                    Find Athletes
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </div>
        <Table
          headers={[
            "Name Profile",
            "Followers",
            // "Engagement",
            // "Engagement Rate",
            "Athlete Rating",
            "Bookmark",
          ]}
          textShowing="profiles found by username"
          subtitle="Lorem ipsum dolor sit amet consectetur. Ipsum nec diam sed lectu."
          withPagination={false}
        >
          <tr>
            <td className="p-3 text-sm">
              <div className="flex p-2 gap-2">
                <img
                  className="w-10 h-10 rounded-full my-auto"
                  src="/images/Avatar.webp"
                  alt="Rounded avatar"
                />
                <div className="flex flex-col my-auto">
                  <h6 className="font-semibold leading-2">Olivia Rhye</h6>
                  <span className="leading-none">olivia@untitledui.com</span>
                </div>
              </div>
            </td>
            <td className="p-3 text-sm">
              <h6 className="text-lg font-semibold">1.6M</h6>
              <span>Followers</span>
            </td>
            {/* <td className="p-3 text-sm">
              <h6 className="text-lg font-semibold">202.8k</h6>
              <span>Engagements</span>
            </td>
            <td className="p-3 text-sm">
              <h6 className="text-lg font-semibold">202.8k</h6>
              <span>Engagements Rate</span>
            </td> */}
            <td className="p-3 text-sm">
              <div className="flex gap-2">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-2xl text-[#FFE661]"
                />
                <h6 className="text-xl font-semibold">4.9</h6>
              </div>
            </td>
            <td className="p-3 text-sm">
              <Button theme="light" className="px-3 py-2 w-auto">
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="text-primary text-xl w-4 h-4"
                />
              </Button>
            </td>
          </tr>
        </Table>
        <Table
          headers={[
            "Name Profile",
            "Followers",
            // "Engagement",
            // "Engagement Rate",
            "Athlete Rating",
            "Bookmark",
          ]}
          textShowing="looks a likes found"
          subtitle="Lorem ipsum dolor sit amet consectetur. Ipsum nec diam sed lectu."
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((row, index) => {
            return (
              <tr key={index}>
                <td className="p-3 text-sm">
                  <div className="flex p-2 gap-2">
                    <img
                      className="w-10 h-10 rounded-full my-auto"
                      src="/images/Avatar.webp"
                      alt="Rounded avatar"
                    />
                    <div className="flex flex-col my-auto">
                      <h6 className="font-semibold leading-2">Olivia Rhye</h6>
                      <span className="leading-none">
                        olivia@untitledui.com
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm">
                  <h6 className="text-lg font-semibold">1.6M</h6>
                  <span>Followers</span>
                </td>
                {/* <td className="p-3 text-sm">
                  <h6 className="text-lg font-semibold">202.8k</h6>
                  <span>Engagements</span>
                </td>
                <td className="p-3 text-sm">
                  <h6 className="text-lg font-semibold">202.8k</h6>
                  <span>Engagements Rate</span>
                </td> */}
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-2xl text-[#FFE661]"
                    />
                    <h6 className="text-xl font-semibold">4.9</h6>
                  </div>
                </td>
                <td className="p-3 text-sm">
                  <Button theme="light" className="px-3 py-2 w-auto">
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className="text-primary text-xl w-4 h-4"
                    />
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
    </div>
  );
};

export default Discovery;
