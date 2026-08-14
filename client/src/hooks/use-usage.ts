import { getUsage } from "@/services/usage.service";
import { useQuery } from "@tanstack/react-query";

export const useUsage = () => {
  return useQuery({
    queryKey: ["usage"],
    queryFn: getUsage,
  });
};
