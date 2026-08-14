import { DashboardWorkspaceContext } from "@/context/dashboard-workspace/dashboard-workspace-context";
import { useContext } from "react";

export const useDashboardWorkspace = () => {
  const context = useContext(DashboardWorkspaceContext);

  if (!context) {
    throw new Error("useDashboardWorkspace must be used within DashboardWorkspaceProvider");
  }
  return context;
};
