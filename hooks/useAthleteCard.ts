import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AthleteCard } from "@/schemas/athleteCardSchema";

const fetchAthleteCard = async (): Promise<AthleteCard> => {
  const { data } = await axios.get("/api/athlete-card");
  return data.athleteCard;
};

export const useAthleteCard = () => {
  const queryClient = useQueryClient();
  const {
    data: athleteCard,
    isLoading,
    refetch: refetchCard,
    error,
  } = useQuery<AthleteCard, Error>({
    queryKey: ["athlete-card"],
    queryFn: fetchAthleteCard,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const invalidateAthleteCard = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete-card"] });
  };

  return { athleteCard, isLoading, refetchCard, error, invalidateAthleteCard };
};
