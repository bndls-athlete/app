"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRight,
  faChevronRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

type BreadcrumbProps = {
  menu?: string;
  icon?: IconDefinition;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  menu = "Discovery",
  icon = faSearch,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary text-white p-2 flex justify-center items-center rounded-lg">
        <FontAwesomeIcon icon={icon} className="md:  w-5 h-5" />
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faChevronRight}
          className="text-sidebar w-5 h-5"
        />
      </div>
      <div className="bg-sidebar text-gray-900 px-3 py-1 rounded-lg">
        <span className="my-auto text-center font-semibold md:  whitespace-nowrap">
          {menu}
        </span>
      </div>
    </div>
  );
};

export default Breadcrumb;
