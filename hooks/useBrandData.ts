import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Brand } from "@/schemas/brandSchema";
import useUserType from "./useUserType";
import { EntityType } from "@/types/entityTypes";
import { FileItem } from "@/app/api/get-file/route";

const fetchBrand = async (): Promise<Brand> => {
  const { data } = await axios.get<{
    success: boolean;
    message: string;
    brand: Brand;
  }>("/api/brand");

  if (data.brand.profilePicture) {
    const fileResponse = await axios.get<FileItem>(
      `/api/get-file?fileKey=${data.brand.profilePicture}`
    );
    data.brand.profilePicture = fileResponse.data.url;
  }

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
    enabled: type === EntityType.Company,
  });

  const invalidateBrand = () => {
    queryClient.invalidateQueries({ queryKey: ["brand"] });
  };

  return { brand, isLoading, error, refetchBrand, invalidateBrand };
};
