import { createContext } from "react";

type DashboardWorkspaceContextValue = {
  selectedDocumentIds: string[];
  isDocumentSelected: (documentId: string) => boolean;
  toggleDocumentSelection: (documentId: string) => void;
  clearDocumentSelection: () => void;
  selectDocument: (documentId: string) => void;
};

export const DashboardWorkspaceContext = createContext<DashboardWorkspaceContextValue | null>(null);
