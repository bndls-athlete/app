import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Athlete } from "@/schemas/athleteSchema";
import useUserType from "./useUserType";
import { EntityType } from "@/types/entityTypes";

const fetchAthlete = async (): Promise<Athlete> => {
  const { data } = await axios.get("/api/athlete");
  return data.athlete;
};

export const useAthleteData = () => {
  const queryClient = useQueryClient();
  const { type } = useUserType();
  const {
    data: athlete,
    isLoading,
    error,
    refetch: refetchAthlete,
  } = useQuery<Athlete, Error>({
    queryKey: ["athlete"],
    queryFn: fetchAthlete,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: type === EntityType.Athlete,
  });

  const invalidateAthlete = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete"] });
  };

  return { athlete, isLoading, error, refetchAthlete, invalidateAthlete };
};
