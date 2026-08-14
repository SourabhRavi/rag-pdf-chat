import { getDocuments } from "@/services/document.service";
import { useQuery } from "@tanstack/react-query";

export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });
};
