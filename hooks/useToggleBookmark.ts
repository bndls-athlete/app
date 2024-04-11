import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { EntityType } from "@/types/entityTypes";
import useUserType from "@/hooks/useUserType";
import mongoose from "mongoose";

interface BookmarkResponse {
  success: boolean;
  message: string;
  isBookmarked: boolean;
  athleteId: string;
}

export const useToggleBookmark = (athleteId?: mongoose.Types.ObjectId) => {
  const queryClient = useQueryClient();
  const { type } = useUserType();

  const { data: bookmarkData, isLoading: isBookmarkLoading } = useQuery({
    queryKey: ["isBookmarked", athleteId?.toString()],
    queryFn: async () => {
      if (!athleteId) return { isBookmarked: false, athleteId: "" };
      const { data } = await axios.get<BookmarkResponse>(
        `/api/bookmark?athleteId=${athleteId}`
      );
      return { isBookmarked: data.isBookmarked, athleteId: data.athleteId };
    },
    enabled: type === EntityType.Company && !!athleteId,
  });

  const { mutate: toggleBookmark, isPending: isToggleLoading } = useMutation({
    mutationFn: async (athleteId: mongoose.Types.ObjectId) => {
      const { data } = await axios.put<BookmarkResponse>("/api/bookmark", {
        athleteId: athleteId.toString(),
      });
      return { isBookmarked: data.isBookmarked, athleteId: data.athleteId };
    },
    onSuccess: (data, error, athleteId) => {
      queryClient.setQueryData(["isBookmarked", data.athleteId], () => ({
        isBookmarked: data.isBookmarked,
        athleteId: data.athleteId,
      }));
      queryClient.invalidateQueries({ queryKey: ["savedAthletes"] });
    },
  });

  return {
    isBookmarked: bookmarkData?.isBookmarked || false,
    toggleBookmark: (athleteId: mongoose.Types.ObjectId) =>
      toggleBookmark(athleteId),
    isBookmarkLoading: isBookmarkLoading || isToggleLoading,
  };
};
