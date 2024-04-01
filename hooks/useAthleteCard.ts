import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AthleteCard } from "@/schemas/athleteCardSchema";
import useUserType from "./useUserType";
import { EntityType } from "@/types/entityTypes";

const fetchAthleteCard = async (): Promise<AthleteCard> => {
  const { data } = await axios.get("/api/athlete-card");
  return data.athleteCard;
};

export const useAthleteCard = () => {
  const queryClient = useQueryClient();
  const { type } = useUserType();

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
    enabled: type === EntityType.Athlete,
  });

  const invalidateAthleteCard = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete-card"] });
  };

  return { athleteCard, isLoading, refetchCard, error, invalidateAthleteCard };
};
