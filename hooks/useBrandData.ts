import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Brand } from "@/schemas/brandSchema";
import useUserType from "./useUserType";
import { EntityType } from "@/types/entityTypes";

const fetchBrand = async (): Promise<Brand> => {
  const { data } = await axios.get("/api/brand");
  return data.brand;
};

export const useBrandData = () => {
  const queryClient = useQueryClient();
  const { type } = useUserType();

  const {
    data: brand,
    isLoading,
    error,
    refetch: refetchBrand,
  } = useQuery<Brand, Error>({
    queryKey: ["brand"],
    queryFn: fetchBrand,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: type === EntityType.Company,
  });

  const invalidateBrand = () => {
    queryClient.invalidateQueries({ queryKey: ["brand"] });
  };

  return { brand, isLoading, error, refetchBrand, invalidateBrand };
};
