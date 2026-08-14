import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api.types";
import type { Usage } from "@/types/usage.types";

export const getUsage = async (): Promise<Usage> => {
  const { data } = await api.get<ApiResponse<Usage>>("usage");

  return data.data;
};
