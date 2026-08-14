import { DashboardWorkspaceContext } from "@/context/dashboard-workspace/dashboard-workspace-context";
import { useCallback, useMemo, useState, type ReactNode } from "react";

const MAX_SELECTED_DOCUMENTS = 3;

export const DashboardWorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const isDocumentSelected = useCallback(
    (documentId: string) => {
      return selectedDocumentIds.includes(documentId);
    },
    [selectedDocumentIds],
  );

  const toggleDocumentSelection = useCallback((documentId: string) => {
    setSelectedDocumentIds((currentIds) => {
      if (currentIds.includes(documentId)) {
        return currentIds.filter((id) => id !== documentId);
      }

      if (currentIds.length >= MAX_SELECTED_DOCUMENTS) {
        return currentIds;
      }

      return [...currentIds, documentId];
    });
  }, []);

  const clearDocumentSelection = useCallback(() => {
    setSelectedDocumentIds([]);
  }, []);

  const value = useMemo(
    () => ({
      selectedDocumentIds,
      isDocumentSelected,
      toggleDocumentSelection,
      clearDocumentSelection,
    }),
    [selectedDocumentIds, isDocumentSelected, toggleDocumentSelection, clearDocumentSelection],
  );

  return (
    <DashboardWorkspaceContext.Provider value={value}>
      {children}
    </DashboardWorkspaceContext.Provider>
  );
};
