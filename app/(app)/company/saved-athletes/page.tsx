"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "@/app/components/Breadcrumb";
import Card from "@/app/components/Card";
import { faBookmark, faStar } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Athlete, SocialMediaPlatform } from "@/schemas/athleteSchema";
import AthleteTable from "@/app/components/AthleteTable";
import Pagination from "@/app/components/Pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const fetchSavedAthletes = async (page: number) => {
  const { data } = await axios.get<{
    success: boolean;
    message: string;
    bookmarks: Array<{
      _id: string;
      athlete: Athlete;
    }>;
    currentPage: number;
    totalPages: number;
  }>("/api/bookmarks", {
    params: { page },
  });
  return data;
};

const SavedAthletes = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [platform, setPlatform] = useState<SocialMediaPlatform>("instagram");

  const { isLoading, data: bookmarkData } = useQuery({
    queryKey: ["savedAthletes", currentPage],
    queryFn: () => fetchSavedAthletes(currentPage),
    staleTime: 4 * 60 * 1000, //4 mins
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="text-dark">
      <Breadcrumb menu="Saved Athlete Cards" icon={faBookmark} />
      <div className="my-6">
        <h1 className="text-3xl font-semibold mb-2">Saved Athlete Cards</h1>
        {bookmarkData?.bookmarks && bookmarkData.bookmarks.length > 0 ? (
          <>
            <AthleteTable
              athletes={bookmarkData.bookmarks.map(
                (bookmark) => bookmark.athlete
              )}
              platform={platform}
              tableTitle="Saved Athletes"
              tableSubtitle="Explore the profiles of your saved athletes."
            />
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={bookmarkData.currentPage}
                totalPages={bookmarkData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <Card>
            <Card.Body>
              <div className="text-center py-4 flex items-center justify-center flex-col">
                <FontAwesomeIcon
                  icon={faBookmark}
                  className="text-4xl text-primary mb-3 w-5 h-5"
                />
                <h3 className="text-xl font-semibold">No Saved Athletes</h3>
                <p>You haven't saved any athlete cards yet.</p>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedAthletes;
