import { DashboardWorkspaceContext } from "@/context/dashboard-workspace/dashboard-workspace-context";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

const MAX_SELECTED_DOCUMENTS = 3;

export const DashboardWorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const isDocumentSelected = useCallback(
    (documentId: string) => {
      return selectedDocumentIds.includes(documentId);
    },
    [selectedDocumentIds],
  );

  const toggleDocumentSelection = useCallback(
    (documentId: string) => {
      if (selectedDocumentIds.includes(documentId)) {
        setSelectedDocumentIds((currentIds) => currentIds.filter((id) => id !== documentId));
        return;
      }

      if (selectedDocumentIds.length >= MAX_SELECTED_DOCUMENTS) {
        toast.warning("Cannot select more than 3 documents.");
        return;
      }

      setSelectedDocumentIds((currentIds) => [...currentIds, documentId]);
    },
    [selectedDocumentIds],
  );

  const clearDocumentSelection = useCallback(() => {
    setSelectedDocumentIds([]);
  }, []);

  const selectDocument = useCallback(
    (documentId: string) => {
      if (selectedDocumentIds.includes(documentId)) {
        return;
      }

      if (selectedDocumentIds.length >= MAX_SELECTED_DOCUMENTS) {
        toast.warning("Cannot select more than 3 documents.");
        return;
      }

      setSelectedDocumentIds((currentIds) => [...currentIds, documentId]);
    },
    [selectedDocumentIds],
  );

  const deselectDocument = useCallback((documentId: string) => {
    setSelectedDocumentIds((currentIds) => currentIds.filter((id) => id !== documentId));
  }, []);

  const value = useMemo(
    () => ({
      selectedDocumentIds,
      isDocumentSelected,
      toggleDocumentSelection,
      clearDocumentSelection,
      selectDocument,
      deselectDocument,
    }),
    [
      selectedDocumentIds,
      isDocumentSelected,
      toggleDocumentSelection,
      clearDocumentSelection,
      selectDocument,
      deselectDocument,
    ],
  );

  return (
    <DashboardWorkspaceContext.Provider value={value}>
      {children}
    </DashboardWorkspaceContext.Provider>
  );
};
