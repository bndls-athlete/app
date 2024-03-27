import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Athlete } from "@/schemas/athleteSchema";

const fetchAthlete = async (): Promise<Athlete> => {
  const { data } = await axios.get("/api/athlete");
  return data.athlete;
};

export const useAthleteData = () => {
  const queryClient = useQueryClient();
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
  });

  const invalidateAthlete = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete"] });
  };

  return { athlete, isLoading, error, refetchAthlete, invalidateAthlete };
};
