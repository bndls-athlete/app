import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "@/app/components/Breadcrumb";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import { faBookmark, faStar } from "@fortawesome/free-solid-svg-icons";
import Table from "@/app/components/Table";

const SavedAthlete = () => {
  return (
    <div className="text-dark">
      <Breadcrumb menu="Saved Athlete Cards" icon={faBookmark} />
      <div className="my-6">
        <h1 className="text-3xl font-semibold mb-2">Saved Athlete Cards</h1>
        {/* <span className="text-subtitle">Find every athlete in the NCAA with 1k+ followers.</span> */}

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
                <td
                  className="p-3 text-sm cursor-pointer"
                  // onClick={() => handleViewProfile()}
                >
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

export default SavedAthlete;
