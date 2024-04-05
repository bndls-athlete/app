import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Athlete } from "@/schemas/athleteSchema";
import { useAthleteCard } from "@/context/AthleteCardProvider";
import { EntityType } from "@/types/entityTypes";
import useUserType from "./useUserType";

const fetchAthlete = async () => {
  const { data } = await axios.get<{
    success: boolean;
    message: string;
    athlete: Athlete;
  }>("/api/athlete");
  return data.athlete;
};

const fetchAthleteForBrand = async (athleteUserId: string) => {
  const { data } = await axios.get<{
    success: boolean;
    message: string;
    athlete: Athlete;
  }>(`/api/athlete/brand?athleteUserId=${athleteUserId}`);
  return data.athlete;
};

export const useAthleteData = () => {
  const queryClient = useQueryClient();
  const { athleteUserId } = useAthleteCard();
  const { type } = useUserType();

  const {
    data: athlete,
    isLoading,
    error,
    refetch: refetchAthlete,
  } = useQuery<Athlete, Error>({
    queryKey: ["athlete", type, athleteUserId],
    queryFn: () => {
      if (type === EntityType.Athlete) {
        return fetchAthlete();
      } else if (type === EntityType.Company && athleteUserId) {
        return fetchAthleteForBrand(athleteUserId);
      } else {
        throw new Error("Invalid user type or missing athlete ID");
      }
    },
    staleTime: type === EntityType.Company ? 4 * 60 * 1000 : Infinity, //4 mins for companies, Infinity for athletes
    enabled:
      type === EntityType.Athlete ||
      (type === EntityType.Company && !!athleteUserId),
  });

  const invalidateAthlete = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete"] });
  };

  return { athlete, isLoading, error, refetchAthlete, invalidateAthlete };
};
